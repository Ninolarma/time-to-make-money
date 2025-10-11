
'use client';

import {
  doc,
  setDoc,
  addDoc,
  deleteDoc,
  collection,
  serverTimestamp,
  type Firestore,
  writeBatch,
  query,
  getDocs,
  runTransaction,
  increment,
  updateDoc,
} from 'firebase/firestore';
import { type AnalyzeAndRateFaceOutput } from '@/ai/flows/types';
import { getAuth, deleteUser, type User } from 'firebase/auth';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';
import { v4 as uuidv4 } from 'uuid';

/**
 * Creates or updates a user's profile in Firestore.
 * This function now ONLY handles the new user's document creation.
 */
export async function upsertUserProfile(
  firestore: Firestore,
  user: {
    uid: string;
    email: string | null;
    displayName: string | null;
    photoURL?: string | null;
  }
) {
  const newUserRef = doc(firestore, 'users', user.uid);

  return runTransaction(firestore, async (transaction) => {
    const newUserDoc = await transaction.get(newUserRef);
    if (newUserDoc.exists()) {
      // If profile already exists, just update it with any new info.
      const updateData: { displayName?: string, photoURL?: string } = {};
      if (user.displayName && newUserDoc.data().displayName !== user.displayName) {
        updateData.displayName = user.displayName;
      }
       if (user.photoURL && newUserDoc.data().photoURL !== user.photoURL) {
        updateData.photoURL = user.photoURL;
      }
      if (Object.keys(updateData).length > 0) {
        transaction.update(newUserRef, updateData);
      }
      return;
    }

    const profileData = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL || null,
      createdAt: serverTimestamp(),
      subscription: {
        planName: 'Free',
        analysesRemaining: 1, // Start with 1 free analysis
        adviceChatsRemaining: 0,
        instagramCreditClaimed: false,
      },
    };

    transaction.set(newUserRef, profileData);
  }).catch((error: any) => {
    const permissionError = new FirestorePermissionError({
      path: `users/${user.uid}`,
      operation: 'create',
      requestResourceData: { newUser: user.uid },
    });
    errorEmitter.emit('permission-error', permissionError);
    throw error;
  });
}


/**
 * Saves a facial analysis result and decrements the user's analysis count.
 */
export async function saveAnalysisResult(
  firestore: Firestore,
  userId: string,
  analysisData: AnalyzeAndRateFaceOutput,
  imageUrls: string[]
) {
  const userRef = doc(firestore, 'users', userId);
  const analysisCollection = collection(firestore, 'users', userId, 'analysisResults');

  return runTransaction(firestore, async (transaction) => {
    const userDoc = await transaction.get(userRef);
    if (!userDoc.exists()) {
      throw new Error('User document does not exist!');
    }

    const currentAnalyses = userDoc.data().subscription?.analysesRemaining ?? 0;
    if (currentAnalyses <= 0) {
        throw new Error('You have no analysis credits remaining.');
    }
    
    transaction.update(userRef, {
      'subscription.analysesRemaining': increment(-1),
    });

    const newAnalysisRef = doc(analysisCollection);
    transaction.set(newAnalysisRef, {
      userId,
      ...analysisData,
      imageUrls,
      createdAt: serverTimestamp(),
    });
  }).catch((error) => {
    const permissionError = new FirestorePermissionError({
      path: userRef.path,
      operation: 'update',
      requestResourceData: { 'subscription.analysesRemaining': increment(-1) }
    });
    errorEmitter.emit('permission-error', permissionError);
    throw error;
  });
}


/**
 * Deletes a specific analysis result from Firestore.
 */
export async function deleteAnalysisResult(
  firestore: Firestore,
  userId: string,
  analysisId: string
) {
  const analysisRef = doc(firestore, 'users', userId, 'analysisResults', analysisId);
  return deleteDoc(analysisRef).catch(error => {
    const permissionError = new FirestorePermissionError({
      path: analysisRef.path,
      operation: 'delete',
    });
    errorEmitter.emit('permission-error', permissionError);
    throw error;
  });
}


/**
 * Deletes all of a user's analysis data without deleting the account.
 */
export async function deleteAllUserData(firestore: Firestore, userId: string) {
  const batch = writeBatch(firestore);

  const analysisQuery = query(
    collection(firestore, 'users', userId, 'analysisResults')
  );
  const analysisSnapshot = await getDocs(analysisQuery);
  analysisSnapshot.forEach((doc) => {
    batch.delete(doc.ref);
  });

  return batch.commit().catch(error => {
      // This is less specific, but we can report the user's path.
      const permissionError = new FirestorePermissionError({
          path: `users/${userId}/analysisResults`,
          operation: 'delete'
      });
      errorEmitter.emit('permission-error', permissionError);
      throw error;
  });
}


/**
 * Deletes a user's account and all their associated data.
 */
export async function deleteUserAccount(firestore: Firestore, userId: string) {
  const auth = getAuth();
  const currentUser = auth.currentUser;

  if (!currentUser || currentUser.uid !== userId) {
    throw new Error('You can only delete your own account.');
  }

  const batch = writeBatch(firestore);
  const userProfileRef = doc(firestore, 'users', userId);
  batch.delete(userProfileRef);

  await batch.commit().catch(error => {
      const permissionError = new FirestorePermissionError({
          path: userProfileRef.path,
          operation: 'delete'
      });
      errorEmitter.emit('permission-error', permissionError);
      throw error;
  });

  await deleteUser(currentUser);
}

/**
 * Updates a user's profile in Firebase Auth and Firestore.
 */
export async function updateUserProfile(
  firestore: Firestore,
  userId: string,
  data: { displayName?: string; photoURL?: string }
) {
  const auth = getAuth();
  const currentUser = auth.currentUser;

  if (!currentUser || currentUser.uid !== userId) {
    throw new Error('You can only update your own profile.');
  }
  
  const user = currentUser as User;
  const userProfileRef = doc(firestore, 'users', userId);

  await updateDoc(userProfileRef, data).catch(error => {
    const permissionError = new FirestorePermissionError({
      path: userProfileRef.path,
      operation: 'update',
      requestResourceData: data,
    });
    errorEmitter.emit('permission-error', permissionError);
    throw error;
  });

  const { updateProfile } = await import('firebase/auth');
  await updateProfile(user, data);
}


/**
 * Decrements the user's advice chat count.
 */
export async function decrementAdviceChats(firestore: Firestore, userId: string) {
    const userRef = doc(firestore, 'users', userId);
    return updateDoc(userRef, {
        'subscription.adviceChatsRemaining': increment(-1),
    }).catch(error => {
        const permissionError = new FirestorePermissionError({
            path: userRef.path,
            operation: 'update',
            requestResourceData: { 'subscription.adviceChatsRemaining': increment(-1) }
        });
        errorEmitter.emit('permission-error', permissionError);
        throw error;
    });
}

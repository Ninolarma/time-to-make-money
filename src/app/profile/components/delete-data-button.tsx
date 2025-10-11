'use client';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { deleteAllUserData } from '@/firebase/firestore/mutations';
import { useUser, useFirestore } from '@/firebase';
import { Trash2 } from 'lucide-react';

export function DeleteDataButton() {
  const { user } = useUser();
  const firestore = useFirestore();
  const { toast } = useToast();

  const handleDeleteData = async () => {
    if (!user || !firestore) return;
    try {
      await deleteAllUserData(firestore, user.uid);
      toast({
        title: 'All Data Deleted',
        description:
          'Your analysis history has been successfully deleted.',
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Could not delete your data.',
        variant: 'destructive',
      });
    }
  };

  if (!user) {
    return null;
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive" className="w-full sm:w-auto">
          <Trash2 className="mr-2 h-4 w-4" /> Delete All My Data
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete all of
            your analysis history from our servers. Your account will not be
            deleted.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDeleteData}
            className="bg-red-600 hover:bg-red-700"
          >
            Yes, delete all my data
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}


'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Clock, Edit, Trash2, Eye } from 'lucide-react';
import { useUser, useFirestore, useDoc, useMemoFirebase } from '@/firebase';
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
import { useToast } from '@/hooks/use-toast';
import {
  deleteAnalysisResult,
  updateUserProfile,
} from '@/firebase/firestore/mutations';
import { collection, query } from 'firebase/firestore';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { doc } from 'firebase/firestore';
import { useCollection } from '@/firebase/firestore/use-collection';


function EditProfileDialog({ user }: { user: any }) {
  const { toast } = useToast();
  const [displayName, setDisplayName] = useState(user.displayName || '');
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const firestore = useFirestore();

  const handleSave = async () => {
    if (!user || !firestore) return;
    setIsLoading(true);
    try {
      await updateUserProfile(firestore, user.uid, { displayName });
      toast({
        title: 'Success!',
        description: 'Your profile has been updated.',
      });
      setIsOpen(false);
    } catch (error: any) {
      toast({
        title: 'Error',
        description: 'Failed to update profile. Check permissions.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="mt-4">
          <Edit className="mr-2 h-4 w-4" /> Edit Profile
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Profile</DialogTitle>
          <DialogDescription>
            Make changes to your profile here. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Name
            </Label>
            <Input
              id="name"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="photo" className="text-right">
              Photo
            </Label>
            <div className="col-span-3">
              <Input id="photo" type="file" disabled />
              <p className="text-xs text-muted-foreground mt-1">
                Photo uploads coming soon!
              </p>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleSave} disabled={isLoading}>
            {isLoading ? 'Saving...' : 'Save changes'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function AnalysisDetailDialog({
  analysis,
  isOpen,
  onClose,
}: {
  analysis: any;
  isOpen: boolean;
  onClose: () => void;
}) {
  if (!analysis) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="font-headline text-2xl">
            Analysis from{' '}
            {new Date(analysis.createdAt?.toDate()).toLocaleDateString()}
          </DialogTitle>
          <DialogDescription>
            Here are the full details of your facial analysis.
          </DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-3 gap-2 mt-4 max-h-[60vh] overflow-y-auto">
          {analysis.imageUrls?.map((url: string, index: number) => (
            <div key={index} className="relative aspect-square">
              <Image
                src={url}
                alt={`Analysis image ${index + 1}`}
                fill
                className="object-cover rounded-md"
              />
            </div>
          ))}
        </div>
        <div className="space-y-6 mt-6">
          <div>
            <h3 className="font-semibold text-lg mb-2">Face Shape</h3>
            <p className="text-2xl font-bold font-headline text-foreground">
              {analysis.faceShape.shape}
            </p>
            <p className="text-muted-foreground mt-1">
              {analysis.faceShape.description}
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {analysis.featureRatings.map((feature: any) => (
              <div key={feature.name} className="space-y-2">
                <div className="flex justify-between items-center">
                  <p className="font-semibold">{feature.name}</p>
                  <p className="text-sm font-medium text-primary">
                    {feature.rating}/10
                  </p>
                </div>
                <Progress value={feature.rating * 10} className="h-2" />
                <p className="text-sm text-muted-foreground">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export function ProfileClient() {
  const { user, isUserLoading } = useUser();
  const firestore = useFirestore();
  const { toast } = useToast();
  const [selectedAnalysis, setSelectedAnalysis] = useState<any | null>(null);

  const analysisQuery = useMemoFirebase(
    () =>
      user && firestore
        ? query(collection(firestore, 'users', user.uid, 'analysisResults'))
        : null,
    [user, firestore]
  );

  const {
    data: analysisHistory,
    isLoading: loading,
    error,
  } = useCollection(analysisQuery);

  const userProfileRef = useMemoFirebase(
    () => (user && firestore ? doc(firestore, 'users', user.uid) : null),
    [user, firestore]
  );
  const { data: userProfile, isLoading: isProfileLoading } = useDoc(userProfileRef);

  const handleDeleteAnalysis = async (id: string) => {
    if (!firestore || !user) return;
    try {
      await deleteAnalysisResult(firestore, user.uid, id);
      toast({
        title: 'Success',
        description: 'Analysis result has been deleted.',
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description:
          'Could not delete the analysis result. Check permissions.',
        variant: 'destructive',
      });
    }
  };

  if (isUserLoading || isProfileLoading) {
    return null; // Don't render anything until we know if there is a user
  }
  
  if (!user || !userProfile) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <p className="text-muted-foreground">Please log in to see your profile.</p>
          <Button asChild className="mt-4">
            <Link href="/login">Log In</Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  const analysesRemaining = userProfile.subscription?.analysesRemaining ?? 0;

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-1 space-y-8">
          <Card>
            <CardContent className="p-6 text-center">
              <Avatar className="w-24 h-24 mx-auto mb-4 border-4 border-primary/20">
                <AvatarImage src={user.photoURL ?? undefined} alt="User" />
                <AvatarFallback>
                  {user.displayName
                    ? user.displayName.charAt(0)
                    : user.email?.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <h2 className="text-2xl font-bold font-headline">
                {user.displayName || 'User'}
              </h2>
              <p className="text-muted-foreground">{user.email}</p>
              <EditProfileDialog user={user} />
            </CardContent>
          </Card>
        </div>
        <div className="md:col-span-2">
          <h2 className="text-3xl font-bold font-headline mb-6">
            Analysis History
          </h2>
           <p className="text-muted-foreground -mt-4 mb-6">You have <span className="font-bold text-primary">{analysesRemaining}</span> analyses remaining.</p>
          <div className="space-y-6">
            {loading && <p>Loading history...</p>}
            {error && (
              <p className="text-red-500">
                Error loading history. Check console for details.
              </p>
            )}
            {!loading && analysisHistory && analysisHistory.length === 0 && (
              <p>You have no analysis history yet.</p>
            )}
            {analysisHistory?.map((item: any) => (
              <Card
                key={item.id}
                className="overflow-hidden hover:border-primary/50 transition-colors group"
              >
                <div className="grid grid-cols-1 sm:grid-cols-3">
                  <div className="sm:col-span-1">
                    {item.imageUrls?.[0] && (
                      <div className="relative h-full min-h-[150px]">
                        <Image
                          src={item.imageUrls[0]}
                          alt={`Analysis from ${new Date(
                            item.createdAt?.toDate()
                          ).toLocaleDateString()}`}
                          fill
                          className="object-cover"
                        />
                      </div>
                    )}
                  </div>
                  <div className="sm:col-span-2">
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start">
                        <div>
                          <Badge variant="outline" className="mb-2">
                            <Clock className="h-3 w-3 mr-1.5" />
                            {new Date(
                              item.createdAt?.toDate()
                            ).toLocaleDateString()}
                          </Badge>
                          <p className="text-muted-foreground line-clamp-2">
                            Face Shape: {item.faceShape.shape}. Rated features
                            include jawline, forehead, and more.
                          </p>
                        </div>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity text-red-500 hover:text-red-500 hover:bg-red-500/10"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>
                                Delete Analysis Result?
                              </AlertDialogTitle>
                              <AlertDialogDescription>
                                This will permanently delete this analysis
                                result. This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDeleteAnalysis(item.id)}
                                className="bg-red-600 hover:bg-red-700"
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                      <Button
                        variant="link"
                        className="p-0 mt-2 h-auto text-primary"
                        onClick={() => setSelectedAnalysis(item)}
                      >
                        <Eye className="mr-2 h-4 w-4" />
                        View Full Analysis
                      </Button>
                    </CardContent>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
      <AnalysisDetailDialog
        analysis={selectedAnalysis}
        isOpen={!!selectedAnalysis}
        onClose={() => setSelectedAnalysis(null)}
      />
    </>
  );
}

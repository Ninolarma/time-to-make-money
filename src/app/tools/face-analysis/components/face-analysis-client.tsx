
'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { analyzeAndRateFace } from '@/ai/flows/analyze-and-rate-face';
import { type AnalyzeAndRateFaceOutput } from '@/ai/flows/types';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import {
  Sparkles,
  Bot,
  User,
  ArrowLeft,
  ArrowRight,
  Gem,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useUser, useFirestore, useDoc, useMemoFirebase } from '@/firebase';
import { saveAnalysisResult } from '@/firebase/firestore/mutations';
import { useRouter } from 'next/navigation';
import { doc } from 'firebase/firestore';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { PersonalizedAdvice } from './personalized-advice';

type View = 'front' | 'left' | 'right';

const uploadSlots: { view: View; label: string; icon: React.ReactNode }[] = [
  {
    view: 'left',
    label: 'Left Profile',
    icon: <ArrowLeft className="h-8 w-8 text-muted-foreground" />,
  },
  {
    view: 'front',
    label: 'Front View',
    icon: <User className="h-8 w-8 text-muted-foreground" />,
  },
  {
    view: 'right',
    label: 'Right Profile',
    icon: <ArrowRight className="h-8 w-8 text-muted-foreground" />,
  },
];

function FeatureRating({
  name,
  rating,
  description,
}: {
  name: string;
  rating: number;
  description: string;
}) {
  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <p className="font-semibold">{name}</p>
        <p className="text-sm font-medium text-primary">{rating}/10</p>
      </div>
      <Progress value={rating * 10} className="h-2" />
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  );
}

function NoCreditsDialog({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-3xl font-headline text-center">
            Analysis Credit Used
          </DialogTitle>
          <DialogDescription className="text-center text-base pt-2">
            You've used your free analysis. To get more, please subscribe to one of our plans!
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-center py-4">
           <Button asChild>
              <Link href="/subscription">
                <Gem className="mr-2 h-4 w-4" />
                View Subscription Plans
              </Link>
            </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export function FaceAnalysisClient() {
  const [files, setFiles] = useState<{ [key in View]?: File }>({});
  const [previewUrls, setPreviewUrls] = useState<{ [key in View]?: string }>(
    {}
  );
  const [analysisResult, setAnalysisResult] =
    useState<AnalyzeAndRateFaceOutput | null>(null);
  const [isLoading, setIsLoading] =useState(false);
  const [showNoCreditsDialog, setShowNoCreditsDialog] = useState(false);
  // This state is used to trigger a re-fetch of the user profile data
  const [creditState, setCreditState] = useState(0);


  const { toast } = useToast();
  const { user, isUserLoading } = useUser();
  const firestore = useFirestore();
  const router = useRouter();

  const userProfileRef = useMemoFirebase(
    () => (user && firestore ? doc(firestore, 'users', user.uid) : null),
    [user, firestore, creditState] // Re-fetch when credit state changes
  );
  const { data: userProfile, isLoading: isProfileLoading } =
    useDoc(userProfileRef);

  const handleFileChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    view: View
  ) => {
    if (!user) {
      toast({
        title: 'Authentication Required',
        description: 'You must be logged in to upload photos.',
        variant: 'destructive',
      });
      router.push('/login');
      return;
    }
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      setFiles((prev) => ({ ...prev, [view]: selectedFile }));
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrls((prev) => ({
          ...prev,
          [view]: reader.result as string,
        }));
      };
      reader.readAsDataURL(selectedFile);
      setAnalysisResult(null);
    }
  };

  const handleSubmit = async () => {
    if (!user || !firestore || !userProfile) {
      toast({
        title: 'Authentication Required',
        description: 'You must be logged in to perform an analysis.',
        variant: 'destructive',
      });
      return;
    }

    if (Object.keys(files).length < 3) {
      toast({
        title: 'Missing Photos',
        description: 'Please upload all three photos to analyze.',
        variant: 'destructive',
      });
      return;
    }
    
    // Check if user has analysis credits
    if ((userProfile.subscription?.analysesRemaining ?? 0) <= 0) {
      setShowNoCreditsDialog(true);
      return;
    }

    setIsLoading(true);
    setAnalysisResult(null);

    try {
      const result = await analyzeAndRateFace({
        frontPhotoDataUri: previewUrls.front!,
        leftPhotoDataUri: previewUrls.left!,
        rightPhotoDataUri: previewUrls.right!,
      });
      

      // Save the result to Firestore and decrement credits
      await saveAnalysisResult(firestore, user.uid, result, [
        previewUrls.front!,
        previewUrls.left!,
        previewUrls.right!,
      ]);
      setCreditState(prev => prev + 1); // Trigger a re-fetch of user profile

      setAnalysisResult(result);

      toast({
        title: 'Analysis Complete!',
        description: 'Your analysis has been saved to your profile.',
      });
    } catch (error) {
      console.error('AI analysis failed:', error);
      // The contextual error is already emitted by the mutation function,
      // so we just show a generic message to the user.
      toast({
        title: 'Analysis Failed',
        description: 'Could not save your analysis. Please check permissions.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const allFilesUploaded = Object.keys(files).length === 3;
  const canAnalyze = !isLoading && allFilesUploaded && !isUserLoading && !isProfileLoading;
  const isSubscribedUser = userProfile?.subscription?.planName && userProfile.subscription.planName !== 'Free';
  const analysesRemaining = userProfile?.subscription?.analysesRemaining ?? 0;

  return (
    <>
      <NoCreditsDialog
        isOpen={showNoCreditsDialog}
        onClose={() => setShowNoCreditsDialog(false)}
      />
    <Card className="w-full">
      <CardContent className="p-6 space-y-8">
        <div>
          <label className="font-medium text-lg">Upload Your Photos</label>
          <p className="text-muted-foreground">
            For the best results, provide clear photos of your face from the
            front, left, and right.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            {uploadSlots.map(({ view, label, icon }) => (
              <div key={view}>
                <label
                  htmlFor={`photo-upload-${view}`}
                  className={cn(
                    'cursor-pointer aspect-square rounded-lg border-2 border-dashed flex flex-col items-center justify-center text-center p-4 transition-colors hover:border-primary',
                    previewUrls[view] ? 'border-solid' : 'border-dashed',
                    (!user || isUserLoading) && 'cursor-not-allowed opacity-50'
                  )}
                >
                  {previewUrls[view] ? (
                    <div className="relative w-full h-full rounded-md overflow-hidden">
                      <Image
                        src={previewUrls[view]!}
                        alt={`${label} preview`}
                        fill
                        className="object-cover"
                      />
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-2 text-muted-foreground">
                      {icon}
                      <span className="font-semibold text-sm">{label}</span>
                      <span className="text-xs">Click to upload</span>
                    </div>
                  )}
                </label>
                <Input
                  id={`photo-upload-${view}`}
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileChange(e, view)}
                  className="hidden"
                  disabled={!user || isUserLoading}
                />
              </div>
            ))}
          </div>
           {userProfile && (
            <p className="text-center text-sm text-muted-foreground mt-4">
              You have{' '}
              <span className="font-bold text-primary">
                {analysesRemaining}
              </span>{' '}
              analyses remaining.
            </p>
          )}
        </div>

        <div className="text-center">
          <Button
            onClick={handleSubmit}
            disabled={!canAnalyze}
            size="lg"
          >
            {isLoading ? (
              <>
                <Sparkles className="mr-2 h-4 w-4 animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-4 w-4" />
                Analyze My Face
              </>
            )}
          </Button>
          {!user && !isUserLoading && (
            <p className="text-sm text-muted-foreground mt-2">
              <Link href="/login" className="text-primary underline">
                Log in
              </Link>{' '}
              to analyze your photos.
            </p>
          )}
        </div>

        {isLoading && (
          <div className="flex flex-col items-center justify-center text-center p-8 rounded-lg border border-dashed border-primary/50 bg-primary/10">
            <Bot className="w-12 h-12 text-primary animate-pulse mb-4" />
            <p className="font-semibold text-primary">
              Our AI stylist is analyzing your photos...
            </p>
            <p className="text-muted-foreground text-sm">
              This may take a moment.
            </p>
          </div>
        )}

        {analysisResult && !isLoading && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 font-headline text-primary">
                <Sparkles className="h-6 w-6" />
                Your Facial Analysis
              </CardTitle>
              <CardDescription>
                Here is a neutral, AI-powered analysis of your facial features.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="font-semibold text-lg mb-2">Face Shape</h3>
                <p className="text-2xl font-bold font-headline text-foreground">
                  {analysisResult.faceShape.shape}
                </p>
                <p className="text-muted-foreground mt-1">
                  {analysisResult.faceShape.description}
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {analysisResult.featureRatings.map((feature) => (
                  <FeatureRating key={feature.name} {...feature} />
                ))}
              </div>
              {isSubscribedUser && userProfile && analysisResult && (
                <div className="!mt-10 border-t pt-8">
                  <PersonalizedAdvice
                    analysisResult={analysisResult}
                    userProfile={userProfile}
                    onAdviceGiven={() => setCreditState(prev => prev + 1)}
                  />
                </div>
              )}
              {!isSubscribedUser && (
                <div className="!mt-10 text-center border-t pt-8">
                  <h3 className="text-2xl font-headline font-semibold">
                    Ready for the Next Step?
                  </h3>
                  <p className="text-muted-foreground max-w-lg mx-auto mt-2">
                    Unlock personalized style recommendations, including
                    clothing, hairstyle, and accessory advice tailored to your
                    unique features.
                  </p>
                  <Button asChild size="lg" className="mt-6">
                    <Link href="/subscription">
                      <Gem className="mr-2 h-5 w-5" />
                      Get Personalized Style Advice
                    </Link>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </CardContent>
    </Card>
    </>
  );
}

    
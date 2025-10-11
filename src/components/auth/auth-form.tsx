
'use client';

import { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Button, buttonVariants } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { ArrowRight, Loader2 } from 'lucide-react';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  updateProfile,
} from 'firebase/auth';
import { useAuth, useFirestore } from '@/firebase';
import { upsertUserProfile } from '@/firebase/firestore/mutations';
import React from 'react';
import { Label } from '@/components/ui/label';

const GoogleIcon = () => (
  <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24">
    <path
      fill="currentColor"
      d="M21.35,11.1H12.18V13.83H18.69C18.36,17.64 15.19,19.27 12.19,19.27C8.36,19.27 5,16.25 5,12C5,7.75 8.36,4.73 12.19,4.73C15.28,4.73 17.27,6.82 17.27,6.82L19.09,5.1C19.09,5.1 16.71,3 12.19,3C6.42,3 2,7.42 2,12C2,16.58 6.42,21 12.19,21C18.2,21 22,16.92 22,11.33C22,10.87 21.35,11.1 21.35,11.1V11.1Z"
    />
  </svg>
);

const loginSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address.' }),
  password: z
    .string()
    .min(8, { message: 'Password must be at least 8 characters.' }),
});

const signupSchema = z.object({
  displayName: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
  email: z.string().email({ message: 'Please enter a valid email address.' }),
  password: z
    .string()
    .min(8, { message: 'Password must be at least 8 characters.' }),
  acceptTerms: z.boolean().refine(val => val === true, {
    message: 'You must accept the Privacy Policy to create an account.',
  }),
  receiveEmails: z.boolean().optional(),
});

type UserFormValue = z.infer<typeof loginSchema> | z.infer<typeof signupSchema>;

interface AuthFormProps {
  mode: 'login' | 'signup';
}

function AuthFormComponent({ mode }: AuthFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const auth = useAuth();
  const firestore = useFirestore();
  const router = useRouter();
  
  const formSchema = mode === 'login' ? loginSchema : signupSchema;

  const defaultValues = {
    email: '',
    password: '',
    ...(mode === 'signup' && { 
      displayName: '',
      acceptTerms: false,
      receiveEmails: true,
    }),
  };

  const form = useForm<UserFormValue>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const onSubmit = async (data: UserFormValue) => {
    setIsLoading(true);
    if (!auth || !firestore) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Firebase not initialized correctly.',
      });
      setIsLoading(false);
      return;
    }
    try {
      if (mode === 'signup') {
        const signupData = data as z.infer<typeof signupSchema>;
        
        await handleSignup(signupData.email, signupData.password, signupData.displayName);
        
        toast({
          title: 'Success!',
          description: 'Your account has been created.',
        });

      } else {
        const loginData = data as z.infer<typeof loginSchema>;
        await signInWithEmailAndPassword(auth, loginData.email, loginData.password);
        toast({
          title: 'Success!',
          description: 'You are now logged in.',
        });
      }
      router.push('/profile');
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Authentication Failed',
        description: error.message || 'An unexpected error occurred.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignup = async (email: string, password: string, displayName: string | null) => {
    if(!auth || !firestore) return;

    // 1) Create auth account
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
  
    // Optionally update displayName in Auth
    if (displayName) {
      try {
        await updateProfile(user, { displayName });
      } catch (err) {
        console.warn('Failed to update auth profile name:', err);
      }
    }
  
    // 2) Create the Firestore user profile
    await upsertUserProfile(firestore, {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName || displayName,
      photoURL: user.photoURL || null,
    });
  
    return user;
  }

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    if (!auth || !firestore) {
      setIsLoading(false);
      return;
    }
    try {
      const provider = new GoogleAuthProvider();
      const userCredential = await signInWithPopup(auth, provider);
      const newUser = userCredential.user;
      
      await upsertUserProfile(firestore, newUser);

      toast({
        title: 'Success!',
        description: 'You are now logged in with Google.',
      });
      router.push('/profile');
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Google Sign-In Failed',
        description: error.message || 'Could not sign in with Google.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const title = mode === 'login' ? 'Welcome Back' : 'Create an Account';
  const description =
    mode === 'login'
      ? 'Enter your email to sign in to your account.'
      : 'Enter your email to create an account.';
  const buttonLabel = mode === 'login' ? 'Sign In' : 'Sign Up';
  const switchModeLabel =
    mode === 'login' ? "Don't have an account?" : 'Already have an account?';
  const switchModeLinkText = mode === 'login' ? 'Sign up' : 'Sign in';

  return (
    <>
      <div className="flex flex-col space-y-2 text-center">
        <h1 className="text-2xl font-semibold tracking-tight font-headline">
          {title}
        </h1>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      <div className="grid gap-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
             {mode === 'signup' && (
              <FormField
                control={form.control}
                name="displayName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="John Doe"
                        disabled={isLoading}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="you@example.com"
                      disabled={isLoading}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="••••••••"
                      disabled={isLoading}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             {mode === 'signup' && (
               <>
                <FormField
                  control={form.control}
                  name="receiveEmails"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                       <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          id="receive-emails-checkbox"
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <Label htmlFor="receive-emails-checkbox">
                          Email me with news and updates
                        </Label>
                        <FormDescription>
                           Receive emails about new features and updates. You're the boss—no marketing, just the good stuff.
                        </FormDescription>
                      </div>
                    </FormItem>
                  )}
                />
                 <FormField
                  control={form.control}
                  name="acceptTerms"
                  render={({ field }) => (
                     <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          id="accept-terms-checkbox"
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                         <Label htmlFor="accept-terms-checkbox">
                          I agree to the{' '}
                          <Link href="/privacy-policy" className="underline text-primary hover:text-primary/80" target="_blank">
                            Privacy Policy
                          </Link>
                        </Label>
                        <FormMessage />
                      </div>
                    </FormItem>
                  )}
                />
              </>
            )}
            <Button disabled={isLoading || !auth || !firestore} className="w-full">
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {buttonLabel}
            </Button>
          </form>
        </Form>
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">
              Or continue with
            </span>
          </div>
        </div>
        <Button
          variant="outline"
          type="button"
          disabled={isLoading || !auth || !firestore}
          onClick={handleGoogleSignIn}
        >
          {isLoading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <GoogleIcon />
          )}
          Google
        </Button>
      </div>

      <p className="px-8 text-center text-sm text-muted-foreground">
        <Link
          href={mode === 'login' ? '/signup' : '/login'}
          className={cn(
            buttonVariants({ variant: 'link' }),
            'px-0 text-muted-foreground'
          )}
        >
          {switchModeLabel} {switchModeLinkText}
          <ArrowRight className="ml-1 h-4 w-4" />
        </Link>
      </p>
    </>
  );
}

// The useSearchParams hook must be used within a Suspense boundary.
// We wrap the component to ensure this.
export function AuthForm({ mode }: AuthFormProps) {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AuthFormComponent mode={mode} />
    </Suspense>
  )
}

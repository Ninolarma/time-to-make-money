import { ProfileClient } from './components/profile-client';
import { ShieldCheck, Trash2 } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { DeleteDataButton } from './components/delete-data-button';

export const metadata = {
  title: 'My Profile - ReflectAI',
};

export default function ProfilePage() {
  return (
    <div className="container mx-auto max-w-5xl py-12">
      <div className="mb-12">
        <h1 className="text-4xl md:text-5xl font-bold font-headline">
          My Profile
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Manage your analysis history, your data, and your style journey.
        </p>
      </div>
      <Alert className="mb-8 border-green-500/50 text-green-500">
        <ShieldCheck className="h-4 w-4 !text-green-500" />
        <AlertTitle className="font-semibold text-green-400">
          You Are The Boss of Your Data
        </AlertTitle>
        <AlertDescription className="text-green-500/80">
          Your privacy is our priority. You have full control to view, manage,
          and delete your photos and analysis history at any time. Your data
          belongs to you.
        </AlertDescription>
      </Alert>

      <div className="mb-8">
        <DeleteDataButton />
      </div>

      <ProfileClient />
    </div>
  );
}

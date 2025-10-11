import { AuthForm } from '@/components/auth/auth-form';

export default function SignUpPage() {
  return (
    <div className="container relative flex pt-24 flex-col items-center justify-center lg:px-0">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <AuthForm mode="signup" />
      </div>
    </div>
  );
}

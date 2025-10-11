
export const metadata = {
    title: 'Privacy Policy - ReflectAI',
  };
  
  export default function PrivacyPolicyPage() {
    return (
      <div className="container mx-auto max-w-3xl py-12 space-y-6">
        <h1 className="text-4xl font-headline font-bold text-primary">Privacy Policy for ReflectAI</h1>
        <p className="text-muted-foreground">Last Updated: October 2, 2025</p>
  
        <div className="space-y-4 text-foreground/90">
          <p>
            At ReflectAI, we are committed to protecting your privacy and giving
            you full control over your personal data. This Privacy Policy
            outlines how we collect, use, store, and protect your information when
            you use our web application, ReflectAI, a style improvement service
            designed to enhance your personal aesthetic through AI-powered face
            analysis and personalized recommendations. ReflectAI is not a
            provider of medical advice; our services are intended solely for
            style and aesthetic enhancement.
          </p>
  
          <h2 className="text-2xl font-headline font-semibold pt-4 border-t border-border">1. Information We Collect</h2>
          <p>
            We collect the following types of information to provide and improve
            our services:
          </p>
          <ul className="list-disc list-inside space-y-2 pl-4">
            <li>
              <strong>Personal Information:</strong> When you create an account,
              we collect your email address and, if you choose Google sign-in,
              information provided by Google (e.g., name, email). You may also
              provide additional profile information voluntarily.
            </li>
            <li>
              <strong>Uploaded Photos:</strong> To perform AI-powered face
              analysis, we collect three photos of your face (front, left, and
              right profiles) that you upload. These photos are used solely for
              generating your face shape analysis and feature ratings (e.g.,
              jawline, forehead, nose, cheekbones).
            </li>
            <li>
              <strong>Analysis Results:</strong> We store the results of your face
              analysis, including face shape and feature ratings, in your
              personal profile for you to review.
            </li>
            <li>
              <strong>Usage Data:</strong> We collect information about how you
              interact with ReflectAI, such as pages visited, features used, and
              referral code activity, to improve our services.
            </li>
            <li>
              <strong>Social Media Engagement:</strong> If you claim free credits
              by following our social media accounts (Instagram, Facebook,
              TikTok), we may collect verification data to confirm your
              eligibility.
            </li>
          </ul>
  
          <h2 className="text-2xl font-headline font-semibold pt-4 border-t border-border">2. How We Use Your Information</h2>
          <p>We use your information to:</p>
          <ul className="list-disc list-inside space-y-2 pl-4">
            <li>
              Provide AI-powered face analysis and generate personalized style
              recommendations.
            </li>
            <li>
              Maintain your user account and store your analysis history for easy
              access.
            </li>
            <li>
              Process referrals and reward credits for actions like referring
              friends or following our social media accounts.
            </li>
            <li>Improve our services through analytics and user feedback.</li>
            <li>
              Communicate with you about your account, updates, or promotions
              (you can opt out of marketing communications at any time).
            </li>
            <li>
              For paying subscribers, provide access to the AI Stylist Chat
              feature, which offers tailored style advice based on your analysis
              results.
            </li>
          </ul>
  
          <h2 className="text-2xl font-headline font-semibold pt-4 border-t border-border">3. Data Storage and Security</h2>
          <ul className="list-disc list-inside space-y-2 pl-4">
            <li>
              <strong>Storage:</strong> Your data is securely stored in Firebase
              (Authentication and Firestore), hosted on Google Cloud’s secure
              infrastructure.
            </li>
            <li>
              <strong>Security:</strong> We use industry-standard encryption and
              security measures to protect your data during transmission and
              storage.
            </li>
            <li>
              <strong>Photo Handling:</strong> Uploaded photos are processed by
              Google’s Gemini models via Genkit flows for analysis and are not
              used for any other purpose. Photos are deleted from temporary
              storage after analysis unless you choose to save them in your
              profile.
            </li>
          </ul>
  
          <h2 className="text-2xl font-headline font-semibold pt-4 border-t border-border">4. Your Data, Your Control</h2>
          <p>We believe you should have full control over your data. You can:</p>
          <ul className="list-disc list-inside space-y-2 pl-4">
            <li>
              <strong>Access:</strong> View your analysis history and profile
              details at any time on your personal profile page.
            </li>
            <li>
              <strong>Delete:</strong> Delete your entire analysis history,
              uploaded photos, or account directly from your profile page. Once
              deleted, your data is permanently removed from our systems, except
              as required by law.
            </li>
            <li>
              <strong>Opt-Out:</strong> Unsubscribe from marketing communications
              via the link in our emails or by contacting us.
            </li>
          </ul>
  
          <h2 className="text-2xl font-headline font-semibold pt-4 border-t border-border">5. Sharing Your Information</h2>
          <p>
            We do not sell, trade, or share your personal information with third
            parties, except:
          </p>
          <ul className="list-disc list-inside space-y-2 pl-4">
            <li>
              With service providers (e.g., Firebase, Google’s Gemini models) who
              process data on our behalf under strict confidentiality agreements.
            </li>
            <li>
              To comply with legal obligations, such as responding to lawful
              requests from authorities.
            </li>
            <li>
              With your consent, such as when you share your referral code or
              engage with our social media campaigns.
            </li>
          </ul>
  
          <h2 className="text-2xl font-headline font-semibold pt-4 border-t border-border">6. Not Medical Advice</h2>
          <p>
            ReflectAI is a style improvement service intended to enhance your
            personal aesthetic. The recommendations provided, including those
            from the AI Stylist Chat, are not medical advice and should not be
            used for medical or health-related purposes. Always consult a
            qualified professional for medical or health-related concerns.
          </p>
  
          <h2 className="text-2xl font-headline font-semibold pt-4 border-t border-border">7. Freemium Model and Credits</h2>
          <ul className="list-disc list-inside space-y-2 pl-4">
            <li>
              New users receive a limited number of free face analyses.
            </li>
            <li>
              Additional credits can be earned by referring friends via your
              unique referral code or following our social media accounts
              (Instagram, Facebook, TikTok).
            </li>
            <li>
              Paying subscribers receive unlimited access and exclusive features
              like the AI Stylist Chat, which is credit-based to manage usage.
            </li>
          </ul>
          
          <h2 className="text-2xl font-headline font-semibold pt-4 border-t border-border">8. Cookies and Tracking</h2>
          <p>
              We use cookies and similar technologies to enhance your experience, such as remembering your login status and analyzing site usage. You can manage cookie preferences through your browser settings.
          </p>
  
          <h2 className="text-2xl font-headline font-semibold pt-4 border-t border-border">9. Children’s Privacy</h2>
          <p>
              ReflectAI is not intended for users under 13 years of age. We do not knowingly collect personal information from children under 13. If you believe we have collected such information, please contact us to have it removed.
          </p>
  
          <h2 className="text-2xl font-headline font-semibold pt-4 border-t border-border">10. Changes to This Privacy Policy</h2>
          <p>
              We may update this Privacy Policy to reflect changes in our practices or legal requirements. We will notify you of significant changes via email or a notice on our website. The “Last Updated” date at the top indicates the latest version.
          </p>
  
          <h2 className="text-2xl font-headline font-semibold pt-4 border-t border-border">11. Contact Us</h2>
          <p>If you have questions or concerns about this Privacy Policy or your data, please contact us at:</p>
          <div className="not-italic">
              <p><strong>Email:</strong> support@reflectai.com</p>
              <p><strong>Address:</strong> ReflectAI, 123 Style Lane, Aesthetic City, CA 90210, USA</p>
          </div>
  
          <p className="pt-4 border-t border-border">Thank you for trusting ReflectAI with your style journey. Your privacy and trust are our top priorities.</p>
  
        </div>
      </div>
    );
  }
  
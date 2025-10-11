
export const metadata = {
    title: 'About Us - ReflectAI',
  };
  
  export default function AboutUsPage() {
    return (
      <div className="container mx-auto max-w-3xl py-12 space-y-6">
        <h1 className="text-4xl font-headline font-bold text-primary text-center">About Us</h1>
  
        <div className="space-y-6 text-foreground/90">
          <p className="text-lg text-center text-muted-foreground">
            Welcome to ReflectAI, a platform built for you, by the passionate HeYdrA team. We are honored to create a space that celebrates your individuality and empowers your self-expression through personalized style recommendations. ReflectAI is more than an app—it’s a community driven by your enthusiasm, trust, and unique style journeys.
          </p>
  
          <h2 className="text-2xl font-headline font-semibold pt-4 border-t border-border">Our Mission</h2>
          <p>
            At ReflectAI, we believe that style is a powerful form of self-expression. Our mission is to help you discover and enhance your unique aesthetic through cutting-edge AI technology. By analyzing your facial features with precision and care, we provide tailored recommendations to elevate your confidence and style—not as a one-size-fits-all solution, but as a reflection of you. ReflectAI is a style improvement service, designed to enhance your personal aesthetic, not to provide medical advice.
          </p>
  
          <h2 className="text-2xl font-headline font-semibold pt-4 border-t border-border">Built For You, By You</h2>
          <p>
            We at ReflectAI are privileged to create a platform that thrives not through traditional advertising, but through your genuine passion. When you share your unique referral code with friends or engage with us on social media (Instagram, Facebook, TikTok), you become the true architects of our growth. As psychological research affirms, a hero’s strength lies in the belief of their community. Without your trust and participation, we are nothing. You are the heart of this journey, and we are dedicated to supporting your self-expression every step of the way.
          </p>
  
          <h2 className="text-2xl font-headline font-semibold pt-4 border-t border-border">What We Do</h2>
          <p>
            ReflectAI uses advanced AI, powered by Google’s Gemini models, to analyze three photos of your face (front, left, and right profiles) and identify your unique face shape and features. You’ll receive objective ratings for attributes like your jawline, forehead, nose, and cheekbones, along with personalized style recommendations. With a user account, your analysis results are saved in your personal profile, creating a history you can revisit anytime.
          </p>
          <p>
            Our freemium model welcomes new users with free analyses to explore the platform. Want more? Earn additional credits by referring friends or following us on social media. For those seeking unlimited access, our paid subscription unlocks exclusive features like the AI Stylist Chat, where you can ask questions like, “What hairstyle suits my face shape?” or “How can I enhance my jawline’s appearance?”—all tailored to your unique results.
          </p>
  
          <h2 className="text-2xl font-headline font-semibold pt-4 border-t border-border">Your Privacy, Our Promise</h2>
          <p>
            Your trust is everything to us. ReflectAI is built with a privacy-first approach, giving you full control over your data. You can access, review, or delete your analysis history and photos at any time from your profile. We use secure technologies like Firebase and industry-standard encryption to protect your information, ensuring your style journey is both safe and empowering.
          </p>
          
          <h2 className="text-2xl font-headline font-semibold pt-4 border-t border-border">Meet the HeYdrA Team</h2>
          <p>
            ReflectAI was created by the HeYdrA team, a group of innovators passionate about blending technology and creativity to inspire confidence. We’re a diverse crew of developers, designers, and style enthusiasts united by a shared vision: to make style accessible, personal, and fun for everyone. Based in [Your City, if applicable], we’re driven by the belief that your unique features deserve to shine.
          </p>
  
          <h2 className="text-2xl font-headline font-semibold pt-4 border-t border-border">Join the Journey</h2>
          <p>
            ReflectAI is your space to explore, create, and grow. Whether you’re discovering your face shape for the first time or seeking tailored style advice, we’re here to support you. Thank you for being part of our community—your enthusiasm fuels us, and together, we’re redefining what it means to look and feel your best.
          </p>
  
          <div className="pt-4 border-t border-border">
            <p><strong>Contact Us:</strong> Have questions or ideas? Reach out at <a href="mailto:support@reflectai.com" className="text-primary hover:underline">support@reflectai.com</a> or connect with us on Instagram, Facebook, or TikTok.</p>
          </div>
        </div>
      </div>
    );
  }
  
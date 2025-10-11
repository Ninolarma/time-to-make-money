
'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  ArrowRight,
  Camera,
  Palette,
  WandSparkles,
  Scissors,
  Shirt,
  Check,
  Mars,
  Venus,
  Star,
  Users,
  Heart,
} from 'lucide-react';
import placeholderImages from '@/lib/placeholder-images.json';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

const tools = [
  {
    title: 'Face Analysis',
    href: '/tools/face-analysis',
    icon: <Camera className="h-8 w-8 text-primary" />,
    description: 'Understand your unique facial features.',
    cta: 'Explore',
    isAvailable: true,
    imageId: 'tool-face-analysis',
    videoUrlFemale: '/videos/tool-face-analysis.mp4',
    videoUrlMale: '/videos/tool-face-analysis0.mp4',
  },
  {
    title: 'Color Matching',
    href: '/tools/color-matching',
    icon: <Palette className="h-8 w-8 text-primary" />,
    description: 'Coming Soon: Find the colors that make you shine.',
    cta: 'Coming Soon',
    isAvailable: false,
    imageId: 'tool-color-matching',
    videoUrlFemale: '/videos/tool-color-matching.mp4',
    videoUrlMale: '/videos/tool-color-matching0.mp4',
  },
  {
    title: 'Occasion Stylist',
    href: '/tools/occasion-stylist',
    icon: <WandSparkles className="h-8 w-8 text-primary" />,
    description: 'Coming Soon: Get style advice for your next big event.',
    cta: 'Coming Soon',
    isAvailable: false,
    imageId: 'tool-occasion-stylist',
    videoUrlFemale: '/videos/tool-occasion-stylist.mp4',
    videoUrlMale: '/videos/tool-occasion-stylist0.mp4',
  },
  {
    title: 'Hairstyle Simulator',
    href: '/tools/hairstyle-simulator',
    icon: <Scissors className="h-8 w-8 text-primary" />,
    description: 'Coming Soon: Virtually try on different hairstyles.',
    cta: 'Coming Soon',
    isAvailable: false,
    imageId: 'tool-hairstyle-simulator',
    videoUrlFemale: '/videos/tool-hairstyle-simulator.mp4',
    videoUrlMale: '/videos/tool-hairstyle-simulator0.mp4',
  },
  {
    title: 'Clothing Analyzer',
    href: '/tools/clothing-analyzer',
    icon: <Shirt className="h-8 w-8 text-primary" />,
    description: 'Coming Soon: Get recommendations on your outfits.',
    cta: 'Coming Soon',
    isAvailable: false,
    imageId: 'tool-clothing-analyzer',
    videoUrlFemale: '/videos/tool-clothing-analyzer.mp4',
    videoUrlMale: '/videos/tool-clothing-analyzer0.mp4',
  },
];

type GenderTheme = 'male' | 'female';

function GenderSelectionDialog({
  isOpen,
  onSelect,
}: {
  isOpen: boolean;
  onSelect: (theme: GenderTheme) => void;
}) {
  return (
    <Dialog open={isOpen}>
      <DialogContent className="sm:max-w-md text-center">
        <DialogHeader>
          <DialogTitle className="text-3xl font-headline text-center">
            Who are you styling today?
          </DialogTitle>
          <DialogDescription className="text-center text-base pt-2">
            Choose a style profile to personalize your experience.
          </DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
          <Card
            onClick={() => onSelect('female')}
            className="cursor-pointer hover:border-primary transition-colors group"
          >
            <CardContent className="p-6">
              <h2 className="text-xl font-headline font-semibold mb-1">
                For Women
              </h2>
              <p className="text-sm text-muted-foreground">
                Explore styles and trends for women.
              </p>
            </CardContent>
          </Card>
          <Card
            onClick={() => onSelect('male')}
            className="cursor-pointer hover:border-primary transition-colors group"
          >
            <CardContent className="p-6">
              <h2 className="text-xl font-headline font-semibold mb-1">
                For Men
              </h2>
              <p className="text-sm text-muted-foreground">
                Discover styles and trends for men.
              </p>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
}


function ThemeToggle({
  currentTheme,
  onThemeChange,
}: {
  currentTheme: GenderTheme;
  onThemeChange: (theme: GenderTheme) => void;
}) {
  return (
    <TooltipProvider>
      <div className="absolute top-4 right-4 flex items-center gap-1 rounded-full border bg-card p-1">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className={cn('rounded-full', {
                'bg-primary/20 text-primary': currentTheme === 'female',
              })}
              onClick={() => onThemeChange('female')}
            >
              <Venus className="h-5 w-5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Switch to Women's Style</p>
          </TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className={cn('rounded-full', {
                'bg-primary/20 text-primary': currentTheme === 'male',
              })}
              onClick={() => onThemeChange('male')}
            >
              <Mars className="h-5 w-5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Switch to Men's Style</p>
          </TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  );
}

export default function Home() {
  const [theme, setTheme] = useState<GenderTheme>('female');
  const [showGenderDialog, setShowGenderDialog] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    const storedTheme = localStorage.getItem('genderTheme') as GenderTheme;
    if (storedTheme) {
      setTheme(storedTheme);
    } else {
      setShowGenderDialog(true);
    }
    setIsMounted(true);
  }, []);

  const handleThemeSelect = (selectedTheme: GenderTheme) => {
    localStorage.setItem('genderTheme', selectedTheme);
    setTheme(selectedTheme);
    setShowGenderDialog(false);
  };
  
  if (!isMounted) {
    return null; // or a loading spinner
  }

  const galleryImages = placeholderImages.placeholderImages.filter((p) =>
    p.id.startsWith(`gallery-${theme}`)
  );
  
  const toolImages = tools.map(tool => {
    const image = placeholderImages.placeholderImages.find(p => p.id === tool.imageId);
    return { ...tool, image };
  });

  return (
    <div className="container mx-auto px-4 py-16 relative">
      <GenderSelectionDialog
        isOpen={showGenderDialog}
        onSelect={handleThemeSelect}
      />
      <ThemeToggle currentTheme={theme} onThemeChange={handleThemeSelect} />
      <div className="grid md:grid-cols-2 gap-12 items-center">
        <div className="text-center md:text-left">
          <h1 className="text-5xl md:text-7xl font-bold font-headline tracking-tight">
            Reflect Your True Style
          </h1>
          <p className="mt-6 max-w-xl mx-auto md:mx-0 text-lg md:text-xl text-muted-foreground">
            Unlock your personal style with AI-driven analysis. Get
            recommendations for clothing, hair, and accessories that complement
            your unique features.
          </p>
          <div className="mt-10 flex items-center justify-center md:justify-start gap-4">
            <Button asChild size="lg" className="group">
              <Link href="/tools/face-analysis">
                Start Your Transformation
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
             <Button asChild size="lg" variant="outline">
              <Link href="/about-us">
                Learn More
              </Link>
            </Button>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {galleryImages.slice(0, 4).map((image, index) => (
            <div
              key={image.id}
              className={`rounded-2xl overflow-hidden ${
                index === 0 || index === 3 ? 'col-span-2' : ''
              }`}
            >
              <Image
                src={image.imageUrl}
                alt={image.description}
                width={index === 0 || index === 3 ? 800 : 400}
                height={600}
                className="object-cover w-full h-full"
                data-ai-hint={image.imageHint}
                priority={index < 2}
              />
            </div>
          ))}
        </div>
      </div>

      <div className="py-24 text-center">
        <h2 className="text-4xl font-bold font-headline tracking-tight mb-4">
          How It Works
        </h2>
        <p className="max-w-2xl mx-auto text-lg text-muted-foreground mb-12">
          Our AI-powered tools make discovering your best look simple and fun.
          Just a few steps to a more confident you.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
          <Card className="bg-card/50">
            <CardContent className="p-8">
              <div className="flex items-center gap-4 mb-4">
                <div className="bg-primary/10 text-primary p-3 rounded-full">
                  <Camera className="h-6 w-6" />
                </div>
                <h3 className="text-2xl font-semibold font-headline">Upload</h3>
              </div>
              <p className="text-muted-foreground">
                Start by uploading a clear, front-facing photo of yourself.
                This is the first step in our AI analysis.
              </p>
            </CardContent>
          </Card>
          <Card className="bg-card/50">
            <CardContent className="p-8">
              <div className="flex items-center gap-4 mb-4">
                <div className="bg-primary/10 text-primary p-3 rounded-full">
                  <WandSparkles className="h-6 w-6" />
                </div>
                <h3 className="text-2xl font-semibold font-headline">
                  Analyze
                </h3>
              </div>
              <p className="text-muted-foreground">
                Our AI gets to work, analyzing your unique features to
                generate personalized style recommendations.
              </p>
            </CardContent>
          </Card>
          <Card className="bg-card/50">
            <CardContent className="p-8">
              <div className="flex items-center gap-4 mb-4">
                <div className="bg-primary/10 text-primary p-3 rounded-full">
                  <Check className="h-6 w-6" />
                </div>
                <h3 className="text-2xl font-semibold font-headline">
                  Discover
                </h3>
              </div>
              <p className="text-muted-foreground">
                Receive your custom style report and start exploring looks that
                truly reflect you.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="py-12">
        <Card className="max-w-4xl mx-auto bg-card/50 border-dashed border-2 text-center">
            <CardContent className="p-10">
                 <div className="mx-auto bg-primary/10 text-primary p-4 rounded-full w-fit mb-6">
                    <Users className="h-8 w-8" />
                </div>
                <h2 className="text-3xl font-bold font-headline mb-4">
                    Built For You, By You
                </h2>
                <p className="text-lg text-muted-foreground italic leading-relaxed">
                   "We at ReflectAI are honored to create a space that belongs to you, our valued users. This platform thrives not through our advertising, but through your genuine enthusiasm—shared organically when you invite others with your unique referral code, empowering you as the true architects of its growth. As psychological research affirms, a hero’s strength lies in the belief of their community. Without your trust and participation, we are nothing. You are the heart of this journey, and we are privileged to support your self-expression."
                </p>
                 <Heart className="h-6 w-6 mx-auto mt-6 text-primary/80 fill-primary/80" />
            </CardContent>
        </Card>
      </div>

      <div className="mt-12">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold font-headline tracking-tight">
            Our Tools
          </h2>
          <p className="max-w-2xl mx-auto text-lg text-muted-foreground">
            Explore our suite of AI-powered styling tools.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {toolImages.map((tool) => {
            const videoUrl = theme === 'male' ? tool.videoUrlMale : tool.videoUrlFemale;
            return (
              <Card
                key={tool.title}
                className="bg-card border border-border/60 hover:border-primary/50 transition-colors group flex flex-col overflow-hidden"
              >
                <div className="relative aspect-[4/3] w-full">
                  {videoUrl ? (
                    <video
                      src={videoUrl}
                      autoPlay
                      loop
                      muted
                      playsInline
                      className="absolute inset-0 object-cover w-full h-full"
                    />
                  ) : (
                    tool.image && (
                        <Image
                          src={tool.image.imageUrl}
                          alt={tool.image.description}
                          fill
                          className="object-cover"
                          data-ai-hint={tool.image.imageHint}
                        />
                    )
                  )}
                </div>
                <CardContent className="p-6 flex-grow flex flex-col">
                  <h3 className="font-headline text-2xl font-semibold mb-2 text-foreground">
                    {tool.title}
                  </h3>
                  <p className="text-muted-foreground mb-6 flex-grow">
                    {tool.description}
                  </p>
                  {tool.isAvailable ? (
                    <Button
                      variant="link"
                      className="p-0 h-auto justify-start text-primary group"
                      asChild
                    >
                      <Link href={tool.href}>
                        {tool.cta}
                        <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                      </Link>
                    </Button>
                  ) : (
                    <p className="font-medium text-primary/80">{tool.cta}</p>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}

    
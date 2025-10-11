
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Check, Star, Gem, Crown, Gift, Users } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const plans = [
    {
        name: 'Weekly Sparkle',
        price: '$4.99',
        period: '/week',
        description: 'For those who want to give it a try.',
        features: [
            '5 Face Analyses per week',
            'Basic style recommendations',
            'Save up to 10 analysis results',
        ],
        icon: <Star className="h-8 w-8 text-primary" />,
        buttonLabel: 'Choose Sparkle',
    },
    {
        name: 'Monthly Glow-Up',
        price: '$14.99',
        period: '/month',
        description: 'Perfect for the dedicated style enthusiast.',
        features: [
            'Unlimited Face Analyses',
            'Advanced style recommendations',
            'Save unlimited analysis results',
            'Early access to new tools',
        ],
        icon: <Gem className="h-8 w-8 text-primary" />,
        buttonLabel: 'Choose Glow-Up',
        isPopular: true,
    },
    {
        name: 'Annual Radiance',
        price: '$99.99',
        period: '/year',
        description: 'Become a true style icon.',
        features: [
            'All Monthly Glow-Up features',
            'Personalized AI stylist consultations',
            'Exclusive access to premium content',
            '20% off all future products',
        ],
        icon: <Crown className="h-8 w-8 text-primary" />,
        buttonLabel: 'Choose Radiance',
    },
];

export default function SubscriptionPage() {
    return (
        <div className="container mx-auto px-4 py-16">
            <div className="text-center mb-16">
                <h1 className="text-5xl md:text-7xl font-bold font-headline tracking-tight">
                    Unlock Your Full Potential
                </h1>
                <p className="mt-6 max-w-xl mx-auto text-lg md:text-xl text-muted-foreground">
                    Our AI is ready to grant your style wishes. Choose a plan below or just make a wish.
                </p>
                <Button size="lg" className="mt-8 group bg-gradient-to-r from-primary to-yellow-400 text-primary-foreground">
                    Make My Wish True
                    <Star className="ml-2 h-5 w-5 transition-transform group-hover:scale-125" />
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {plans.map((plan) => (
                    <Card key={plan.name} className={`flex flex-col relative ${plan.isPopular ? 'border-primary border-2 shadow-lg' : ''}`}>
                         {plan.isPopular && (
                            <Badge className="absolute top-0 -translate-y-1/2 left-1/2 -translate-x-1/2 px-4 py-1 text-sm font-semibold">
                                Most Popular
                            </Badge>
                        )}
                        <CardHeader className="p-8">
                            <div className="flex items-center gap-4 mb-4">
                                <div className="bg-primary/10 text-primary p-3 rounded-full">
                                    {plan.icon}
                                </div>
                                <div>
                                    <CardTitle className="font-headline text-2xl">{plan.name}</CardTitle>
                                    <CardDescription>{plan.description}</CardDescription>
                                </div>
                            </div>

                            <div>
                                <span className="text-4xl font-bold">{plan.price}</span>
                                <span className="text-muted-foreground">{plan.period}</span>
                            </div>
                        </CardHeader>
                        <CardContent className="p-8 pt-0 flex-grow">
                            <ul className="space-y-4">
                                {plan.features.map((feature, i) => (
                                    <li key={i} className="flex items-start">
                                        <Check className="h-5 w-5 text-green-500 mr-2.5 flex-shrink-0 mt-1" />
                                        <span className="text-muted-foreground">{feature}</span>
                                    </li>
                                ))}
                            </ul>
                        </CardContent>
                        <CardFooter className="p-8 pt-0">
                            <Button className="w-full" variant={plan.isPopular ? 'default' : 'outline'}>
                                {plan.buttonLabel}
                            </Button>
                        </CardFooter>
                    </Card>
                ))}
            </div>

             <div className="mt-24 text-center">
                <Card className="max-w-2xl mx-auto bg-card/50 border-dashed border-2">
                    <CardContent className="p-8">
                         <div className="mx-auto bg-primary/10 text-primary p-4 rounded-full w-fit mb-4">
                            <Gift className="h-8 w-8" />
                        </div>
                        <h2 className="text-3xl font-bold font-headline mb-4">
                           A Gift For Our Supporters
                        </h2>
                        <p className="text-muted-foreground">
                           Invite 10 friends to ReflectAI and receive a special gift from us as a thank you for being a key part of our community! Your referrals help us grow.
                        </p>
                         <Button variant="outline" className="mt-6" disabled>
                           <Users className="mr-2 h-4 w-4" />
                            View Referral Progress (Coming Soon)
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}


'use client';

import { useState } from 'react';
import { useUser, useFirestore } from '@/firebase';
import { getStyleAdvice } from '@/ai/flows/get-style-advice';
import { decrementAdviceChats } from '@/firebase/firestore/mutations';
import { type AnalyzeAndRateFaceOutput } from '@/ai/flows/types';
import { Bot, Send, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export function PersonalizedAdvice({
  analysisResult,
  userProfile,
  onAdviceGiven,
}: {
  analysisResult: AnalyzeAndRateFaceOutput;
  userProfile: any;
  onAdviceGiven: () => void;
}) {
  const { user } = useUser();
  const firestore = useFirestore();
  const { toast } = useToast();

  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const adviceChatsRemaining = userProfile.subscription?.adviceChatsRemaining ?? 0;

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !user || !firestore) return;

    if (adviceChatsRemaining <= 0) {
        toast({
            title: 'No Advice Credits Left',
            description: 'Please upgrade your subscription to continue.',
            variant: 'destructive',
        });
        return;
    }

    const newUserMessage: Message = { role: 'user', content: input };
    setMessages((prev) => [...prev, newUserMessage]);
    setInput('');
    setIsLoading(true);

    try {
      // Decrement credit first
      await decrementAdviceChats(firestore, user.uid);
      onAdviceGiven(); // This will trigger a re-fetch of the user profile

      // Call the AI
      const result = await getStyleAdvice({
        analysisResult,
        userQuery: input,
      });

      const newAssistantMessage: Message = {
        role: 'assistant',
        content: result.advice,
      };
      setMessages((prev) => [...prev, newAssistantMessage]);
    } catch (error) {
      console.error('Failed to get style advice:', error);
      toast({
        title: 'Error',
        description: 'Could not get advice. Please try again.',
        variant: 'destructive',
      });
      // Optional: Revert messages if AI call fails
      setMessages((prev) => prev.slice(0, -1));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="bg-background/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 font-headline text-accent-foreground">
          <Sparkles className="h-6 w-6 text-primary" />
          Personalized AI Stylist
        </CardTitle>
        <CardDescription>
          Ask for specific advice or exercises based on your analysis. You have{' '}
          <span className="font-bold text-primary">{adviceChatsRemaining}</span> credits
          remaining.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-4 h-64 overflow-y-auto p-4 border rounded-md">
            {messages.length === 0 && (
                 <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground">
                    <Bot className="h-10 w-10 mb-2" />
                    <p className="font-medium">Ready for your style questions!</p>
                    <p className="text-sm">e.g., "What hairstyle would suit my face shape?" or "Are there exercises to define my jawline?"</p>
                </div>
            )}
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex items-start gap-3 ${
                  message.role === 'user' ? 'justify-end' : ''
                }`}
              >
                {message.role === 'assistant' && (
                  <div className="bg-primary/10 text-primary p-2 rounded-full">
                    <Bot className="h-5 w-5" />
                  </div>
                )}
                <div
                  className={`rounded-lg p-3 max-w-md ${
                    message.role === 'user'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-card'
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                </div>
              </div>
            ))}
             {isLoading && (
                <div className="flex items-start gap-3">
                     <div className="bg-primary/10 text-primary p-2 rounded-full">
                        <Bot className="h-5 w-5 animate-pulse" />
                    </div>
                    <div className="rounded-lg p-3 bg-card">
                        <p className="text-sm text-muted-foreground animate-pulse">Thinking...</p>
                    </div>
                </div>
            )}
          </div>

          <form onSubmit={handleSendMessage} className="flex items-center gap-2">
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask for advice..."
              className="flex-1"
              rows={1}
              disabled={isLoading || adviceChatsRemaining <= 0}
            />
            <Button type="submit" disabled={isLoading || !input.trim() || adviceChatsRemaining <= 0}>
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </div>
      </CardContent>
    </Card>
  );
}

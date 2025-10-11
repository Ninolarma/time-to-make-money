'use server';
/**
 * @fileOverview An AI agent that analyzes a user's face from a photo and provides ratings for various facial features.
 *
 * - analyzeAndRateFace - A function that handles the face analysis and rating process.
 */

import {ai} from '@/ai/genkit';
import {
  AnalyzeAndRateFaceInputSchema,
  AnalyzeAndRateFaceOutputSchema,
  type AnalyzeAndRateFaceInput,
  type AnalyzeAndRateFaceOutput
} from './types';


export async function analyzeAndRateFace(
  input: AnalyzeAndRateFaceInput
): Promise<AnalyzeAndRateFaceOutput> {
  return analyzeAndRateFaceFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeAndRateFacePrompt',
  input: {schema: AnalyzeAndRateFaceInputSchema},
  output: {schema: AnalyzeAndRateFaceOutputSchema},
  prompt: `You are a facial analysis expert. Your task is to analyze the user's face from the three photos provided (front, left, and right profiles) and provide a neutral, objective analysis.

You MUST perform the following steps:
1.  Identify the user's face shape (e.g., Oval, Square, Round, Heart, Diamond).
2.  Analyze and rate the following facial features on a scale of 1 to 10, where 1 is less prominent and 10 is very prominent: Jawline, Forehead, Nose, and Cheekbones.
3.  Provide a brief, objective description for each feature and for the overall face shape.
4.  Do NOT give any fashion advice, style recommendations, or compliments. Your analysis must be strictly neutral and descriptive.

Front View: {{media url=frontPhotoDataUri}}
Left Profile: {{media url=leftPhotoDataUri}}
Right Profile: {{media url=rightPhotoDataUri}}`,
});

const analyzeAndRateFaceFlow = ai.defineFlow(
  {
    name: 'analyzeAndRateFaceFlow',
    inputSchema: AnalyzeAndRateFaceInputSchema,
    outputSchema: AnalyzeAndRateFaceOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

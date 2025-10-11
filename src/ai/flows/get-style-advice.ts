
'use server';
/**
 * @fileOverview An AI agent that provides personalized style advice based on facial analysis.
 *
 * - getStyleAdvice - A function that handles the advice generation process.
 */

import { ai } from '@/ai/genkit';
import {
  AnalyzeAndRateFaceOutputSchema,
  StyleAdviceInputSchema,
  StyleAdviceOutputSchema,
  type StyleAdviceInput,
  type StyleAdviceOutput,
} from './types';


export async function getStyleAdvice(
  input: StyleAdviceInput
): Promise<StyleAdviceOutput> {
  return getStyleAdviceFlow(input);
}

const prompt = ai.definePrompt({
  name: 'getStyleAdvicePrompt',
  input: { schema: StyleAdviceInputSchema },
  output: { schema: StyleAdviceOutputSchema },
  prompt: `You are a world-class personal stylist and wellness coach. The user has provided their facial analysis results and is asking for specific advice.

Based on their analysis and their question, provide a concise, actionable, and encouraging response. You can suggest clothing styles, accessories, grooming tips, or facial exercises.

**User's Facial Analysis:**
- Face Shape: {{{analysisResult.faceShape.shape}}} ({{analysisResult.faceShape.description}})
{{#each analysisResult.featureRatings}}
- {{name}}: Rating {{rating}}/10 ({{description}})
{{/each}}

**User's Question:**
"{{{userQuery}}}"

Provide your expert advice below.
`,
});

const getStyleAdviceFlow = ai.defineFlow(
  {
    name: 'getStyleAdviceFlow',
    inputSchema: StyleAdviceInputSchema,
    outputSchema: StyleAdviceOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);

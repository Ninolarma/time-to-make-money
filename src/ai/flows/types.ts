import {z} from 'genkit';

export const AnalyzeAndRateFaceInputSchema = z.object({
  frontPhotoDataUri: z
    .string()
    .describe(
      "A front-facing photo of the user's face, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  leftPhotoDataUri: z
    .string()
    .describe(
      "A photo of the left profile of the user's face, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  rightPhotoDataUri: z
    .string()
    .describe(
      "A photo of the right profile of the user's face, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type AnalyzeAndRateFaceInput = z.infer<
  typeof AnalyzeAndRateFaceInputSchema
>;

export const featureRatingSchema = z.object({
  name: z
    .string()
    .describe("The name of the facial feature being rated (e.g., 'Jawline', 'Forehead')."),
  rating: z
    .number()
    .min(1)
    .max(10)
    .describe('A rating of the feature from 1 to 10.'),
  description: z
    .string()
    .describe("A brief, neutral analysis of the feature's characteristics."),
});

export const AnalyzeAndRateFaceOutputSchema = z.object({
  faceShape: z.object({
    shape: z
      .string()
      .describe('The identified face shape (e.g., Oval, Square, Round).'),
    description: z
      .string()
      .describe(
        'A brief, neutral description of the face shape characteristics.'
      ),
  }),
  featureRatings: z
    .array(featureRatingSchema)
    .describe('An array of ratings for various facial features.'),
});
export type AnalyzeAndRateFaceOutput = z.infer<
  typeof AnalyzeAndRateFaceOutputSchema
>;


export const StyleAdviceInputSchema = z.object({
  analysisResult: AnalyzeAndRateFaceOutputSchema.describe(
    'The result of the user\'s facial analysis.'
  ),
  userQuery: z
    .string()
    .describe('The user\'s specific question about style or exercises.'),
});
export type StyleAdviceInput = z.infer<typeof StyleAdviceInputSchema>;

export const StyleAdviceOutputSchema = z.object({
  advice: z
    .string()
    .describe('The personalized advice or exercise recommendation.'),
});
export type StyleAdviceOutput = z.infer<typeof StyleAdviceOutputSchema>;

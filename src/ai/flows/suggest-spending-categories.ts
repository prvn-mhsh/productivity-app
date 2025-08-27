'use server';

/**
 * @fileOverview This file defines a Genkit flow for suggesting spending categories and tagging transactions using AI.
 *
 * It includes:
 * - suggestSpendingCategories - A function that suggests spending categories for a given transaction description.
 * - SuggestSpendingCategoriesInput - The input type for the suggestSpendingCategories function.
 * - SuggestSpendingCategoriesOutput - The return type for the suggestSpendingCategories function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestSpendingCategoriesInputSchema = z.object({
  transactionDescription: z
    .string()
    .describe('The description of the transaction to categorize.'),
});
export type SuggestSpendingCategoriesInput = z.infer<
  typeof SuggestSpendingCategoriesInputSchema
>;

const SuggestSpendingCategoriesOutputSchema = z.object({
  suggestedCategory: z
    .string()
    .describe(
      'The AI-suggested spending category for the transaction description.'
    ),
  confidence: z.number().describe('The confidence level of the suggestion.'),
});
export type SuggestSpendingCategoriesOutput = z.infer<
  typeof SuggestSpendingCategoriesOutputSchema
>;

export async function suggestSpendingCategories(
  input: SuggestSpendingCategoriesInput
): Promise<SuggestSpendingCategoriesOutput> {
  return suggestSpendingCategoriesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestSpendingCategoriesPrompt',
  input: {schema: SuggestSpendingCategoriesInputSchema},
  output: {schema: SuggestSpendingCategoriesOutputSchema},
  prompt: `You are an AI assistant that suggests spending categories for transactions.

  Given the following transaction description, suggest a spending category and a confidence level between 0 and 1.

  Transaction Description: {{{transactionDescription}}}

  Respond with a JSON object that contains the suggestedCategory and confidence fields.`,
});

const suggestSpendingCategoriesFlow = ai.defineFlow(
  {
    name: 'suggestSpendingCategoriesFlow',
    inputSchema: SuggestSpendingCategoriesInputSchema,
    outputSchema: SuggestSpendingCategoriesOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

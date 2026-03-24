'use server';
/**
 * @fileOverview A Genkit flow for generating personalized motivational messages.
 *
 * - generateMotivation - A function that generates a motivational message based on user habit progress.
 * - GenerateMotivationInput - The input type for the generateMotivation function.
 * - GenerateMotivationOutput - The return type for the generateMotivation function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateMotivationInputSchema = z.object({
  habitName: z.string().describe('The name of the habit (e.g., "Daily Reading", "Morning Run").'),
  currentStreak: z.number().int().min(0).describe('The current streak length for the habit.'),
  totalCompletions: z.number().int().min(0).describe('The total number of times the habit has been completed.'),
  motivationLevel: z.enum(['low', 'medium', 'high']).optional().describe('An optional indicator of the user\u0027s current motivation level.'),
});
export type GenerateMotivationInput = z.infer<typeof GenerateMotivationInputSchema>;

const GenerateMotivationOutputSchema = z.object({
  message: z.string().describe('A personalized motivational message for the user.'),
});
export type GenerateMotivationOutput = z.infer<typeof GenerateMotivationOutputSchema>;

export async function generateMotivation(input: GenerateMotivationInput): Promise<GenerateMotivationOutput> {
  return generateMotivationFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateMotivationPrompt',
  input: {schema: GenerateMotivationInputSchema},
  output: {schema: GenerateMotivationOutputSchema},
  prompt: `You are a positive and encouraging AI assistant designed to help users build good habits.
Generate a personalized motivational message for the user based on their habit progress.

Habit Name: {{{habitName}}}
Current Streak: {{{currentStreak}}} days
Total Completions: {{{totalCompletions}}}
{{#if motivationLevel}}
User's Current Motivation Level: {{{motivationLevel}}}
{{/if}}

Craft a message that celebrates their consistency, encourages them to continue, and offers positive reinforcement. If the streak is low (0-3 days), focus on starting strong. If it's moderate (4-10 days), emphasize building momentum. If it's high (11+ days), praise their dedication and resilience. If motivationLevel is 'low', provide a gentle but uplifting message.

Your message should be concise, inspiring, and directly related to their progress. Do not use emojis.`,
});

const generateMotivationFlow = ai.defineFlow(
  {
    name: 'generateMotivationFlow',
    inputSchema: GenerateMotivationInputSchema,
    outputSchema: GenerateMotivationOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

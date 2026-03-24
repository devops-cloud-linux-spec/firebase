'use server';
/**
 * @fileOverview A Genkit flow for suggesting habits or breaking down a goal into actionable daily habits.
 *
 * - suggestHabits - A function that handles the habit suggestion process.
 * - SuggestHabitsInput - The input type for the suggestHabits function.
 * - SuggestHabitsOutput - The return type for the suggestHabits function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestHabitsInputSchema = z.object({
  userGoal: z
    .string()
    .describe('The main goal the user wants to achieve or break down.'),
  existingHabits: z
    .array(z.string())
    .optional()
    .describe(
      'A list of habits the user currently has, to avoid suggesting redundant habits.'
    ),
});
export type SuggestHabitsInput = z.infer<typeof SuggestHabitsInputSchema>;

const SuggestHabitsOutputSchema = z.object({
  suggestions: z.array(
    z.object({
      name: z
        .string()
        .describe('A concise name for the suggested daily habit.'),
      description: z
        .string()
        .describe(
          'A short description explaining the habit or how to implement it.'
        ),
      category: z
        .string()
        .describe('A category for the habit (e.g., "Health", "Learning", "Productivity", "Mindfulness").'),
    })
  ).min(1).max(5),
});
export type SuggestHabitsOutput = z.infer<typeof SuggestHabitsOutputSchema>;

export async function suggestHabits(
  input: SuggestHabitsInput
): Promise<SuggestHabitsOutput> {
  return suggestHabitsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestHabitsPrompt',
  input: {schema: SuggestHabitsInputSchema},
  output: {schema: SuggestHabitsOutputSchema},
  prompt: `You are an elite productivity and habit architect. A user has presented a goal or a problem they want to solve. 

Your mission is to provide an appropriate, professional, and highly actionable response by breaking down their input into 3 to 5 "Atomic Habits".

User Input (Goal/Vision/Problem): {{{userGoal}}}

{{#if existingHabits}}
Context: The user already tracks these habits: {{#each existingHabits}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}. Do not suggest these exact habits again.
{{/if}}

Guidelines:
1. "Solve" the query by translating it into daily routines.
2. Habits must be "Atomic": incredibly small and easy to start (e.g., "Put on running shoes" rather than "Run 5 miles").
3. Each habit must have a clear "Name", a motivating "Description", and a logical "Category".
4. Categories allowed: Health, Learning, Productivity, Mindfulness, Personal, Other.

Your suggestions should feel like a custom-tailored strategy for their specific input.`,
});

const suggestHabitsFlow = ai.defineFlow(
  {
    name: 'suggestHabitsFlow',
    inputSchema: SuggestHabitsInputSchema,
    outputSchema: SuggestHabitsOutputSchema,
  },
  async (input) => {
    const {output} = await prompt({
      ...input,
      existingHabits: input.existingHabits || [],
    });
    return output!;
  }
);

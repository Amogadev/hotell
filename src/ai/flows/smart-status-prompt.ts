'use server';

/**
 * @fileOverview Implements a Genkit flow for the SmartStatusPrompt story, which reviews booking form inputs and flags any fields that are incomplete or suspicious.
 *
 * - smartStatusPrompt - A function that handles the booking form review process.
 * - SmartStatusPromptInput - The input type for the smartStatusPrompt function.
 * - SmartStatusPromptOutput - The return type for the smartStatusPrompt function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SmartStatusPromptInputSchema = z.object({
  customerName: z.string().describe('The name of the customer.'),
  checkInDate: z.string().describe('The check-in date.'),
  checkOutDate: z.string().describe('The check-out date.'),
  numberOfPersons: z.number().describe('The number of persons.'),
  paymentMode: z.string().describe('The payment mode.'),
});
export type SmartStatusPromptInput = z.infer<typeof SmartStatusPromptInputSchema>;

const SmartStatusPromptOutputSchema = z.object({
  flags: z.array(
    z.object({
      field: z.string().describe('The field that is flagged.'),
      reason: z.string().describe('The reason for flagging the field.'),
    })
  ).describe('A list of flags for incomplete or suspicious fields.'),
});
export type SmartStatusPromptOutput = z.infer<typeof SmartStatusPromptOutputSchema>;

export async function smartStatusPrompt(input: SmartStatusPromptInput): Promise<SmartStatusPromptOutput> {
  return smartStatusPromptFlow(input);
}

const prompt = ai.definePrompt({
  name: 'smartStatusPromptPrompt',
  input: {schema: SmartStatusPromptInputSchema},
  output: {schema: SmartStatusPromptOutputSchema},
  prompt: `You are a hotel manager reviewing a booking form.

  Review the following information and flag any fields that are incomplete or suspicious.
  Be concise in your reasoning.

  Customer Name: {{{customerName}}}
  Check-in Date: {{{checkInDate}}}
  Check-out Date: {{{checkOutDate}}}
  Number of Persons: {{{numberOfPersons}}}
  Payment Mode: {{{paymentMode}}}

  Output a JSON array of flags with the field name and the reason for flagging it.  If the field looks ok then do not flag it.
  `,
});

const smartStatusPromptFlow = ai.defineFlow(
  {
    name: 'smartStatusPromptFlow',
    inputSchema: SmartStatusPromptInputSchema,
    outputSchema: SmartStatusPromptOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

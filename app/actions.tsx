'use server';

import { streamObject } from 'ai';
import { createStreamableValue } from 'ai/rsc';
import { openai } from '@ai-sdk/openai';

import { z } from 'zod';

export async function getNotifications(input: string) {
  'use server';

  const stream = createStreamableValue();
  (async () => {
    const { partialObjectStream } = await streamObject({
      model: openai('gpt-4-turbo'),
      system:
        'You are a polite and friendly assistant that generates three notifications for a food delivery app. Generate up to 3 notifications.',
      prompt: input,
      schema: z.object({
        notifications: z.array(
          z.object({
            firstName: z.string(),
            lastName: z.string(),
            message: z
              .string()
              .describe(
                'A message from the user. DO NOT use emojis, links, or line breaks.'
              ),
            city: z.string(),
            orderNumber: z.number(),
            timeStamp: z.number(),
          })
        ),
      }),
    });

    for await (const partialObject of partialObjectStream) {
      stream.update(partialObject);
    }
    stream.done();
  })();
  return { object: stream.value };
}

import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const lessons = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/lessons' }),
  schema: z.object({
    title: z.string(),
    module: z.string(),
    moduleTitle: z.string(),
    order: z.number(),
    description: z.string(),
  }),
});

export const collections = { lessons };

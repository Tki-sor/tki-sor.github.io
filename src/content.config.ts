import { docsLoader } from '@astrojs/starlight/loaders';
import { docsSchema } from '@astrojs/starlight/schema';
import { defineCollection, z } from 'astro:content';

const platform = z.union([
  z.literal('all'),
  z.string().min(1)
]);

const side = z.union([
  z.literal('all'),
  z.enum(['startup', 'server', 'client', 'test'])
]);

export const collections = {
  docs: defineCollection({
    loader: docsLoader(),
    schema: docsSchema({
      extend: z.object({
        type: z.enum(['tutorial', 'guide', 'concept', 'reference', 'cookbook', 'contributing']).default('guide'),
        status: z.enum(['draft', 'preview', 'stable', 'deprecated']).default('draft'),
        platforms: z.array(platform).default(['all']),
        sides: z.array(side).default(['all']),
        minNekojs: z.string().optional(),
        since: z.string().optional(),
        deprecatedSince: z.string().optional(),
        replacement: z.string().optional(),
        keywords: z.array(z.string()).default([]),
        translationOf: z.string().optional(),
        sourceRevision: z.string().optional(),
        translationUpdated: z.union([z.string(), z.date()]).optional(),
        symbolId: z.string().optional()
      })
    })
  })
};

import { createClient } from '@sanity/client';

// Εδώ ορίζουμε το 'client' ως named export
export const client = createClient({
  projectId: '4glboh7e',
  dataset: 'production',
  useCdn: true,
  apiVersion: '2026-02-28',
});
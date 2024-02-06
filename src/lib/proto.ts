import type { OutputFormat } from '../types/options.js';
import type { Proto } from '../types/output.js';
import { promises as fs } from 'node:fs';

export const getProto = (key: OutputFormat, value: string): Proto => {
  return {
    file: value,
    getContent: async () => {
      const content = await fs.readFile(value, { encoding: 'utf8' });
      if (key === 'json') return JSON.parse(content);
      return content;
    },
  };
};

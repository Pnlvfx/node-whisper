import type { AudioToTextOptions } from '../types/options.js';

const getEntries = <T extends object>(obj: T) => {
  return Object.entries(obj) as [keyof T, T[keyof T]][];
};

export const getParams = (options?: AudioToTextOptions) => {
  const params: string[] = [];
  if (options) {
    for (const [key, value] of getEntries(options)) {
      if (value === undefined) continue;
      if (typeof value === 'boolean') {
        params.push(`--${key}`, value ? 'True' : 'False');
      } else {
        params.push(`--${key}`, value.toString());
      }
    }
  }
  return params;
};

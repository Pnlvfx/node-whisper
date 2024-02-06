import type { AudioToTextOptions } from '../types/options.js';

export const getParams = (options?: AudioToTextOptions) => {
  const params: string[] = [];
  if (options) {
    Object.entries(options).map(([k, value]) => {
      const key = k as keyof AudioToTextOptions;
      if (value === undefined) return;
      if (typeof value === 'boolean') {
        params.push(`--${key}`, value ? 'True' : 'False');
      } else {
        params.push(`--${key}`, value);
      }
    });
  }
  return params;
};

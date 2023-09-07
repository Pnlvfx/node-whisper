/* eslint-disable no-unused-vars */
import { AudioToTextOptions, OutputFormat } from '../types/options.js';
import { AudioToTextFiles, Proto } from '../types/output.js';

export type WhisperOptions<T extends OutputFormat | undefined> = AudioToTextOptions & { output_format?: T };

// Function overload for when there are options, but the output_format
export declare function whisper<T extends undefined>(audio: string, options: WhisperOptions<T>): Promise<AudioToTextFiles>;

// Function overload for when output_format is provided
export declare function whisper<T extends OutputFormat>(
  audio: string,
  options: WhisperOptions<T>,
): Promise<T extends 'all' ? AudioToTextFiles : { [K in T]: Proto }>;

// Function overload for when options are not provided
export declare function whisper(audio: string): Promise<AudioToTextFiles>;

import type { Language } from './language.js';

export type WhisperModel =
  | 'tiny.en'
  | 'tiny'
  | 'base.en'
  | 'base'
  | 'small.en'
  | 'small'
  | 'medium.en'
  | 'medium'
  | 'large'
  | 'large-v1'
  | 'large-v2'
  | 'large-v3';

export type StringOutputFormat = 'txt' | 'vtt' | 'srt' | 'tsv';

export type OutputFormat = StringOutputFormat | 'json';

export type AllOutputFormats = OutputFormat | 'all';

export interface AudioToTextOptions {
  /** Name of the Whisper model to use (default: small) */
  model?: WhisperModel;
  /** The path to save model files; uses ~/.cache/whisper by default (default: None) */
  model_dir?: string;
  /** Device to use for PyTorch inference (default: cuda) */
  device?: string;
  /** Directory to save the outputs (default: .) */
  output_dir?: string;
  /** Whether to print out the progress and debug messages (default: True) */
  verbose?: boolean;
  /** Whether to perform X->X speech recognition ('transcribe') or X->English translation ('translate') (default: transcribe) */
  task?: 'transcribe' | 'translate';
  /** Language spoken in the audio, specify None to perform language detection (default: None) */
  language?: Language;
  /** Temperature to use for sampling (default: 0) */
  temperature?: number;
  /** Number of candidates when sampling with non-zero temperature (default: 5) */
  best_of?: number;
  /** Number of beams in beam search, only applicable when temperature is zero (default: 5) */
  beam_size?: number;
  /** Optional patience value to use in beam decoding (default: None) */
  patience?: number;
  /** Optional token length penalty coefficient (alpha) (default: None) */
  length_penalty?: number;
  /** Comma-separated list of token ids to suppress during sampling (default: -1) */
  suppress_tokens?: string;
  /** Optional text to provide as a prompt for the first window (default: None) */
  initial_prompt?: string;
  /** If True, provide the previous output of the model as a prompt for the next window (default: True) */
  condition_on_previous_text?: boolean;
  /** Whether to perform inference in fp16; True by default (default: True) */
  fp16?: boolean;
  /** Temperature to increase when falling back when the decoding fails (default: 0.2) */
  temperature_increment_on_fallback?: number;
  /** If the gzip compression ratio is higher than this value, treat the decoding as failed (default: 2.4) */
  compression_ratio_threshold?: number;
  /** If the average log probability is lower than this value, treat the decoding as failed (default: -1.0) */
  logprob_threshold?: number;
  /** If the probability of the token is higher than this value AND the decoding has failed, consider the segment as silence (default: 0.6) */
  no_speech_threshold?: number;
  /** Extract word-level timestamps and refine the results based on them (default: False) */
  word_timestamps?: boolean;
  /** If word_timestamps is True, merge these punctuation symbols with the next word (default: "'“¿([{-) */
  prepend_punctuations?: string;
  /** If word_timestamps is True, merge these punctuation symbols with the previous word (default: "'.。,，!！?？:：”)]}、) */
  append_punctuations?: string;
  /** (Requires --word_timestamps True) Underline each word as it is spoken in srt and vtt (default: False) */
  highlight_words?: boolean;
  /** (Requires --word_timestamps True) The maximum number of characters in a line before breaking the line (default: None) */
  max_line_width?: number;
  /** (Requires --word_timestamps True) The maximum number of lines in a segment (default: None) */
  max_line_count?: number;
  /** The maximum number of characters per line */
  max_words_per_line?: number;
  /** Number of threads used by torch for CPU inference; supercedes MKL_NUM_THREADS/OMP_NUM_THREADS (default: 0) */
  threads?: number;
}

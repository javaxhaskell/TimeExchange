import "server-only";

import { ElevenLabsClient, ElevenLabsError } from "@elevenlabs/elevenlabs-js";

export const DEFAULT_ELEVENLABS_MODEL_ID = "eleven_multilingual_v2";
export const ELEVENLABS_TTS_TEXT_LIMIT = 500;
export const ELEVENLABS_OUTPUT_FORMAT = "mp3_44100_128" as const;

let elevenLabsClient: ElevenLabsClient | null = null;

function requireEnv(value: string | undefined, name: string) {
  if (!value || !value.trim()) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value.trim();
}

export function getElevenLabsApiKey() {
  return requireEnv(process.env.ELEVENLABS_API_KEY, "ELEVENLABS_API_KEY");
}

export function getElevenLabsDefaultVoiceId() {
  return requireEnv(
    process.env.ELEVENLABS_DEFAULT_VOICE_ID,
    "ELEVENLABS_DEFAULT_VOICE_ID"
  );
}

export function getElevenLabsModelId() {
  return process.env.ELEVENLABS_MODEL_ID?.trim() || DEFAULT_ELEVENLABS_MODEL_ID;
}

export function getElevenLabsClient() {
  if (!elevenLabsClient) {
    elevenLabsClient = new ElevenLabsClient({
      apiKey: getElevenLabsApiKey(),
    });
  }

  return elevenLabsClient;
}

export interface SynthesizeSpeechInput {
  text: string;
  voiceId?: string;
}

export async function synthesizeSpeech({
  text,
  voiceId,
}: SynthesizeSpeechInput) {
  const client = getElevenLabsClient();
  const resolvedVoiceId = voiceId?.trim() || getElevenLabsDefaultVoiceId();

  return client.textToSpeech.convert(resolvedVoiceId, {
    text,
    modelId: getElevenLabsModelId(),
    outputFormat: ELEVENLABS_OUTPUT_FORMAT,
  });
}

export function getElevenLabsErrorMessage(error: unknown) {
  if (error instanceof ElevenLabsError) {
    return error.message || "ElevenLabs request failed.";
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "Unknown ElevenLabs error.";
}

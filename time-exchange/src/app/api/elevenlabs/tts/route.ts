import { ElevenLabsError } from "@elevenlabs/elevenlabs-js";
import { NextResponse } from "next/server";
import {
  ELEVENLABS_TTS_TEXT_LIMIT,
  getElevenLabsErrorMessage,
  synthesizeSpeech,
} from "@/lib/elevenlabs";

export const runtime = "nodejs";

interface TtsRequestBody {
  text?: unknown;
  voiceId?: unknown;
}

function errorResponse(message: string, status: number) {
  return NextResponse.json({ error: message }, { status });
}

export async function POST(request: Request) {
  let payload: TtsRequestBody;

  try {
    payload = (await request.json()) as TtsRequestBody;
  } catch {
    return errorResponse("Invalid JSON body.", 400);
  }

  const text =
    typeof payload.text === "string" ? payload.text.trim() : "";
  const voiceId =
    typeof payload.voiceId === "string" && payload.voiceId.trim()
      ? payload.voiceId.trim()
      : undefined;

  if (!text) {
    return errorResponse("Text is required.", 400);
  }

  if (text.length > ELEVENLABS_TTS_TEXT_LIMIT) {
    return errorResponse(
      `Text must be ${ELEVENLABS_TTS_TEXT_LIMIT} characters or fewer.`,
      400
    );
  }

  try {
    const audioStream = await synthesizeSpeech({
      text,
      voiceId,
    });

    return new Response(audioStream as BodyInit, {
      status: 200,
      headers: {
        "Content-Type": "audio/mpeg",
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    if (
      error instanceof Error &&
      error.message.startsWith("Missing required environment variable:")
    ) {
      return errorResponse(
        "ElevenLabs is not configured. Add ELEVENLABS_API_KEY and ELEVENLABS_DEFAULT_VOICE_ID on the server.",
        500
      );
    }

    if (error instanceof ElevenLabsError) {
      return errorResponse(
        `ElevenLabs request failed: ${getElevenLabsErrorMessage(error)}`,
        error.statusCode && error.statusCode >= 400 && error.statusCode < 500
          ? 502
          : 500
      );
    }

    return errorResponse(
      `Unexpected ElevenLabs error: ${getElevenLabsErrorMessage(error)}`,
      500
    );
  }
}

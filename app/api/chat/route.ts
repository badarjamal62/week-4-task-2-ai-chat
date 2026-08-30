import { convertToModelMessages, streamText, type UIMessage } from "ai";

import { geminiModel, systemPrompt } from "@/lib/ai/config";

type ChatRequest = {
  messages?: unknown;
};

function isChatRequest(value: unknown): value is ChatRequest {
  return typeof value === "object" && value !== null;
}

function isChatMessages(value: unknown): value is UIMessage[] {
  return (
    Array.isArray(value) &&
    value.length > 0 &&
    value.every(
      (message) =>
        typeof message === "object" &&
        message !== null &&
        "id" in message &&
        typeof message.id === "string" &&
        "role" in message &&
        (message.role === "user" || message.role === "assistant") &&
        "parts" in message &&
        Array.isArray(message.parts) &&
        message.parts.some(
          (part: unknown) =>
            typeof part === "object" &&
            part !== null &&
            "type" in part &&
            part.type === "text" &&
            "text" in part &&
            typeof part.text === "string" &&
            part.text.trim().length > 0,
        ),
    )
  );
}

export async function POST(request: Request) {
  let body: ChatRequest;

  try {
    const parsedBody: unknown = await request.json();

    if (!isChatRequest(parsedBody)) {
      return Response.json(
        { error: "Request body must be a JSON object." },
        { status: 400 },
      );
    }

    body = parsedBody;
  } catch {
    return Response.json(
      { error: "Request body must be valid JSON." },
      { status: 400 },
    );
  }

  if (!isChatMessages(body.messages)) {
    return Response.json(
      { error: "Request body must include a non-empty messages array." },
      { status: 400 },
    );
  }

  if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
    return Response.json(
      { error: "The Gemini API key is not configured." },
      { status: 500 },
    );
  }

  try {
    const result = streamText({
      model: geminiModel,
      system: systemPrompt,
      messages: await convertToModelMessages(body.messages),
      onError: ({ error }) => {
        console.error("Gemini streaming request failed", error);
      },
    });

    return result.toUIMessageStreamResponse();
  } catch {
    return Response.json(
      { error: "The Gemini request could not be completed." },
      { status: 500 },
    );
  }
}
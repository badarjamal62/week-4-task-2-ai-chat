
import { beforeEach, describe, expect, it, vi } from "vitest";

const { mockStreamText, mockConvertToModelMessages } = vi.hoisted(() => ({
  mockStreamText: vi.fn(),
  mockConvertToModelMessages: vi.fn(),
}));

vi.mock("ai", () => ({
  convertToModelMessages: mockConvertToModelMessages,
  streamText: mockStreamText,
}));

vi.mock("@/lib/ai/config", () => ({
  geminiModel: {},
  systemPrompt: "Test system prompt",
}));

import { POST } from "./route";

describe("POST /api/chat", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env.GOOGLE_GENERATIVE_AI_API_KEY = "test-api-key";

    mockConvertToModelMessages.mockResolvedValue([
      {
        role: "user",
        content: "What is HTML?",
      },
    ]);

    mockStreamText.mockReturnValue({
      toUIMessageStreamResponse: vi.fn(() => {
        return new Response("test stream", {
          status: 200,
          headers: {
            "Content-Type": "text/plain",
          },
        });
      }),
    });
  });

  it("returns 400 when the request body is invalid JSON", async () => {
    const request = new Request("http://localhost:3000/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: "not-valid-json",
    });

    const response = await POST(request);

    expect(response.status).toBe(400);
    expect(await response.json()).toEqual({
      error: "Request body must be valid JSON.",
    });
  });

  it("returns 400 when messages are missing", async () => {
    const request = new Request("http://localhost:3000/api/chat", {
      method: "POST",
      body: JSON.stringify({}),
    });

    const response = await POST(request);

    expect(response.status).toBe(400);
    expect(await response.json()).toEqual({
      error: "Request body must include a non-empty messages array.",
    });
  });

  it("returns 400 when messages is empty", async () => {
    const request = new Request("http://localhost:3000/api/chat", {
      method: "POST",
      body: JSON.stringify({
        messages: [],
      }),
    });

    const response = await POST(request);

    expect(response.status).toBe(400);
    expect(await response.json()).toEqual({
      error: "Request body must include a non-empty messages array.",
    });
  });

  it("returns 400 when a message has an invalid structure", async () => {
    const request = new Request("http://localhost:3000/api/chat", {
      method: "POST",
      body: JSON.stringify({
        messages: [
          {
            id: "1",
            role: "user",
          },
        ],
      }),
    });

    const response = await POST(request);

    expect(response.status).toBe(400);
    expect(await response.json()).toEqual({
      error: "Request body must include a non-empty messages array.",
    });
  });

  it("returns 500 when the Gemini API key is missing", async () => {
    delete process.env.GOOGLE_GENERATIVE_AI_API_KEY;

    const request = new Request("http://localhost:3000/api/chat", {
      method: "POST",
      body: JSON.stringify({
        messages: [
          {
            id: "1",
            role: "user",
            parts: [
              {
                type: "text",
                text: "What is HTML?",
              },
            ],
          },
        ],
      }),
    });

    const response = await POST(request);

    expect(response.status).toBe(500);
    expect(await response.json()).toEqual({
      error: "The Gemini API key is not configured.",
    });
  });

  it("streams a response for a valid web-development message", async () => {
    const request = new Request("http://localhost:3000/api/chat", {
      method: "POST",
      body: JSON.stringify({
        messages: [
          {
            id: "1",
            role: "user",
            parts: [
              {
                type: "text",
                text: "What is HTML?",
              },
            ],
          },
        ],
      }),
    });

    const response = await POST(request);

    expect(response.status).toBe(200);
    expect(mockConvertToModelMessages).toHaveBeenCalledTimes(1);
    expect(mockStreamText).toHaveBeenCalledTimes(1);
    expect(response.headers.get("Content-Type")).toBe("text/plain");
  });
});


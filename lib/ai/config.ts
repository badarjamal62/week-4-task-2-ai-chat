import "server-only";

import { anthropic } from "@ai-sdk/anthropic";

// The provider reads ANTHROPIC_API_KEY from the server environment.
// Keeping this module server-only prevents the model configuration from
// being imported into browser code.
export const claudeModel = anthropic("claude-sonnet-4-5");

// This instruction will be supplied to Claude by the future server route.
export const systemPrompt =
  "You are a helpful, concise AI assistant. Answer clearly and acknowledge uncertainty when needed.";

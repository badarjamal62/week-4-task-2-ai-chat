import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { useChat } from "@ai-sdk/react";
import ChatInterface from "../../../app/chat/ChatInterface";

vi.mock("@ai-sdk/react", () => ({
  useChat: vi.fn(),
}));

const mockedUseChat = vi.mocked(useChat);

function mockChatState(overrides: Partial<ReturnType<typeof useChat>> = {}) {
  const defaultState = {
    messages: [],
    sendMessage: vi.fn().mockResolvedValue(undefined),
    status: "ready",
    error: undefined,
  } as Partial<ReturnType<typeof useChat>>;

  mockedUseChat.mockReturnValue({
    ...defaultState,
    ...overrides,
  } as ReturnType<typeof useChat>);

  return mockedUseChat.mock.results.at(-1)?.value?.sendMessage as
    | ReturnType<typeof vi.fn>
    | undefined;
}

describe("ChatInterface", () => {
  beforeEach(() => {
    mockedUseChat.mockReset();
  });

  it("renders the initial chat UI with heading, textarea, Send button, and suggested questions", () => {
    mockChatState();

    render(<ChatInterface />);

    expect(
      screen.getByRole("heading", { name: /web development assistant/i }),
    ).toBeInTheDocument();
    expect(screen.getByLabelText(/message/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /send message/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /what is the difference between html and css\?/i }),
    ).toBeInTheDocument();
  });

  it("disables the Send button when the input is empty", () => {
    mockChatState();

    render(<ChatInterface />);

    expect(screen.getByRole("button", { name: /send message/i })).toBeDisabled();
  });

  it("enables the Send button when the user types a message", () => {
    mockChatState();

    render(<ChatInterface />);

    const textarea = screen.getByLabelText(/message/i);
    const submitButton = screen.getByRole("button", { name: /send message/i });

    fireEvent.change(textarea, { target: { value: "How does React work?" } });

    expect(submitButton).toBeEnabled();
  });

  it("keeps overflow hidden until the textarea content exceeds its maximum height", () => {
    mockChatState();

    render(<ChatInterface />);

    const textarea = screen.getByLabelText(/message/i);

    Object.defineProperty(textarea, "scrollHeight", {
      configurable: true,
      value: 168,
    });
    fireEvent.change(textarea, { target: { value: "Seven lines of text" } });

    expect(textarea).toHaveStyle({
      height: "168px",
      overflowY: "hidden",
      overflowX: "hidden",
    });

    Object.defineProperty(textarea, "scrollHeight", { value: 220 });
    fireEvent.change(textarea, {
      target: { value: "Seven lines of text\nAnd one more line" },
    });

    expect(textarea).toHaveStyle({
      height: "192px",
      overflowY: "auto",
      overflowX: "hidden",
    });

    Object.defineProperty(textarea, "scrollHeight", { value: 48 });
    fireEvent.change(textarea, { target: { value: "Hello" } });

    expect(textarea).toHaveStyle({
      height: "48px",
      overflowY: "hidden",
    });
  });

  it("submits the entered message and calls sendMessage with the typed text", async () => {
    const sendMessage = vi.fn().mockResolvedValue(undefined);
    mockChatState({ sendMessage });

    render(<ChatInterface />);

    const textarea = screen.getByLabelText(/message/i);
    const submitButton = screen.getByRole("button", { name: /send message/i });

    fireEvent.change(textarea, { target: { value: "Explain React state." } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(sendMessage).toHaveBeenCalledTimes(1);
      expect(sendMessage).toHaveBeenCalledWith({ text: "Explain React state." });
    });
  });

  it("shows an accessible alert when the chat hook returns an error", () => {
    mockChatState({
      error: new Error("Something went wrong."),
    });

    render(<ChatInterface />);

    expect(screen.getByRole("alert")).toHaveTextContent("Something went wrong.");
  });
});

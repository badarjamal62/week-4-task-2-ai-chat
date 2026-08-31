"use client";

import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import {
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type FormEvent,
} from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import SuggestedQuestions from "./SuggestedQuestions";
import styles from "./chat.module.css";

const suggestedQuestions = [
  "What is the difference between HTML and CSS?",
  "How does React component state work?",
  "Why is my CSS Flexbox layout not working?",
  "Explain how an API works in a web application.",
];

const maxInputHeight = 192;
const scrollBottomThreshold = 80;

export default function ChatInterface() {
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll remains enabled only while the user is at/near the bottom.
  const shouldAutoScrollRef = useRef(true);

  // Prevent our own programmatic scroll from being treated as user scrolling.
  const programmaticScrollRef = useRef(false);

  const { messages, sendMessage, status, error } = useChat({
    transport: new DefaultChatTransport({ api: "/api/chat" }),
  });

  const isSubmitting = status === "submitted" || status === "streaming";
  const canSubmit = input.trim().length > 0 && !isSubmitting;

  /*
   * Track the user's actual page position.
   *
   * If the user scrolls upward, the distance from the bottom becomes
   * greater than the threshold and auto-scroll is disabled.
   *
   * When the user manually returns near the bottom, auto-scroll is
   * enabled again.
   */
  useEffect(() => {
    const handleScroll = () => {
      if (programmaticScrollRef.current) {
        return;
      }

      const documentHeight = document.documentElement.scrollHeight;
      const viewportHeight = window.innerHeight;
      const scrollPosition = window.scrollY;

      const distanceFromBottom =
        documentHeight - (scrollPosition + viewportHeight);

      shouldAutoScrollRef.current =
        distanceFromBottom <= scrollBottomThreshold;
    };

    window.addEventListener("scroll", handleScroll, {
      passive: true,
    });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  /*
   * Follow newly generated content only when the user is already
   * at/near the bottom.
   *
   * If the user has manually scrolled upward, this effect exits
   * immediately and never moves the viewport.
   */
  useEffect(() => {
    if (!shouldAutoScrollRef.current) {
      return;
    }

    const target = messagesEndRef.current;

    if (!target) {
      return;
    }

    programmaticScrollRef.current = true;

    target.scrollIntoView({
      behavior: "auto",
      block: "end",
    });

    requestAnimationFrame(() => {
      programmaticScrollRef.current = false;
    });
  }, [messages]);

  async function sendQuestion(question: string) {
    const content = question.trim();

    if (!content || isSubmitting) {
      return;
    }

    // Starting a new question should follow the new response.
    shouldAutoScrollRef.current = true;

    setInput("");
    await sendMessage({ text: content });
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    await sendQuestion(input);
  }

  function handleInputChange(event: ChangeEvent<HTMLTextAreaElement>) {
    const textarea = event.currentTarget;

    textarea.style.height = "auto";
    textarea.style.overflowY = "hidden";

    const contentHeight = textarea.scrollHeight;
    const isOverflowing = contentHeight > maxInputHeight;

    textarea.style.height = `${Math.min(contentHeight, maxInputHeight)}px`;
    textarea.style.overflowY = isOverflowing ? "auto" : "hidden";

    setInput(textarea.value);
  }

  return (
    <section className={styles.chat} aria-labelledby="chat-title">
      <header className={styles.header}>
        <p className={styles.eyebrow}>
          Web Development Learning Assistant
        </p>

        <h1 id="chat-title">Web Development Assistant</h1>

        <p className={styles.description}>
          Get clear, practical help with web development.
        </p>
      </header>

      <div
        className={styles.messages}
        aria-live="polite"
        aria-label="Conversation"
      >
        {messages.length === 0 ? (
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon} aria-hidden="true">
              <span />
            </div>

            <p className={styles.emptyKicker}>Ready when you are</p>

            <h2>How can I help today?</h2>

            <p className={styles.emptyDescription}>
              Ask a question, explore an idea, or choose a prompt to get
              started.
            </p>

            <SuggestedQuestions
              questions={suggestedQuestions}
              onSelect={sendQuestion}
              disabled={isSubmitting}
            />
          </div>
        ) : (
          messages.map((message) => {
            const text = message.parts
              .filter((part) => part.type === "text")
              .map((part) => part.text)
              .join("");

            return (
              <article
                className={`${styles.message} ${
                  message.role === "user"
                    ? styles.userMessage
                    : styles.assistantMessage
                }`}
                key={message.id}
              >
                <p className={styles.messageRole}>
                  {message.role === "user" ? "You" : "Gemini"}
                </p>

                <div className={styles.messageContent}>
                  {text ? (
                    <ReactMarkdown
                      remarkPlugins={[remarkGfm]}
                      components={{
                        pre: ({ children, ...props }) => (
                          <pre {...props}>{children}</pre>
                        ),
                      }}
                    >
                      {text}
                    </ReactMarkdown>
                  ) : isSubmitting ? (
                    "Thinking..."
                  ) : null}
                </div>
              </article>
            );
          })
        )}

        <div ref={messagesEndRef} aria-hidden="true" />
      </div>

      {error ? (
        <p className={styles.error} role="alert">
          {error.message}
        </p>
      ) : null}

      <form className={styles.form} onSubmit={handleSubmit}>
        <label className={styles.inputLabel} htmlFor="chat-input">
          Message
        </label>

        <textarea
          id="chat-input"
          className={styles.input}
          value={input}
          onChange={handleInputChange}
          placeholder="Write a message..."
          rows={1}
          disabled={isSubmitting}
        />

        <button
          className={styles.submit}
          type="submit"
          disabled={!canSubmit}
        >
          {isSubmitting ? "Sending..." : "Send message"}
        </button>
      </form>
    </section>
  );
}
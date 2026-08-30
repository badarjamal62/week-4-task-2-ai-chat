"use client";

import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { FormEvent, useEffect, useRef, useState } from "react";
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

export default function ChatInterface() {
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // True when the user wants the page to follow the newest response.
  const shouldAutoScrollRef = useRef(true);

  // Prevent our own programmatic scrolling from being interpreted
  // as the user manually scrolling.
  const programmaticScrollRef = useRef(false);

  const { messages, sendMessage, status, error } = useChat({
    transport: new DefaultChatTransport({ api: "/api/chat" }),
  });

  const isSubmitting = status === "submitted" || status === "streaming";
  const canSubmit = input.trim().length > 0 && !isSubmitting;

  /*
   * Detect manual page scrolling.
   *
   * If the user moves away from the bottom, auto-scroll is disabled.
   * When the user manually returns near the bottom, auto-scroll resumes.
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

      const isNearBottom = distanceFromBottom <= 80;

      shouldAutoScrollRef.current = isNearBottom;
    };

    window.addEventListener("scroll", handleScroll, {
      passive: true,
    });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  /*
   * Follow the latest response only when auto-scroll is enabled.
   *
   * The user's manual scroll position is never overridden once
   * auto-scroll has been disabled.
   */
  useEffect(() => {
    if (!shouldAutoScrollRef.current) {
      return;
    }

    programmaticScrollRef.current = true;

    messagesEndRef.current?.scrollIntoView({
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

    // A new question should start at the latest conversation position.
    shouldAutoScrollRef.current = true;

    setInput("");
    await sendMessage({ text: content });
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    await sendQuestion(input);
  }

  function handleInputChange(event: React.ChangeEvent<HTMLTextAreaElement>) {
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
        <p className={styles.eyebrow}>Web Development Learning Assistant</p>

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
          messages.map((message) => (
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
                {message.parts
                  .filter((part) => part.type === "text")
                  .map((part) => part.text)
                  .join("") ? (
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    components={{
                      pre: ({ children, ...props }) => (
                        <pre {...props}>{children}</pre>
                      ),
                    }}
                  >
                    {message.parts
                      .filter((part) => part.type === "text")
                      .map((part) => part.text)
                      .join("")}
                  </ReactMarkdown>
                ) : (
                  isSubmitting ? "Thinking..." : ""
                )}
              </div>
            </article>
          ))
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
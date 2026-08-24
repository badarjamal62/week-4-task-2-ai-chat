"use client";

import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { FormEvent, useState } from "react";

import SuggestedQuestions from "./SuggestedQuestions";
import styles from "./chat.module.css";

const suggestedQuestions = [
  "What can you help me with?",
  "How do I get started?",
  "What features are available?",
  "Can you explain how this works?",
];

export default function ChatInterface() {
  const [input, setInput] = useState("");
  const { messages, sendMessage, status, error } = useChat({
    transport: new DefaultChatTransport({ api: "/api/chat" }),
  });
  const isSubmitting = status === "submitted" || status === "streaming";
  const canSubmit = input.trim().length > 0 && !isSubmitting;

  async function sendQuestion(question: string) {
    const content = question.trim();
    if (!content || isSubmitting) {
      return;
    }

    setInput("");
    await sendMessage({ text: content });
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    await sendQuestion(input);
  }

  return (
    <section className={styles.chat} aria-labelledby="chat-title">
      <header className={styles.header}>
        <p className={styles.eyebrow}>Streaming assistant</p>
        <h1 id="chat-title">Ask Claude</h1>
        <p className={styles.description}>Send a message and watch the response arrive in real time.</p>
      </header>

      <div className={styles.messages} aria-live="polite" aria-label="Conversation">
        {messages.length === 0 ? (
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon} aria-hidden="true">
              <span />
            </div>
            <p className={styles.emptyKicker}>Ready when you are</p>
            <h2>How can I help today?</h2>
            <p className={styles.emptyDescription}>
              Ask a question, explore an idea, or choose a prompt to get started.
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
                message.role === "user" ? styles.userMessage : styles.assistantMessage
              }`}
              key={message.id}
            >
              <p className={styles.messageRole}>{message.role === "user" ? "You" : "Claude"}</p>
              <div className={styles.messageContent}>
                {message.parts
                  .filter((part) => part.type === "text")
                  .map((part) => part.text)
                  .join("") || (isSubmitting ? "Thinking..." : "")}
              </div>
            </article>
          ))
        )}
      </div>

      {error ? <p className={styles.error} role="alert">{error.message}</p> : null}

      <form className={styles.form} onSubmit={handleSubmit}>
        <label className={styles.inputLabel} htmlFor="chat-input">
          Message
        </label>
        <textarea
          id="chat-input"
          className={styles.input}
          value={input}
          onChange={(event) => setInput(event.target.value)}
          placeholder="Write a message..."
          rows={3}
          disabled={isSubmitting}
        />
        <button className={styles.submit} type="submit" disabled={!canSubmit}>
          {isSubmitting ? "Sending..." : "Send message"}
        </button>
      </form>
    </section>
  );
}

import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import SuggestedQuestions from "../../../app/chat/SuggestedQuestions";

describe("SuggestedQuestions", () => {
  it("renders the available questions and calls onSelect with the clicked one", () => {
    const handleSelect = vi.fn();
    const questions = [
      "What is the difference between HTML and CSS?",
      "How does React component state work?",
    ];

    render(
      <SuggestedQuestions questions={questions} onSelect={handleSelect} />,
    );

    expect(
      screen.getByRole("button", {
        name: /what is the difference between html and css\?/i,
      }),
    ).toBeInTheDocument();

    fireEvent.click(
      screen.getByRole("button", {
        name: /how does react component state work\?/i,
      }),
    );

    expect(handleSelect).toHaveBeenCalledTimes(1);
    expect(handleSelect).toHaveBeenCalledWith(
      "How does React component state work?",
    );
  });

  it("disables all suggestion buttons when the component is disabled", () => {
    const questions = ["Explain how an API works in a web application."];

    render(
      <SuggestedQuestions questions={questions} onSelect={vi.fn()} disabled />,
    );

    expect(
      screen.getByRole("button", {
        name: /explain how an api works in a web application\./i,
      }),
    ).toBeDisabled();
  });
});

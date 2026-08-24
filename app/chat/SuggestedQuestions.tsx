import styles from "./chat.module.css";

type SuggestedQuestionsProps = {
  questions: string[];
  onSelect: (question: string) => void;
  disabled?: boolean;
};

export default function SuggestedQuestions({
  questions,
  onSelect,
  disabled = false,
}: SuggestedQuestionsProps) {
  return (
    <div className={styles.suggestions} aria-label="Suggested questions">
      {questions.map((question) => (
        <button
          className={styles.suggestion}
          key={question}
          type="button"
          onClick={() => onSelect(question)}
          disabled={disabled}
        >
          <span>{question}</span>
          <span className={styles.suggestionArrow} aria-hidden="true">
            &rarr;
          </span>
        </button>
      ))}
    </div>
  );
}
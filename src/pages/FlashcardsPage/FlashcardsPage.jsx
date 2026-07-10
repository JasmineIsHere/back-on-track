import { useReducer, useState } from "react";
import HeaderBar from "../../components/HeaderBar/HeaderBar";
import Container from "../../components/Container";
import { useAppContext } from "../../context/AppContext";
import flashcards from "../../data/flashcards";
import {
  CardBack,
  CardFront,
  CardInner,
  CardScene,
  CardText,
  CompletionBox,
  FlipHint,
  GotItButton,
  ProgressFill,
  ProgressLabel,
  ProgressTrack,
  RatingRow,
  ResetButton,
  ReviewAgainButton,
} from ".";

const TOPICS = ["React & JS deck", "Java 21 deck", "Data Structures deck", "Kubernetes deck"];

function buildInitialState(cards) {
  return { queue: [...cards], cleared: 0, total: cards.length, flipped: false, done: cards.length === 0 };
}

function reducer(state, action) {
  switch (action.type) {
    case "FLIP":
      return { ...state, flipped: !state.flipped };
    case "RATE_GOT_IT": {
      const [, ...rest] = state.queue;
      return { ...state, queue: rest, cleared: state.cleared + 1, flipped: false, done: rest.length === 0 };
    }
    case "RATE_REVIEW_AGAIN": {
      const [current, ...rest] = state.queue;
      return { ...state, queue: [...rest, current], flipped: false };
    }
    case "RESET":
      return buildInitialState(action.cards);
    default:
      return state;
  }
}

const FlashcardsPage = () => {
  const { setFlashcardProgress } = useAppContext();
  const [selectedTopic] = useState(() => TOPICS[Math.floor(Math.random() * TOPICS.length)]);
  const [state, dispatch] = useReducer(
    reducer,
    selectedTopic,
    (topic) => buildInitialState(flashcards.filter((c) => c.topic === topic)),
  );

  const percent = state.total ? Math.round((state.cleared / state.total) * 100) : 0;
  const currentCard = state.queue[0];

  const handleFlip = () => dispatch({ type: "FLIP" });

  const handleGotIt = () => {
    const newCleared = state.cleared + 1;
    dispatch({ type: "RATE_GOT_IT" });
    setFlashcardProgress({ completed: newCleared, total: state.total });
  };

  const handleReviewAgain = () => dispatch({ type: "RATE_REVIEW_AGAIN" });

  const handleReset = () => {
    const cards = flashcards.filter((c) => c.topic === selectedTopic);
    dispatch({ type: "RESET", cards });
    setFlashcardProgress({ completed: 0, total: cards.length });
  };

  return (
    <>
      <HeaderBar title="Flashcards" subtitle={selectedTopic} />
      <Container>
        <ProgressTrack>
          <ProgressFill $percent={percent} />
        </ProgressTrack>
        <ProgressLabel>
          {state.cleared} / {state.total} cards cleared
        </ProgressLabel>

        {state.done ? (
          <CompletionBox>
            <p>All cards cleared! 🎉</p>
            <ResetButton onClick={handleReset}>Restart deck</ResetButton>
          </CompletionBox>
        ) : (
          <>
            <CardScene onClick={handleFlip}>
              <CardInner $flipped={state.flipped}>
                <CardFront>
                  <CardText>{currentCard.question}</CardText>
                  <FlipHint>Tap to reveal answer</FlipHint>
                </CardFront>
                <CardBack>
                  <CardText>{currentCard.answer}</CardText>
                </CardBack>
              </CardInner>
            </CardScene>
            {state.flipped && (
              <RatingRow>
                <GotItButton onClick={handleGotIt}>Got it ✓</GotItButton>
                <ReviewAgainButton onClick={handleReviewAgain}>Review again</ReviewAgainButton>
              </RatingRow>
            )}
          </>
        )}
      </Container>
    </>
  );
};

export default FlashcardsPage;

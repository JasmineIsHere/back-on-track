import { useMemo } from "react";
import HeaderBar from "../../components/HeaderBar/HeaderBar";
import Container from "../../components/Container";
import { useAppContext } from "../../context/AppContext";
import { useLocalStorage } from "../../hooks/useLocalStorage";
import {
  EmptyPrompt,
  MoodButton,
  MoodGrid,
  MoodLabel,
  MoodSection,
  StatCard,
  StatLabel,
  StatsSection,
  StatValue,
} from ".";

const MOODS = [
  { id: "great", label: "😄 Great" },
  { id: "good", label: "🙂 Good" },
  { id: "okay", label: "😐 Okay" },
  { id: "low", label: "😔 Low" },
  { id: "stressed", label: "😤 Stressed" },
];

const HomePage = () => {
  const { habits, flashcardProgress } = useAppContext();

  const today = new Date();
  const options = { weekday: "long", day: "numeric", month: "long" };
  const formattedDate = today.toLocaleDateString(undefined, options);

  const greeting = () => {
    const hour = today.getHours();
    if (hour < 12) {
      return "Good Morning";
    } else if (hour < 18) {
      return "Good Afternoon";
    } else {
      return "Good Evening";
    }
  };

  const user = "John";

  const todayKey = `mood-${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
  const [selectedMood, setSelectedMood] = useLocalStorage(todayKey, null);

  const habitStats = useMemo(() => {
    const total = habits.length;
    const completed = habits.filter((h) => h.completed).length;
    const percent = total ? Math.round((completed / total) * 100) : 0;
    return { total, completed, percent };
  }, [habits]);

  const flashTone =
    flashcardProgress.total === 0
      ? "none"
      : flashcardProgress.completed === flashcardProgress.total
        ? "good"
        : flashcardProgress.completed > 0
          ? "partial"
          : "none";

  const habitTone =
    habitStats.total === 0
      ? "none"
      : habitStats.percent === 100
        ? "good"
        : habitStats.percent > 0
          ? "partial"
          : "none";

  return (
    <>
      <HeaderBar title={greeting() + ", " + user + "!"} subtitle={formattedDate} />
      <Container>
        <StatsSection>
          <StatCard>
            <StatLabel>Today's habits</StatLabel>
            {habitStats.total === 0 ? (
              <EmptyPrompt>Add your first habit on the Habits page</EmptyPrompt>
            ) : (
              <StatValue $tone={habitTone}>
                {habitStats.completed} / {habitStats.total} habits done — {habitStats.percent}%
              </StatValue>
            )}
          </StatCard>
          <StatCard>
            <StatLabel>Flashcard session</StatLabel>
            {flashcardProgress.total === 0 ? (
              <EmptyPrompt>Start a session on the Flashcards page</EmptyPrompt>
            ) : (
              <StatValue $tone={flashTone}>
                {flashcardProgress.completed} / {flashcardProgress.total} cards cleared
              </StatValue>
            )}
          </StatCard>
        </StatsSection>
        <MoodSection>
          <MoodLabel>How are you feeling today?</MoodLabel>
          <MoodGrid>
            {MOODS.map((mood) => (
              <MoodButton
                key={mood.id}
                $selected={selectedMood === mood.id}
                onClick={() => setSelectedMood(mood.id)}
              >
                {mood.label}
              </MoodButton>
            ))}
          </MoodGrid>
        </MoodSection>
      </Container>
    </>
  );
};

export default HomePage;

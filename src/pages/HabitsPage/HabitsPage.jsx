import { useState, useMemo } from "react";
import Container from "../../components/Container";
import HeaderBar from "../../components/HeaderBar/HeaderBar";
import { useAppContext } from "../../context/AppContext";
import {
  CheckedIcon,
  HabitContainer,
  HabitText,
  HeaderText,
  InputContainer,
  InputField,
  ProgressFill,
  ProgressTrack,
  StreakBadge,
  SubmitButton,
  UncheckedIcon,
} from ".";

const HabitsPage = () => {
  const { habits, setHabits } = useAppContext();
  const [newHabit, setNewHabit] = useState("");

  const { completedCount, percent } = useMemo(() => {
    const completed = habits.filter((h) => h.completed).length;
    return {
      completedCount: completed,
      percent: habits.length ? Math.round((completed / habits.length) * 100) : 0,
    };
  }, [habits]);

  const handleInputChange = (e) => {
    setNewHabit(e.target.value);
  };

  const handleAddHabit = () => {
    if (newHabit.trim() !== "") {
      setHabits([...habits, { name: newHabit, completed: false, streak: 0 }]);
      setNewHabit("");
    }
  };

  const toggleHabitCompletion = (index) => {
    const updatedHabits = habits.map((habit, i) => {
      if (i !== index) return habit;
      const nowCompleted = !habit.completed;
      const streak = nowCompleted
        ? (habit.streak ?? 0) + 1
        : Math.max(0, (habit.streak ?? 0) - 1);
      return { ...habit, completed: nowCompleted, streak };
    });
    setHabits(updatedHabits);
  };

  return (
    <>
      <HeaderBar title={"Habits"} subtitle={"Today's checklist"} />
      {habits.length > 0 && (
        <Container>
          <ProgressTrack>
            <ProgressFill $percent={percent} />
          </ProgressTrack>
          {habits.map((habit, index) => (
            <HabitContainer key={index}>
              {habit.completed ?
              <CheckedIcon onClick={() => toggleHabitCompletion(index)} /> : <UncheckedIcon onClick={() => toggleHabitCompletion(index)} />
              }
              <HabitText completed={habit.completed}>
                {habit.name}
              </HabitText>
              <StreakBadge>🔥 {habit.streak ?? 0}</StreakBadge>
            </HabitContainer>
          ))}
        </Container>
      )}
      <Container>
        <HeaderText>ADD A HABIT</HeaderText>
        <InputContainer>
          <InputField
            type="text"
            placeholder="e.g. Meditate for 10 min"
            name="newHabit"
            value={newHabit}
            onChange={handleInputChange}
            onKeyDown={(e) => e.key === "Enter" && handleAddHabit()}
          />
          <SubmitButton onClick={handleAddHabit}>+</SubmitButton>
        </InputContainer>
      </Container>
    </>
  );
};

export default HabitsPage;

import { useState } from "react";
import Container from "../../components/Container";
import HeaderBar from "../../components/HeaderBar/HeaderBar";
import {
  CheckedIcon,
  HabitContainer,
  HabitText,
  HeaderText,
  InputContainer,
  InputField,
  SubmitButton,
  UncheckedIcon,
} from ".";

const HabitsPage = () => {
  const [habits, setHabits] = useState([
    { name: "Drink water", completed: true },
  ]);
  const [newHabit, setNewHabit] = useState("");

  const handleInputChange = (e) => {
    setNewHabit(e.target.value);
  };

  const handleAddHabit = () => {
    if (newHabit.trim() !== "") {
      setHabits([...habits, { name: newHabit, completed: false }]);
      setNewHabit("");
    }
  };

  const toggleHabitCompletion = (index) => {
    const updatedHabits = habits.map((habit, i) =>
      i === index ? { ...habit, completed: !habit.completed } : habit,
    );
    setHabits(updatedHabits);
  };

  return (
    <>
      <HeaderBar title={"Habits"} subtitle={"Today's checklist"} />
      {habits.length > 0 && (
        <Container>
          {habits.map((habit, index) => (
            <HabitContainer key={index}>
              {habit.completed ? 
              <CheckedIcon onClick={() => toggleHabitCompletion(index)} /> : <UncheckedIcon onClick={() => toggleHabitCompletion(index)} />
              }
              <HabitText completed={habit.completed}>
                {habit.name}
              </HabitText>
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

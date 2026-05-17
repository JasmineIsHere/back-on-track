import { useState } from "react";
import HeaderBar from "../../components/HeaderBar/HeaderBar";

const FlashcardsPage = () => {
  const [topics, setTopics] = useState([
    "React & JS deck",
    "Java 21 deck",
    "Data Structures deck",
    "Kubernetes deck",
  ]);
  const [selectedTopic, setSelectedTopic] = useState(
    () => topics[Math.floor(Math.random() * topics.length)],
  );

  return (
    <>
      <HeaderBar title={"Flashcards"} subtitle={selectedTopic} />
    </>
  );
};

export default FlashcardsPage;

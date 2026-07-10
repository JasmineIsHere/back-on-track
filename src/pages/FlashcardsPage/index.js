import styled from "styled-components";

export const CardScene = styled.div`
  perspective: 1000px;
  width: 100%;
  cursor: pointer;
  margin: 1rem 0;
`;

export const CardInner = styled.div`
  position: relative;
  min-height: 220px;
  transform-style: preserve-3d;
  transition: transform 0.5s ease;
  transform: ${({ $flipped }) => ($flipped ? "rotateY(180deg)" : "rotateY(0deg)")};
`;

const CardFace = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  min-height: 220px;
  border-radius: 12px;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  backface-visibility: hidden;
  background-color: ${({ theme }) => theme.bgSecondary};
  border: 1px solid ${({ theme }) => theme.border};
`;

export const CardFront = styled(CardFace)``;

export const CardBack = styled(CardFace)`
  transform: rotateY(180deg);
`;

export const CardText = styled.p`
  font-size: 1.1rem;
  color: ${({ theme }) => theme.textPrimary};
  line-height: 1.6;
`;

export const FlipHint = styled.span`
  font-size: 0.75rem;
  color: ${({ theme }) => theme.textTertiary};
  margin-top: 1rem;
`;

export const RatingRow = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
`;

export const GotItButton = styled.button`
  flex: 1;
  padding: 0.75rem;
  border-radius: 8px;
  font-size: 1rem;
  cursor: pointer;
  background-color: ${({ theme }) => theme.greenBg};
  color: ${({ theme }) => theme.greenText};
  border: 1px solid ${({ theme }) => theme.greenText};
`;

export const ReviewAgainButton = styled.button`
  flex: 1;
  padding: 0.75rem;
  border-radius: 8px;
  font-size: 1rem;
  cursor: pointer;
  background-color: ${({ theme }) => theme.amberBg};
  color: ${({ theme }) => theme.amberText};
  border: 1px solid ${({ theme }) => theme.amberText};
`;

export const ProgressTrack = styled.div`
  width: 100%;
  height: 8px;
  background-color: ${({ theme }) => theme.bgSecondary};
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 0.5rem;
`;

export const ProgressFill = styled.div`
  height: 100%;
  width: ${({ $percent }) => $percent}%;
  background-color: ${({ theme }) => theme.greenStrong};
  border-radius: 4px;
  transition: width 0.3s ease;
`;

export const ProgressLabel = styled.p`
  font-size: 0.875rem;
  color: ${({ theme }) => theme.textSecondary};
  margin-bottom: 1rem;
`;

export const CompletionBox = styled.div`
  text-align: center;
  padding: 2rem;
  background-color: ${({ theme }) => theme.greenBg};
  border-radius: 12px;
  color: ${({ theme }) => theme.greenText};
`;

export const ResetButton = styled.button`
  margin-top: 1rem;
  padding: 0.75rem 1.5rem;
  background-color: ${({ theme }) => theme.bgSecondary};
  color: ${({ theme }) => theme.textPrimary};
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: 8px;
  font-size: 1rem;
  cursor: pointer;
`;

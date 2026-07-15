import styled from "styled-components";

export const StatsSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

export const StatCard = styled.div`
  background-color: ${({ theme }) => theme.bgSecondary};
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: 12px;
  padding: 1.25rem 1.5rem;
`;

export const StatLabel = styled.p`
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: ${({ theme }) => theme.textTertiary};
  margin-bottom: 0.5rem;
`;

export const StatValue = styled.p`
  font-size: 1rem;
  color: ${({ $tone, theme }) =>
    $tone === "good"
      ? theme.greenText
      : $tone === "partial"
        ? theme.amberText
        : theme.textSecondary};
`;

export const EmptyPrompt = styled.p`
  font-size: 0.875rem;
  color: ${({ theme }) => theme.textSecondary};
`;

export const MoodSection = styled.div`
  margin-top: 1.5rem;
`;

export const MoodLabel = styled.p`
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: ${({ theme }) => theme.textTertiary};
  margin-bottom: 0.75rem;
`;

export const MoodGrid = styled.div`
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
`;

export const MoodButton = styled.button`
  padding: 0.5rem 1rem;
  border-radius: 8px;
  font-size: 0.9rem;
  cursor: pointer;
  border: 1px solid
    ${({ $selected, theme }) => ($selected ? theme.purpleText : theme.border)};
  background-color: ${({ $selected, theme }) =>
    $selected ? theme.purpleBg : theme.bgSecondary};
  color: ${({ $selected, theme }) =>
    $selected ? theme.purpleText : theme.textPrimary};
`;

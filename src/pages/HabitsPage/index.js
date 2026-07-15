import { TbCircle, TbCircleCheckFilled } from "react-icons/tb";
import styled from "styled-components";

export const HeaderText = styled.p`
  font-size: 1rem;
  color: ${(props) => props.theme.textSecondary};
  font-weight: bold;
  margin-bottom: 0.5rem;
`;

export const HabitContainer = styled.div`
  display: flex;
  flex-direction: row;
  gap: 1rem;
  align-items: center;
  padding: 0.75rem 0;
  border-bottom: 1px solid ${(props) => props.theme.border};
`;

export const UncheckedIcon = styled(TbCircle)`
  width: 1.75rem;
  height: 1.75rem;
`;

export const CheckedIcon = styled(TbCircleCheckFilled)`
  color: ${(props) => props.theme.greenStrong};
  width: 1.75rem;
  height: 1.75rem;
`;

export const HabitText = styled.p`
  font-size: 1rem;
  color: ${(props) => props.completed ? props.theme.textSecondary : props.theme.textPrimary};
  text-decoration: ${(props) => (props.completed ? "line-through" : "none")};
`;

export const InputContainer = styled.div`
  display: flex;
  flex-direction: row;

  gap: 0.5rem;
`;

export const InputField = styled.input`
  display: flex;
  flex: 1;
  padding: 0.75rem;
  border: 1px solid ${(props) => props.theme.border};
  border-radius: 8px;
  font-size: 1rem;
  background-color: ${(props) => props.theme.bgSecondary};
  color: ${(props) => props.theme.textPrimary};

  &:active {
    outline: none;
    border-color: ${(props) => props.theme.primary};
  }
`;

export const SubmitButton = styled.button`
  padding: 0.5rem 1.5rem;
  background-color: ${(props) => props.theme.bgSecondary};
  color: ${(props) => props.theme.textPrimary};
  border: 1px solid ${(props) => props.theme.border};
  border-radius: 8px;
  font-size: 1.25rem;

  &:hover {
    background-color: ${(props) => props.theme.bgTertiary};
  }
`;

export const ProgressTrack = styled.div`
  width: 100%;
  height: 8px;
  background-color: ${({ theme }) => theme.bgSecondary};
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 1rem;
`;

export const ProgressFill = styled.div`
  height: 100%;
  width: ${({ $percent }) => $percent}%;
  background-color: ${({ theme }) => theme.greenStrong};
  border-radius: 4px;
  transition: width 0.3s ease;
`;

export const StreakBadge = styled.span`
  font-size: 0.875rem;
  color: ${({ theme }) => theme.textSecondary};
  margin-left: auto;
`;

export type question = {
  id: number;
  category: string;
  difficulty: string;
  question: string;
  answers: string[];
  correct_answer: string;
  incorrect_answers: string[];
};

export type questionStats = {
  question: question;
  timeToAnswer: number;
  answeredCorrect: boolean;
  unAnswered: boolean;
};

import { defineStore } from 'pinia';
import type { question, gameStats, lifeLine } from '@/types';

export const gameStore = defineStore('questions', {
  state: () => ({
    loading: false as boolean,
    game: 0 as number,
    questionsToken: undefined as string | undefined,
    questions: [] as question[],
    questionSummary: [] as gameStats[],
    lifeLinesUsed: [] as lifeLine[],
  }),
  getters: {},
  actions: {
    resetQuestionsToken() {
      this.questionsToken = undefined;
      localStorage.removeItem('questionsToken');
    },
    setQuestionToken(token: string) {},
    setQuestions(questions: question[]) {},
    async fetchQuestions(amount?: number) {
      this.loading = true;
      const storedQuestionToken = localStorage.getItem('questionsToken');

      if (storedQuestionToken) {
        this.questionsToken = storedQuestionToken;
      } else {
        const tokenRequest = await fetch(
          'https://opentdb.com/api_token.php?command=request',
        );

        const tokenRequestData = await tokenRequest.json();
        const token = tokenRequestData.token;
        this.questionsToken = token;
        localStorage.setItem('questionsToken', token);
      }

      const questionAmount = amount || 10;
      const uri = `https://opentdb.com/api.php?type=multiple&type=multiple&amount=${questionAmount}&token=${this.questionsToken}`;

      const response = await fetch(uri, { method: 'GET' });
      const data = await response.json();

      const questions = data.results.map((q: any, index: number) => {
        const answers = [...q.incorrect_answers, q.correct_answer];

        //Durstenfeld shuffle
        for (let i = answers.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [answers[i], answers[j]] = [answers[j], answers[i]];
        }

        return {
          id: index,
          answers,
          ...q,
        };
      });

      //Durstenfeld shuffle
      for (let i = questions.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [questions[i], questions[j]] = [questions[j], questions[i]];
      }

      this.questions = questions;
      this.loading = false;
    },
  },
});

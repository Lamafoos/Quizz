<template>
  <h1 class="headline headline--centered">Quiz game!</h1>
  <div class="game">
    <div class="game__header">
      <div class="question-information" v-if="gameState === GameStates.STARTED">
        <p>{{ `Question: ${currentQuestion + 1} / ${questions.length}` }}</p>
        <p>Difficulty: {{ questions[currentQuestion].difficulty }}</p>
        <p>Category: {{ questions[currentQuestion].category }}</p>
        <p>
          <strong>Time left:{{ timer.timeLeft }}</strong>
        </p>
      </div>

      <div class="game-message">
        <p class="game-message__item" v-if="store.loading">Fetching questions...</p>
        <p class="game-message__item" v-if="timer.timeOut">Sorry, You ran out of time</p>
      </div>
    </div>

    <div class="game__content" v-if="gameState === 1 && !timer.timeOut">
      <Question
        :key="questions[currentQuestion].id"
        :item="questions[currentQuestion]"
        @answer="handleAnswer"
      />

      <div class="question-actions">
        <button
          :disabled="questionAnswered"
          class="button button--primary"
          v-for="(lifeline, index) in lifeLines"
          :key="index"
          @click="handleLifelineClick(index)"
        >{{ lifeline.name }}</button>
      </div>
    </div>

    <div class="game__footer">
      <button
        class="button button--primary"
        @click="startGame"
        v-if="!store.loading && gameState === GameStates.WAITING"
      >Start game</button>

      <button
        class="button button--primary"
        :disabled="!questionAnswered"
        @click="nextQuestion"
        v-else-if="gameState === GameStates.STARTED && !lastQuestion"
      >Next Question</button>

      <GameSummary v-show="gameState === GameStates.ENDED" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, watchEffect } from 'vue';
import { storeToRefs } from 'pinia';
import { gameStore } from '@/stores/game';
import Question from '@/components/Question.vue';
import GameSummary from '@/components/GameSummary.vue';
import { Timer } from '@/models/timer';
import type { lifeLine } from '@/types';

enum GameStates {
  'WAITING',
  'STARTED',
  'ENDED',
}

const store = gameStore(); //Store
const timer = reactive(new Timer(15)); //Timer
const { questions } = storeToRefs(store); //Get questions

const currentQuestion = ref<number>(0); //Question index to show
const gameState = ref<GameStates>(0); //Game status
const questionAnswered = ref<boolean>(false); //Question answered
const lastQuestion = ref<boolean>(false); //Last question
const lifeLines = ref<lifeLine[]>([{
  type: 'half',
  name: '50/50',
  used: false
},
{
  type: 'plus10',
  name: '+10 sec',
  used: false
}]);

// Reset store
store.$reset;

//Fetch questions
store.fetchQuestions();

// Start game
const startGame = () => {
  gameState.value = GameStates.STARTED;
  currentQuestion.value = 0;
  timer.start();
};

// Watch if time runs out and if last question
watchEffect(() => {
  if (timer.timeOut) {
    questionAnswered.value = true;

    if (lastQuestion.value) {
      gameState.value = GameStates.ENDED;
    }

    store.$patch((state) => {
      state.questionSummary.push({
        questionStats: {
          question: questions.value[currentQuestion.value],
          timeToAnswer: timer.startToStopTime,
          answeredCorrect: false,
          unAnswered: true
        },
      });
    });
  }

  if (currentQuestion.value + 1 === questions.value.length) {
    lastQuestion.value = true;
  }
});

// Handle answer
const handleAnswer = (isCorrectAnswer: boolean) => {
  timer.stop();
  questionAnswered.value = true;

  if (lastQuestion.value) {
    gameState.value = GameStates.ENDED;
  }

  store.$patch((state) => {
    state.questionSummary.push({
      questionStats: {
        question: questions.value[currentQuestion.value],
        timeToAnswer: timer.startToStopTime,
        answeredCorrect: isCorrectAnswer,
        unAnswered: false
      },
    });
  });
};

// Handle next question
const nextQuestion = () => {
  if (questions.value.length > currentQuestion.value + 1) {
    currentQuestion.value++;
    questionAnswered.value = false;
    timer.start();
  }
};

// Remove two first false answers
const removeTwoFirstFalseAnswers = () => {
  const correctAnswer = questions.value[currentQuestion.value].correct_answer;
  const answers = questions.value[currentQuestion.value].answers;
  let nbrOfAnswers = 0;

  // Loop through answers and remove first two that is wrong.
  for (let i = 0; i < answers.length; i++) {
    if (answers[i] !== correctAnswer) {
      answers.splice(i, 1);
      i--;
      nbrOfAnswers++;
    }

    if (nbrOfAnswers >= 2) {
      return;
    }
  }
}

// Handle lifeline
const handleLifelineClick = (index: number) => {
  const lifeline = lifeLines.value[index];
  lifeLines.value[index].used = true;
  store.lifeLinesUsed.push(lifeline);
  lifeLines.value.splice(index, 1);

  if (lifeline.type === 'plus10') {
    timer.addTime(10);
  }

  if (lifeline.type === 'half') {
    removeTwoFirstFalseAnswers();
  }
};

</script>

<style lang="scss">
@use '@/scss/abstract/typography.scss';

.game-message__item {
  @include typography.heading(4);
  text-align: center;
  margin-bottom: 2rem;
}

.game__footer {
  align-items: center;
  display: flex;
  gap: 1rem;
  justify-content: center;
}

.question-information {
  display: flex;
  gap: 1rem;
  justify-content: end;
  margin-bottom: 1rem;
}

.question-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 0.75rem;
}
</style>

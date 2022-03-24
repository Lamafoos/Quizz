<template>
  <div>
    <button class="button button--primary" @click="open = true">Game summary</button>

    <teleport to="body">
      <div v-if="open" class="site-modal">
        <div class="game-summary">
          <h2 class="game-summary__title">Game summary</h2>
          <div class="game-summary__content">
            <ul class="stats">
              <li class="stats-item">
                Lifelines used:
                <p v-for="line in stats.lifeLinesUsed">{{ line.name }}</p>
              </li>
              <li class="stats-item">
                <p>
                  Number of correct answers:
                  {{ stats.correctAnswers }}
                </p>
              </li>
              <li class="stats-item">
                <p>
                  Number of incorrect answers:
                  {{ stats.inCorrectAnswers }}
                </p>
              </li>
              <li class="stats-item">
                <p>
                  Number of unanswered answers:
                  {{ stats.unanswered }}
                </p>
              </li>
              <li class="stats-item">
                <p>
                  Average time per question:
                  {{ stats.averageTime }}
                </p>
              </li>
              <li class="stats-item">
                <p>
                  Fastest time on question:
                  {{ stats.fastestTime }}
                </p>
              </li>
              <li class="stats-item">
                <p>
                  Slowest time on question:
                  {{ stats.slowestTime }}
                </p>
              </li>
            </ul>
          </div>
          <button @click="open = false">Close Summary</button>
        </div>
      </div>
    </teleport>
  </div>
</template>

<script setup lang="ts">
import { gameStore } from '@/stores/game';
import type { lifeLine } from '@/types';
import { ref, reactive } from 'vue';

type statsOptions = {
  correctAnswers: number,
  inCorrectAnswers: number,
  unanswered: number,
  averageTime: number | string,
  fastestTime: number | string,
  slowestTime: number | string,
  lifeLinesUsed: lifeLine[],
}

const stats = reactive<statsOptions>({
  correctAnswers: 0,
  inCorrectAnswers: 0,
  unanswered: 0,
  averageTime: 0,
  fastestTime: 0,
  slowestTime: 0,
  lifeLinesUsed: [],
});

const store = gameStore(); //Store
const open = ref(false); // Modal open


// Stats
store.$subscribe((mutation, state) => {
  stats.correctAnswers = store.questionSummary.filter(question => question.questionStats.answeredCorrect).length;
  stats.inCorrectAnswers = store.questionSummary.filter(question => question.questionStats.answeredCorrect !== true).length;
  stats.unanswered = store.questionSummary.filter((question) => question.questionStats.unAnswered).length;
  stats.lifeLinesUsed = store.lifeLinesUsed;

  stats.averageTime = (store.questionSummary.reduce((acc, question) => acc + question.questionStats.timeToAnswer, 0) / store.questionSummary.length).toFixed(2);
  stats.fastestTime = store.questionSummary.reduce((acc, question) => acc < question.questionStats.timeToAnswer ? acc : question.questionStats.timeToAnswer, 1000).toFixed(2);
  stats.slowestTime = store.questionSummary.reduce((acc, question) => acc > question.questionStats.timeToAnswer ? acc : question.questionStats.timeToAnswer, 0).toFixed(2);
});

</script>

<style lang="scss">
.game-summary {
  padding: 2rem;
  background-color: #f5f5f5;
  border-radius: 8px;
}
</style>
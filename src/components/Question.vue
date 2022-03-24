<template>
  <div class="question">
    <div class="question__header">
      <p class="question__title" v-if="!answered" v-html="item.question"></p>
      <p class="question__message" v-if="answered">{{ message }}</p>
    </div>

    <div class="question__content">
      <button
        @click.prevent="handleAnswerClick"
        class="answer"
        v-for="answer in item.answers"
        :value="answer"
        :key="answer"
        v-html="answer"
      ></button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import type { question } from '@/types';

const props = defineProps<{
  item: question,
}>();

const emit = defineEmits<{
  (e: 'answer', answer: boolean): void,
}>();

const { correct_answer: correctAnwer } = props.item;
const message = ref('');
const answered = ref(false);

const handleAnswer = (isCorrect: boolean) => {
  message.value = isCorrect ? 'Correct! Good job!' : "Wrong answer I'm afraid!";
  answered.value = true;

  const answers = document.querySelectorAll<HTMLButtonElement>('.answer');

  for (const item of answers) {
    if (item.value === correctAnwer) {
      item.classList.add('answer--correct');
    } else {
      item.classList.add('answer--incorrect');
    }
    item.setAttribute('disabled', 'true');
  }

  emit('answer', isCorrect);
};

const handleAnswerClick = (event: Event) => {
  if (event.target instanceof HTMLButtonElement) {
    const isCorrect = event.target.value === correctAnwer ? true : false;
    handleAnswer(isCorrect);
  }
};

</script>

<style lang="scss">
.question {
  background-color: #f5f5f5;
  box-shadow: 0 4px 10px 8px #e0e0e0;
  border: 1px solid #000;
  border-radius: 6px;
  padding: 1.25rem 1rem;
}

.question__title,
.question__message {
  font-size: 1.5rem;
  line-height: 1.25;
  text-align: center;
}

.question__content {
  margin-top: 1rem;
  display: grid;
  grid: auto / repeat(2, 1fr);
  gap: 0.75rem;
}

.answer {
  cursor: pointer;
  width: 100%;
  padding: 1.25rem 1.7rem;
  background-color: #fff;
  border: 1px solid black;
  border-radius: 4px;
  font-size: 1.125rem;

  &--correct {
    background-color: #00ff00;
    border-color: #00ff00;
  }

  &--incorrect {
    background-color: #ff0000;
    border-color: #ff0000;
  }

  &:disabled {
    opacity: 0.8;
    color: #000;
  }
}
</style>
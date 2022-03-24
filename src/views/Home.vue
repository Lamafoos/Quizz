<style lang="scss">
@use '@/scss/variables/color.scss';

.page__content {
  display: flex;
  flex-direction: column;
  gap: 0.875rem;
  align-items: center;
  justify-content: center;
}

.start-game {
  padding: 1rem 2rem;
  background-color: color.$green-100;
}
</style>

<script setup lang="ts">
</script>

<template>
  <div class="page">
    <h1 class="headline headline--centered">Quizz</h1>
    <div class="page__content">
      <div class="legible legible--centered">
        <p>This is a simple quiz game with questions from the open trivia database. Don't feel bad about the difficulty as easy questions maybe really hard or off topic for you.</p>
        <p>You'll have to be fast as you only have 15 seconds on each question</p>
        <p>There are 2 Lifelines</p>
        <p>+15sec - Adds 15 sec to the timer</p>
        <p>50/50 - Removes to of the false answers</p>
      </div>
      <router-link class="button button--primary" :to="{ name: 'game' }">Start game</router-link>
    </div>
  </div>
</template>

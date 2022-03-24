<script setup lang="ts">
</script>

<template>
  <header class="site-header">
    <nav class="site-navigation" aria-label="site">
      <router-link class="site-navigation__link" :to="{ name: 'home' }">Home</router-link>
    </nav>
  </header>
  <main class="site-content">
    <router-view></router-view>
  </main>
</template>

<style lang="scss">
@use '@/scss/main.scss';

.site-header {
  display: flex;
  justify-content: center;
  gap: 1rem;
  padding: 0.5rem 1rem;
  border-bottom: 1px solid #ccc;
}
</style>

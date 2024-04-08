<script setup lang="ts">
import Carousel from '../components/Carousel.vue';

</script>

<template>
  <section class="content">
    <Carousel />
  </section>
</template>

<style scoped>
.content {
  height: inherit;
  width: inherit;

  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 1rem;
}
</style>
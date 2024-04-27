<script setup lang="ts">
import MapRaffle from '@/components/MapRaffle.vue';
// import Wheel from '../components/Wheel.vue';

</script>

<template>
  <section class="content">
    <MapRaffle />
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
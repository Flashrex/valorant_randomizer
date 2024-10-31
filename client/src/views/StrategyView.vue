<script setup lang="ts">
import StrategyCard from '@/components/StrategyCard.vue';
import { computed, onMounted, ref } from 'vue';
import axios from 'axios';
import type { Agent } from '@/types/agent';
import type { Map } from '@/types/map';

const isLoading = computed(() => false);

const agents = ref<Agent[]>([]);
const maps = ref<Map[]>([]);

async function fetchAgents() {
  await axios.get('https://valorant-api.com/v1/agents/', {
    params: {
      isPlayableCharacter: true
    }
  })
    .then((response) => {
      agents.value = response.data.data;
    })
    .catch((error) => {
      console.error(error);
    });
}

async function fetchMaps() {
  await axios.get('https://valorant-api.com/v1/maps/', {
    params: {}
  })
    .then((response) => {
      maps.value = response.data.data;
    })
    .catch((error) => {
      console.error(error);
    });
}

const randomAgent = computed(() => {
  return agents.value[Math.floor(Math.random() * agents.value.length)];
});

const randomMap = computed(() => {
  return maps.value[Math.floor(Math.random() * maps.value.length)];
});

onMounted(async () => {
  await fetchAgents();
  await fetchMaps();

  console.log(agents.value);
  console.log(maps.value);
});
</script>

<template>
  <div class="content">
    <div class="flex-column">
      <ProgressSpinner v-if="isLoading" />
      <div class="flex-column" v-else>
        <StrategyCard :icon="randomAgent?.displayIcon" :background="randomMap?.splash" card-name="Test"
          card-description="Lorem Ipsum dolor asd sad as ddas asd dsadasd sa ." />
        <div class="interactions">
          <span class="icon"><img src="../assets/icons/thumb_up.svg" alt="thumb_up_icon"></span>
          <span class="icon"><img src="../assets/icons/refresh.svg" alt="refresh_icon"></span>
          <span class="icon"><img src="../assets/icons/thumb_down.svg" alt="thumb_down_icon"></span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.content {
  width: 100%;
  height: inherit;

  display: flex;
  justify-content: center;
  align-items: center;
  margin: 1rem;
  user-select: none;
}

.interactions {
  display: flex;
  gap: 1rem;
}

.icon {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 3rem;
  aspect-ratio: 1/1;
  background: var(--color-background-soft);
  border-radius: 50%;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s;
}

.icon img {
  width: 2rem;
  aspect-ratio: 1/1;
}

.icon:hover {
  cursor: pointer;
  transform: scale(1.1);
}
</style>
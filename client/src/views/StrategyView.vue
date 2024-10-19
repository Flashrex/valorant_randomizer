<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import Carousel from '../components/agents/Carousel.vue';
import Selector from '../components/agents/Selector.vue';
import type { Agent } from '../types/agent';
import axios from 'axios';

import selectedImageSrc from '@/assets/icons/selected.png';
import notSelectedImageSrc from '@/assets/icons/not_selected.png';

const API_URL = 'https://valorant-api.com/v1';

const carousel = ref();
const selectedImage = ref(new Image());
const notSelectedImage = ref(new Image());

onMounted(async () => {
  selectedImage.value.src = selectedImageSrc
  notSelectedImage.value.src = notSelectedImageSrc;

  await AgentAPI.initialize();
});

const AgentAPI = {

  agents: ref([] as Agent[]),
  skipAnimation: ref(false),
  isRolling: ref(false),
  errors: ref<string[]>([]),

  async initialize() {
    const cachedAgents = localStorage.getItem('agents');

    if (cachedAgents) {
      const filtered = JSON.parse(cachedAgents).filter((agent: Agent) => agent.isPlayableCharacter);
      AgentAPI.agents.value = filtered.map((agent: Agent) => ({ ...agent, selected: true }));
      return;
    }

    await AgentAPI.fetchAgents();
  },

  async fetchAgents() {
    await axios.get(`${API_URL}/agents`)
      .then((response) => {
        const filtered = response.data.data.filter((agent: Agent) => agent.isPlayableCharacter);
        AgentAPI.agents.value = filtered.map((agent: Agent) => ({ ...agent, selected: true }));

        localStorage.setItem('agents', JSON.stringify(AgentAPI.agents.value));
      })
      .catch((error) => {
        console.error(error);
      });
  },

  toggleAnimation() {
    AgentAPI.skipAnimation.value = !AgentAPI.skipAnimation.value;
  },

  rollAgent() {
    if (AgentAPI.isRolling.value) return;

    AgentAPI.isRolling.value = true;

    if (AgentAPI.agents.value.filter(agent => agent.selected).length === 0) {
      AgentAPI.errors.value = ['No agents selected'];
      return;
    }

    carousel.value.roll();
  },

  selectAgent(agentId: string) {
    const agent = AgentAPI.agents.value.find((agent: Agent) => agent.uuid === agentId);

    if (agent) {
      agent.selected = !agent.selected;
    }
  },

  onFinishRoll(agentId: string) {
    AgentAPI.isRolling.value = false;
  }
}

const cards = computed(() => {
  return AgentAPI.agents.value
    .filter((agent: Agent) => agent.selected)
    .map((agent: Agent) => ({
      id: agent.uuid,
      title: agent.displayName,
      subtitle: agent.role.displayName,
      image: agent.fullPortrait,
      backgroundImage: agent.background,
      icon: agent.role.displayIcon,
      selected: agent.selected ?? false
    }));
});

const selectorItems = computed(() => {
  return AgentAPI.agents.value.map((agent: Agent) => ({
    id: agent.uuid,
    group: agent.role.displayName,
    icon: agent.displayIcon,
    selected: agent.selected ?? false
  }));
});

</script>

<template>
  <div class="content">
    <div v-if="cards" class="agent-selector-container">
      <Carousel ref="carousel" :cards="cards" :duration="5000" :speed="10" :skipAnimation="AgentAPI.skipAnimation.value"
        @finishedRoll="AgentAPI.onFinishRoll">
      </Carousel>

      <div class="flex-column">
        <button @click="carousel.roll()">Roll</button>
        <div class="flex">
          <label>Skip Animation</label>
          <img v-if="AgentAPI.skipAnimation.value" class="sel-icon" :src="selectedImage.src" alt="selected"
            @click="AgentAPI.toggleAnimation()">
          <img v-else class="sel-icon" :src="notSelectedImage.src" alt="not_selected"
            @click="AgentAPI.toggleAnimation()">
        </div>
      </div>

      <Selector :items="selectorItems" @select="AgentAPI.selectAgent" :locked="AgentAPI.isRolling.value"></Selector>
    </div>

    <template v-else>
      <ProgressSpinner></ProgressSpinner>
    </template>
  </div>
</template>

<style scoped>
.content {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  gap: 2rem;
  user-select: none;
}

.agent-selector-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 1rem;
}

.sel-icon {
  width: 1.5rem;
  height: 1.5rem;
  cursor: pointer;
}
</style>
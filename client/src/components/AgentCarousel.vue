<script setup lang="ts">
import axios from 'axios';
import type { Agent } from '../types/agent';
import { computed, onMounted, ref, type ComputedRef } from 'vue';

import selectedImageSrc from '@/assets/icons/selected.png';
import notSelectedImageSrc from '@/assets/icons/not_selected.png';
import Errors from './Errors.vue';

const agents = ref([] as Agent[]);
const currentAgent = ref(null as Agent | null);

interface GroupedAgents {
  [key: string]: Agent[];
}

const noAnimation = ref(false);
const selectedImage = ref(new Image());
const notSelectedImage = ref(new Image());

const errors = ref<string[]>([]);

onMounted(async () => {
  selectedImage.value.src = selectedImageSrc
  notSelectedImage.value.src = notSelectedImageSrc;

  await loadAgents();
});

async function loadAgents() {
  const cachedAgents = localStorage.getItem('agents');

  if (cachedAgents) {
    const filtered = JSON.parse(cachedAgents).filter((agent: Agent) => agent.isPlayableCharacter);
    agents.value = filtered.map((agent: Agent) => ({ ...agent, selected: true }));

    currentAgent.value = agents.value[0];
    return;
  }

  agents.value.forEach((agent) => {
    const img = new Image();
    img.src = agent.fullPortrait;
    const bg = new Image();
    bg.src = agent.background;
  });

  await requestAgentsFromServer();
}

let isRolling = false;

function rollAgents(duration: number = 5000, speed: number = 10) {
  if (isRolling) return;

  if (agents.value.filter(agent => agent.selected).length === 0) {
    errors.value = ['No agents selected'];
    return;
  }

  errors.value = [];

  const filteredAgents = agents.value.filter(agent => agent.selected);

  // Don't roll just select random agent
  if (noAnimation.value) {
    const randomIndex = Math.floor(Math.random() * filteredAgents.length);
    currentAgent.value = filteredAgents[randomIndex];
    return;
  }

  const decreaseRate = 5;
  let interval: NodeJS.Timeout | undefined;


  const startInterval = () => {
    interval = setInterval(() => {
      isRolling = true;
      const randomIndex = Math.floor(Math.random() * filteredAgents.length);
      currentAgent.value = filteredAgents[randomIndex];

      // Decrease speed
      speed += decreaseRate;

      // Clear interval
      clearInterval(interval);

      // Start new interval with decreased speed
      if (speed <= 1000) { // Maximum speed
        startInterval();
      }
    }, speed);
  };

  // Start the interval
  startInterval();
  setTimeout(() => {
    isRolling = false;
    clearInterval(interval);
  }, duration);
};

async function requestAgentsFromServer() {
  await axios.get('https://valorant-api.com/v1/agents')
    .then((response) => {
      const filtered = response.data.data.filter((agent: Agent) => agent.isPlayableCharacter);
      agents.value = filtered.map((agent: Agent) => ({ ...agent, selected: true }));

      localStorage.setItem('agents', JSON.stringify(agents.value));
      currentAgent.value = agents.value[0];
    })
    .catch((error) => {
      console.error(error);
    });
}

function agentSelect(agent: Agent) {
  if (isRolling) return;
  agent.selected = !agent.selected;
  console.log(agent);
}

function selectAllAgents(select = true) {
  if (isRolling) return;
  agents.value.forEach(agent => agent.selected = select);
}

function selectGroup(roleName: string) {
  if (isRolling) return;
  agents.value.forEach(agent => agent.selected = agent.role.displayName === roleName);
}


const groupedAgents: ComputedRef<GroupedAgents> = computed(() => {
  return agents.value.reduce((groups: GroupedAgents, agent: Agent) => {
    const key = agent.role.displayName;
    if (!groups[key]) {
      groups[key] = [];
    }
    groups[key].push(agent);
    return groups;
  }, {} as GroupedAgents);
});
</script>

<template>
  <div class="carousel-container">
    <div class="agent-container">
      <div v-if="currentAgent" class="carousel-item">
        <span class="img-container">
          <img class="agent-bg" :src="currentAgent.background" :alt="currentAgent.displayName">
          <img class="agent-portrait" :src="currentAgent.fullPortrait" :alt="currentAgent.displayName">
        </span>

        <h2>{{ currentAgent.displayName }}</h2>
        <div class="role-container">
          <img :src="currentAgent.role?.displayIcon" :alt="currentAgent.role?.displayName">
          <p>{{ currentAgent.role?.displayName }}</p>
        </div>
      </div>

      <Errors v-if="errors" :errors="errors" />

      <button @click="rollAgents()">Randomize</button>
      <div class="flex">
        <label>Skip Animation</label>
        <img v-if="noAnimation" class="sel-icon" :src="selectedImage.src" alt="selected"
          @click="noAnimation = !noAnimation">
        <img v-else class="sel-icon" :src="notSelectedImage.src" alt="not_selected" @click="noAnimation = !noAnimation">
      </div>
    </div>



    <div class="flex-column">
      <div v-for="(group, roleName) in groupedAgents" :key="roleName" class="settings-container">
        <div class="flex">
          <h3>{{ roleName }}</h3>
          <div class="flex">
            <button @click="selectGroup(roleName.toString())">Select Group</button>
          </div>
        </div>
        <div class="flex-wrap">
          <div v-for="agent in group" :key="agent.uuid" class="agent-item">
            <img class="agent-icon" :class="{ selected: agent.selected }" :src="agent.displayIcon"
              :alt="agent.displayName" @click="agentSelect(agent)">
            <span class="tooltip">{{ agent.selected ? "Click to disable" : "Click to enable" }}</span>
          </div>
        </div>
      </div>

      <div class="flex">
        <button @click="selectAllAgents()">Select All</button>
        <button @click="selectAllAgents(false)">Deselect All</button>
      </div>
    </div>

  </div>
</template>

<style scoped>
.carousel-container {
  margin: 1rem;
  position: relative;

  gap: 0.5rem;
  padding: 0.5rem;

  overflow: hidden;

  display: flex;
  align-items: center;
}

.carousel-item {
  margin-top: 1rem;
  display: flex;
  flex-direction: column;
  justify-content: left;
  align-items: left;
}

.img-container {
  position: relative;
  background-color: transparent;
}

.agent-portrait {
  position: relative;
  height: 20vw;
  opacity: 1;
  z-index: 2;
}

.agent-bg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0.25;
  object-fit: cover;
  z-index: 1;
  filter: invert(100%);
}

@media (prefers-color-scheme: dark) {
  .agent-bg {
    filter: invert(0%);
  }
}

h2 {
  text-align: center;
  font-size: 1.5rem;
  color: var(--color-text);
  margin-top: 1rem;
}

.group {
  display: flex;
  flex-direction: column;
  align-items: start;
}

.role-container {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.role-container>p {
  color: var(--color-text);
  font-size: 1rem;
}

.role-container>img {
  width: 1rem;
  height: 1rem;
  filter: invert(100%);
}

@media (prefers-color-scheme: dark) {
  .role-container>img {
    filter: invert(0%);
  }
}

button {
  width: 60%;
}

.settings-container {
  display: flex;
  justify-content: center;
  align-items: start;
  flex-direction: column;
  gap: 0.5rem;
}

.flex>button {
  text-wrap: nowrap;
  width: auto;
  font-weight: 400;
  font-size: 0.8rem;
  padding: 0.25rem 0.5rem;
}

label {
  color: var(--color-text);
  text-align: center;
  font-size: 1rem;
}

.agent-container {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  gap: 0.2rem;
  margin-top: 1rem;
  background-color: var(--color-background-soft);
  border-radius: 5px;
  margin: 1rem;
  padding: 1rem;
}

.agent-icon {
  width: 50px;
  aspect-ratio: 1/1;
  cursor: pointer;
  filter: grayscale(100%);
}

.agent-icon.selected {
  filter: grayscale(0%);
}

.flex-column {
  gap: 1rem;
}

.agent-item {
  position: relative;
}

.tooltip {
  visibility: hidden;
  width: 120px;
  background-color: rgba(0, 0, 0, 0.366);
  color: #fff;
  text-align: center;
  padding: 5px 0;
  border-radius: 6px;
  position: absolute;
  z-index: 1;
  bottom: 100%;
  left: 50%;
  margin-left: -60px;
  opacity: 0;
  transition: opacity 0.3s;
  margin-bottom: 0.2rem;
}

.agent-item:hover .tooltip {
  visibility: visible;
  opacity: 1;
}

@media (max-width: 1024px) {
  .carousel-container {
    width: 100%;
  }

  .agent-portrait {
    height: 200px;
  }

  .agent-icon {
    width: 25px;
  }

  .carousel-container {
    flex-direction: column;
  }
}
</style>
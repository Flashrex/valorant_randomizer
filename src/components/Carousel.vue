<script setup lang="ts">
import axios from 'axios';
import type { Agent } from '../types/agent';
import { computed, onMounted, ref, type ComputedRef } from 'vue';

 

const agents = ref([] as Agent[]);
const currentAgent = ref(null as Agent | null);
const noAnimation = ref(false);

interface GroupedAgents {
  [key: string]: Agent[];
}

onMounted(async () => {
    const cachedAgents = localStorage.getItem('agents');

    if(cachedAgents) {
        const filtered = JSON.parse(cachedAgents).filter((agent: Agent) => agent.isPlayableCharacter);
        agents.value = filtered.map((agent: Agent) => ({ ...agent, selected: true }));

        currentAgent.value = agents.value[0];
        return;
    }

    await axios.get('https://valorant-api.com/v1/agents')
        .then(response => {
            const filtered = response.data.data.filter((agent: Agent) => agent.isPlayableCharacter);

            agents.value = filtered.map((agent: Agent) => ({ ...agent, selected: true }));
            currentAgent.value = agents.value[0];
            localStorage.setItem('agents', JSON.stringify(agents.value));
        }).catch(error => {
            console.error(error);
        });
});

let isRolling = false;

function rollAgents(duration: number = 5000, speed: number = 10) {
    if(isRolling) return;  
  
    if(noAnimation.value) {
        currentAgent.value = agents.value[Math.floor(Math.random() * agents.value.length)];
        return;
    }
  
    const decreaseRate = 5;
    let interval : number | undefined;

    const filteredAgents = agents.value.filter(agent => agent.selected);

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
}

function agentSelect(agent: Agent) {
    agent.selected = !agent.selected;
    console.log(agent);
}

function selectAllAgents(select = true) {
    agents.value.forEach(agent => agent.selected = select);
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
    

      <button @click="rollAgents()">Randomize</button>

      <div class="settings-container">
        <div class="flex">
          <label>Skip Animation</label>
          <img v-if="noAnimation" class="sel-icon" src="@/assets/icons/selected.png" alt="selected" @click="noAnimation = !noAnimation">
          <img v-else class="sel-icon" src="@/assets/icons/not_selected.png" alt="not_selected" @click="noAnimation = !noAnimation">
        </div>

        <div class="flex">
          <button @click="selectAllAgents()">Select All</button>
          <button @click="selectAllAgents(false)">Deselect All</button>
        </div>
      </div>

      <div class="agent-container">
        <div v-for="(group, roleName) in groupedAgents" :key="roleName">
          <div class="flex-wrap">
            <div v-for="agent in group" :key="agent.uuid" class="agent-item">
              <img class="agent-icon" :class="{ selected: agent.selected }" :src="agent.displayIcon" :alt="agent.displayName" @click="agentSelect(agent)">
              <span class="tooltip">Click to disable</span>
            </div>
          </div>
        </div>
      </div>
    </div>
</template>

<style scoped>
.carousel-container {
    width: 90%;
    background-color: var(--color-background-soft);
    position: relative;
    border-radius: 5px;
    
    gap: 0.5rem;
    padding: 0.5rem;

    overflow-x: hidden;

    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}

.carousel-item {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    overflow: hidden;
}

.img-container {
    position: relative;
    background-color: transparent;
}

.agent-portrait {
    position: relative;
    height: 200px;
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
}

h2 {
    text-align: center;
    font-size: 1.5rem;
    color: var(--color-text);
    margin-top: 1rem;
}

.role-container {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
}

.role-container > p {
    color: var(--color-text);
    font-size: 1rem;
}

.role-container > img {
    width: 1rem;
    height: 1rem;
}

button {
  width: 60%;
}

.settings-container {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    gap: 0.5rem;
}

.flex > button {
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

.sel-icon {
    width: 1.5rem;
    height: 1.5rem;
    cursor: pointer;
}

.agent-container {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    gap: 0.2rem;
    margin-top: 1rem;
}

.agent-icon {
  width: 25px;
  aspect-ratio: 1/1;
  cursor: pointer;
  filter: grayscale(100%);
}

.agent-icon.selected {
  filter: grayscale(0%);
}

.flex {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.flex-wrap {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    align-items: center;
    gap: 0.5rem;
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

@media (min-width: 1024px) {
    .agent-portrait {
      height: 40vh;
    }

    .agent-icon {
      width: 50px;
    }

    button {
      width: 20%;
    }
}
</style>
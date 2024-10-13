<script setup lang="ts">
import { RouterView, useRoute } from 'vue-router'
import Sidebar from './components/Sidebar.vue';
import { ref, watch } from 'vue';

const selection = ref('');

const route = useRoute();

watch(route, () => {
  selection.value = route.name as string;
})

</script>

<template>
  <Sidebar :selected="selection" />
  <main>
    <router-view v-slot="{ Component }">
      <transition name="fade" mode="out-in">
        <keep-alive>
          <component :is="Component" />
        </keep-alive>
      </transition>
    </router-view>


    <div class="footer">
      <p class="disclaimer">This is a fan made project and in no way associated with Valorant or Riot Games.</p>
      <p class="disclaimer">Created with ♥ by Flashrex</p>
    </div>
  </main>
</template>

<style scoped>
.footer {
  position: fixed;
  bottom: 0;
  height: 10vh;
  width: 85vw;
  color: white;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.disclaimer {
  text-align: center;
  font-size: 0.8rem;
  width: 80vw;
  color: var(--color-text);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.25s;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>

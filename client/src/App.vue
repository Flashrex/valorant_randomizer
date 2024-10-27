<script setup lang="ts">
import { RouterView, useRoute } from 'vue-router'
import Sidebar from './components/Sidebar.vue';
import { ref, watch } from 'vue';
import Language from './components/Language.vue';

const selection = ref('');

const route = useRoute();

watch(route, () => {
  selection.value = route.name as string;
})

</script>

<template>
  <Sidebar :selected="selection" />
  <main>
    <Language></Language>

    <router-view v-slot="{ Component }">
      <transition name="fade" mode="out-in">
        <component :is="Component" />
      </transition>
    </router-view>


    <div v-if="route.name !== 'about'" class="footer">
      <p class="disclaimer">{{ $t('This is a fan made project and in no way associated with Valorant or Riot Games.') }}
      </p>
      <p class="disclaimer">{{ $t('Created with ♥ by') }} <a class="link" href="https://github.com/Flashrex/"
          target="_blank" rel="noopener noreferrer">Flashrex</a> {{ $t('And') }} <a class="link"
          href="https://github.com/zlyfer/" target="_blank" rel="noopener noreferrer">zlyfer</a></p>
    </div>
  </main>
</template>

<style scoped>
main {
  max-height: 100vh;
  overflow-y: auto;
}

.footer {
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

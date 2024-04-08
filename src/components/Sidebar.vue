<script setup lang="ts">
import { ref } from 'vue';


const props = defineProps({
    selected: String
});

function isSelected(page: string) {
    return props.selected === page;
}
</script>

<template>
    <div class="sidebar">
        <div class="logo-container">
            <img class="logo" src="../assets/valorant_logo.svg" alt="logo">
        </div>

        <nav>
            <ul>
                <li>
                    <router-link to="/agent">
                        <div class="link-container" :class="{ selected: isSelected('agent') }">
                            <img class="icon" src="../assets/icons/agent.svg" alt="agent_icon">
                            <span class="icon-text">Agents</span>
                        </div>
                        
                    </router-link>
                </li>
                <li>
                    <router-link to="/map">
                        <div class="link-container" :class="{ selected: isSelected('map') }">
                            <img class="icon" src="../assets/icons/map.svg" alt="map_icon">
                            <span class="icon-text">Maps</span>
                        </div>
                    </router-link>
                </li>
                <li>
                    <router-link to="/strategy">
                        <div class="link-container" :class="{ selected: isSelected('strategy') }">
                            <img class="icon" src="../assets/icons/strategy.svg" alt="strategy_icon">
                            <span class="icon-text">Strategies</span>
                        </div>
                    </router-link>
                </li>
                <li>
                    <router-link to="/settings">
                        <div class="link-container" :class="{ selected: isSelected('settings') }">
                            <img class="icon" src="../assets/icons/settings.svg" alt="settings_icon">
                            <span class="icon-text">Settings</span>
                        </div>
                    </router-link>
                </li>
                <li>
                    <router-link to="/about">
                        <div class="link-container" :class="{ selected: isSelected('about') }">
                            <img class="icon" src="../assets/icons/about.svg" alt="home_icon">
                            <span class="icon-text">About</span>
                        </div>
                    </router-link>
                </li>
            </ul>
        </nav>
    </div>
</template>

<style scoped>
* {
    --icon-size: 30px;
}

.sidebar {
    width: 15vw;
    height: 100vh;
    background: var(--color-background-soft);
    opacity: 0.8;
    overflow: hidden;

    gap: 2rem;
    display: flex;
    flex-direction: column;
    align-items: center;
}

.logo-container {
    margin-top: 2rem;
}

.logo {
    width: var(--icon-size);
    aspect-ratio: 1/1;
}

nav {
    margin: 1rem;
}

ul {
    list-style: none;
    padding: 0;
    display: flex;
    flex-direction: column;
    gap: 1rem;
}

.link-container {
    display: flex;
    align-items: center;
    gap: 0.5rem;
}

.link-container:hover {
    cursor: pointer;
    filter: brightness(0) saturate(100%) invert(46%) sepia(36%) saturate(5351%) hue-rotate(326deg) brightness(96%) contrast(108%);
    color: var(--color-highlight);
}

.icon {
    width: var(--icon-size);
    aspect-ratio: 1/1;
    filter: invert(100%);
}

.icon-text {
    display: none;
}

.selected > img {
    filter: brightness(0) saturate(100%) invert(46%) sepia(36%) saturate(5351%) hue-rotate(326deg) brightness(96%) contrast(108%);
}

.selected > span {
    color: var(--color-highlight);
}

@media (min-width: 1024px) {
    .logo {
        width: calc(var(--icon-size) * 3);
    }

    .sidebar {
        width: 15vw;
    }

    .icon {
        width: calc(var(--icon-size) * 1.2);
    }

    .icon-text {
        font-size: 1.2rem;
        display: inline;
    }

    ul {
        gap: 2rem;
    }

    .link-container {
        gap: 1rem;
    }
}
</style>
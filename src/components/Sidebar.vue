<script setup lang="ts">

const props = defineProps({
    selected: {
        type: String,
        default: ''
    }
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
                    <router-link to="/" :class="{ selected: isSelected('home') }">
                        <img class="icon" src="../assets/icons/home.svg" alt="home_icon">
                        <span class="icon-text">Home</span>
                    </router-link>
                </li>
                <li>
                    <router-link to="/agent" :class="{ selected: isSelected('agent') }">
                        <img class="icon" src="../assets/icons/agent.svg" alt="agent_icon">
                        <span class="icon-text">Agent</span>
                    </router-link>
                </li>
                <li>
                    <router-link to="/map" :class="{ selected: isSelected('map') }">
                        <img class="icon" src="../assets/icons/map.svg" alt="map_icon">
                        <span class="icon-text">Map</span>
                    </router-link>
                </li>
                <li>
                    <router-link to="/strategy" :class="{ selected: isSelected('strategy') }">
                        <img class="icon" src="../assets/icons/strategy.svg" alt="strategy_icon">
                        <span class="icon-text">Strategy</span>
                    </router-link>
                </li>
                <li>
                    <router-link to="/settings" :class="{ selected: isSelected('settings') }">
                        <img class="icon" src="../assets/icons/settings.svg" alt="settings_icon">
                        <span class="icon-text">Settings</span>
                    </router-link>
                </li>
                <li>
                    <router-link to="/about" :class="{ selected: isSelected('about') }">
                        <img class="icon" src="../assets/icons/about.svg" alt="home_icon">
                        <span class="icon-text">Avout</span>
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
    
    border-top-right-radius: 25px;
    border-bottom-right-radius: 25px;
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
    .sidebar {
        width: 15vw;
    }

    .icon-text {
        display: inline;
    }
}
</style>
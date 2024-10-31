<script setup lang="ts">
import { computed } from 'vue';


const props = defineProps<{
    icon: string;
    background: string;
    cardName: string;
    cardDescription: string;
}>();

const bgStyle = computed(() => {
    return {
        backgroundImage: `url(${props.background})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        filter: 'blur(15px)'
    };
});

</script>

<template>
    <div class="card" :style="bgStyle">
        <div class="icon"><img :src="props.icon" alt="agent_icon"></div>
        <div class="card-content">
            <div class="content">
                <h3 class="headline">{{ props.cardName }}</h3>
                <p class="description">{{ props.cardDescription }}</p>
            </div>
        </div>
    </div>
</template>

<style scoped>
.card {
    position: relative;
    width: 30vw;
    min-height: 40vh;

    border-radius: 15px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    margin: 1rem;
    padding: 1rem;
    user-select: none;
    overflow: hidden;
}

.card::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    border-radius: 15px;
}

.card::before {
    content: '';
    position: absolute;
    top: 55%;
    left: 0;
    width: 105%;
    height: 100%;
    border-radius: 50px;
    background: linear-gradient(45deg, var(--color-highlight), var(--color-highlight-variant));
    z-index: 1;
    transform: rotate(-10deg);
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
}

.card-content {
    width: 100%;
    height: 100%;
    z-index: 2;
    display: flex;
    flex-direction: column;
}

.icon {
    position: absolute;
    width: 6rem;
    height: 6rem;
    bottom: 25%;
    left: 10%;
    background-color: var(--color-background-soft);
    border-radius: 15px;
    z-index: 2;
    box-shadow: 0 0 25px rgba(0, 0, 0, 0.5);
    overflow: hidden;
}

.icon img {
    width: 100%;
    height: 100%;
}

.headline {
    font-family: 'ValorantFont', sans-serif;
}
</style>
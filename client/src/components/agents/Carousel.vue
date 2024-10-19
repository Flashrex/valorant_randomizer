<script setup lang="ts">
import { computed, onMounted, ref, type Ref } from 'vue';
import type { CarouselCard } from '../../types/carouselcard';

const currentCardIndex = ref<number>(0);

const props = defineProps<{
    cards: CarouselCard[];
    duration: number;
    speed: number;
    skipAnimation: boolean;
}>();

const emit = defineEmits(['finishedRoll']);

const currentCard: Ref<CarouselCard | undefined> = computed(() => {
    return props.cards[currentCardIndex.value];
});

const caruselAPI = {
    isRolling: ref(false),
    errors: ref<string[]>([]),

    async roll() {
        if (caruselAPI.isRolling.value) return;

        if (props.cards.filter(card => card.selected).length === 0) {
            caruselAPI.errors.value = ['No cards selected'];
            return;
        }

        if (props.skipAnimation) {
            currentCardIndex.value = Math.floor(Math.random() * props.cards.length);
            return;
        }

        const decreaseRate = 5;
        const duration = props.duration;
        let speed = props.speed;

        caruselAPI.errors.value = [];

        let interval: NodeJS.Timeout | undefined;
        const startInterval = () => {
            interval = setInterval(() => {
                caruselAPI.isRolling.value = true;
                currentCardIndex.value = Math.floor(Math.random() * props.cards.length);

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

        startInterval();
        setTimeout(() => {
            clearInterval(interval);
            caruselAPI.isRolling.value = false;
        }, duration);
    }
}

defineExpose({
    roll: caruselAPI.roll
});
</script>

<template>
    <div class="carousel" v-if="currentCard">
        <div class="card">
            <img class="card-bg" :src="currentCard.backgroundImage" :alt="currentCard.title">
            <img class="card-image" :src="currentCard.image" :alt="currentCard.title">
        </div>

        <div class="card-body">
            <h2>{{ currentCard.title }}</h2>
            <div class="card-subtitle">
                <img :src="currentCard.icon" :alt="currentCard.title">
                <p>{{ currentCard.subtitle }}</p>
            </div>
        </div>
    </div>

    <template v-else>
        <ProgressSpinner />
    </template>
</template>

<style scoped>
.carousel {
    margin: 1rem;
    width: 100%;
    background-color: var(--color-background-soft);
    position: relative;
    border-radius: 5px;

    gap: 0.5rem;
    padding: 0.5rem;

    overflow: hidden;

    display: flex;
    flex-direction: column;
    align-items: center;
}

.card {
    position: relative;
    background-color: transparent;
}

.card-image {
    position: relative;
    height: 200px;
    opacity: 1;
    z-index: 2;
}

.card-bg {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    opacity: 0.25;
    object-fit: cover;
    z-index: 1;
}

.card-body {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}

.card-subtitle {
    display: flex;
    gap: 0.5rem;
    align-items: center;
}

.card-subtitle img {
    width: 1rem;
    height: 1rem;
}
</style>
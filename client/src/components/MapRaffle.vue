<script setup lang="ts">
import { nextTick, onMounted, ref, watch } from 'vue';
import type { Map } from '@/types/map';
import axios from 'axios';
import Errors from './Errors.vue';
import { v4 as uuidv4 } from 'uuid';

const errors = ref<string[]>([]);

const isLoading = ref<boolean>(false);
const maps = ref<Map[]>([]);
const mapItems = ref<Map[]>([]);
const spinning = ref<boolean>(false);

const spinButton = ref<HTMLElement>();
const isButtonVisible = ref<boolean>(true);

const data = ref({
    width: 0, //px
    containerWidth: 0, //px
    gap: 0, //px
    transitionDuration: 7500, //ms
    maxMoveSpeed: 50, //px
    minMoveSpeed: 2.5, //px
})

/** Initialization */
onMounted(async () => {
    await loadMaps();

    const screenWidth = 1920;
    const baseWidth = 220;
    const baseGap = 25;

    data.value.width = (window.innerWidth / screenWidth) * baseWidth;
    data.value.gap = (window.innerWidth / screenWidth) * baseGap;
    data.value.containerWidth = (data.value.width * 5) + (data.value.gap * 4);

    window.addEventListener('resize', () => {
        data.value.width = (window.innerWidth / screenWidth) * baseWidth;
        data.value.gap = (window.innerWidth / screenWidth) * baseGap;
        data.value.containerWidth = (data.value.width * 5) + (data.value.gap * 4);
    });
})

async function loadMaps() {

    let result = await fetchMaps();

    if (!result || result.length === 0) {
        const cachedMaps = localStorage.getItem('maps');
        if (cachedMaps) result = JSON.parse(cachedMaps);
    }

    if (!result) return;

    maps.value = result;
    localStorage.setItem('maps', JSON.stringify(maps.value));

    //waiting for nextTick to ensure that the DOM is updated
    await nextTick();
    if (!maps.value) return;

    //adding initial items
    addMapItems();
}

function shuffleArray<T>(array: T[]): void {
    let currentIndex = array.length;
    let temporaryValue: T;
    let randomIndex: number;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {
        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

        // And swap it with the current element.
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }
}

async function fetchMaps(): Promise<Map[]> {
    let maps = [] as Map[];

    await axios.get(`${import.meta.env.VITE_APP_API_URL}/maps`)
        .then((response) => {
            maps = response.data.map((map: Map) => ({ ...map, selected: true, current: false }));
        })
        .catch((error) => {
            console.error(error);
        })

    return maps;
}

const addMapItems = () => {
    if (!maps.value) return;
    if (!mapItems.value) mapItems.value = [];

    const activeMaps = maps.value.filter(map => map.selected).splice(0, 6);

    shuffleArray(activeMaps);

    activeMaps.forEach((map, index) => {
        if (index === 2) map.current = true;

        map.key = generateKey();
        map.left = data.value.gap * index + (data.value.width * index);
    });

    mapItems.value = [...activeMaps];
}

/** Selection */
const onSpin = (e: MouseEvent) => {
    if (!maps.value || !mapItems.value) return;

    if (!maps.value.some(map => map.selected)) {
        errors.value = ['Please select at least one map.'];
        return;
    }

    spinning.value = true;
    errors.value = [];

    isButtonVisible.value = false;

    let ending = false;
    let moveSpeed = data.value.minMoveSpeed;
    let lastTime = 0;
    let finished = false;

    const animate = (timestamp: number) => {
        if (finished) return;
        const deltaTime = timestamp - lastTime;
        const fpsInterval = 1000 / 60; // 60 fps

        if (deltaTime > fpsInterval) {
            lastTime = timestamp - (deltaTime % fpsInterval);

            mapItems.value?.forEach((map, index) => {
                if (update(map, ending, moveSpeed)) finished = true;
            });

            mapItems.value = mapItems.value.filter(map => !map.hidden);

            if (!ending) {
                if (moveSpeed < data.value.maxMoveSpeed) moveSpeed += 0.1;
            } else {
                if (moveSpeed >= data.value.minMoveSpeed) moveSpeed -= 0.1;
            }
        }

        if (!finished || moveSpeed > data.value.minMoveSpeed) {
            requestAnimationFrame(animate);
        } else {
            isButtonVisible.value = true;
            spinning.value = false;
        }
    };

    requestAnimationFrame(animate);

    setTimeout(() => {
        ending = true;
    }, data.value.transitionDuration);
};

const update = (map: Map, ending: boolean, moveSpeed: number): boolean => {
    if (map.hidden || map.left === undefined) return false;

    if (ending) {
        if (map.current && isCentered(map) && moveSpeed <= data.value.minMoveSpeed) {
            console.log('Winner:', map.displayName);
            isButtonVisible.value = true;

            const activeMaps = mapItems.value?.filter(m => !m.hidden).sort((a, b) => a.left - b.left);

            if (activeMaps) {
                for (var i = 0; i < activeMaps?.length; i++) {
                    activeMaps[i].left = data.value.gap * i + (data.value.width * i);
                }
            }

            return true;
        }
    }

    map.left -= moveSpeed;

    const isInCenter = isInCenterArea(map);

    if (map.current != isInCenter) {
        map.current = isInCenter;
    }

    if (map.left <= -data.value.width) {
        hideMap(map);
        addMap(nextMap());
    }
    return false;
}

const mapSelect = (map: Map) => {
    if (!maps.value || spinning.value) return;
    map.selected = !map.selected;
}

const isInCenterArea = (map: Map) => {
    if (!map.left) return false;

    const cardMid = map.left + data.value.width / 2;

    const min = (data.value.width * 2) + (data.value.gap * 2) + 10;
    const max = (data.value.width * 3) + (data.value.gap * 2) - 10;

    //if ((cardMid > min && cardMid < max)) console.log(map.displayName, min, cardMid, max, (cardMid > min && cardMid < max));
    return cardMid > min && cardMid < max;
}

const isCentered = (map: Map) => {
    if (!map.left) return false;

    const cardMid = map.left + data.value.width / 2;
    const min = (data.value.width * 2) + (data.value.gap * 2) + (data.value.width / 2) - 10;
    const max = (data.value.width * 2) + (data.value.gap * 2) + (data.value.width / 2) + 10;

    return cardMid > min && cardMid < max;
}

const highestX = () => {
    const itemWithHighestLeft = mapItems.value.reduce((highest, item) => {
        return (highest.left > item.left) ? highest : item;
    });

    return itemWithHighestLeft.left;
}

const nextMap = () => {
    const activeMaps = maps.value.filter(map => map.selected);
    return { ...activeMaps[Math.floor(Math.random() * activeMaps.length)] };
}

const hideMap = (map: Map) => {
    if (!mapItems.value) return;

    map.left = -data.value.width;
    map.hidden = true;
}

const addMap = (next: Map) => {
    if (next) {
        next.key = generateKey();
        next.left = highestX() + data.value.width + data.value.gap;
        next.hidden = false;
        mapItems.value = [...mapItems.value, next];
    }
}

const selectAll = () => {
    if (!maps.value || spinning.value) return;
    maps.value.forEach(map => map.selected = true);
}

const deselectAll = () => {
    if (!maps.value || spinning.value) return;
    maps.value.forEach(map => map.selected = false);
}

const generateKey = () => {
    return uuidv4();
}

watch(data.value, () => {
    if (!mapItems.value) return;
    mapItems.value.forEach((map, index) => {
        map.left = data.value.gap * index + (data.value.width * index);
    });
})
</script>

<template>
    <div class="raffle-container">
        <div v-if="!isLoading" class="inner-raffle-container" :style="{ width: `${data.containerWidth}px` }">
            <div class="raffle">
                <div v-for="(map, index) in mapItems" class="raffle-item" :class="map.current ? 'current' : ''"
                    :style="{ width: `${data.width}px`, left: `${map.left}px` }" :key="map.key">
                    <img :src="map.listViewIconTall">
                    <p>{{ map.displayName }}</p>
                    <transition name="fade">
                        <button class="button-spin" v-if="map.current && isButtonVisible" ref="spinButton"
                            @click="onSpin">Spin</button>
                    </transition>
                </div>

            </div>
            <!-- <span class="vertical-line"></span> -->
        </div>


        <div class="selection-container">
            <div class="flex-wrap">
                <div v-for="map in maps" :key="map.uuid" class="map-item" :class="{ selected: map.selected }"
                    @click="mapSelect(map)">
                    <p>{{ map.displayName }}</p>
                    <span class="tooltip">{{ map.selected ? "Click to disable" : "Click to enable" }}</span>
                </div>
                <Errors v-if="errors" :errors="errors" />
            </div>
            <div style="display: flex; gap: 1rem;">
                <button @click="selectAll">Select All</button>
                <button @click="deselectAll">Deselect All</button>
            </div>
        </div>
    </div>
</template>

<style scoped>
.raffle-container {
    width: 90%;
    position: relative;
    border-radius: 5px;

    gap: 0.5rem;
    padding: 0.5rem;

    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}

.inner-raffle-container {
    position: relative;
    margin: 1rem;
    height: 40vh;

    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    overflow: hidden;
}

.raffle {
    position: absolute;
    left: 0;
    top: 5%;
    height: 90%;
    transition: transform 0.5s ease-in-out;
}

.raffle-item {
    position: absolute;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    height: 100%;
    border-radius: 15px;
    overflow: hidden;
    transition:
        transform 0.1s ease-in-out,
        filter 0.1s ease-in-out;
    filter: grayscale(100%);
}

.raffle-item p {
    margin: 0;
    position: absolute;
    color: var(--color-highlight);
    font-size: 1.5rem;
    font-weight: bold;
    top: 2rem;
    text-shadow: 2px 2px 4px #fd455774;
}

.raffle-item img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.button-spin {
    position: absolute;
    margin: 0 auto;
    bottom: 2rem;
    z-index: 1;
}

.selection-container {
    width: 50%;
    margin: 1rem;

    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 1rem;
}

.current {
    transform: scale(1.05);
    filter: grayscale(0%);
}

.flex-wrap {
    max-width: 50%;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 0.5rem;
}

.map-item {
    position: relative;
    background-color: var(--color-background-soft);
    border-radius: 5px;
    padding: 0.1rem .6rem;
    user-select: none;
}

.selected {
    background-color: var(--color-highlight);
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

.map-item:hover {
    cursor: pointer;
}

.map-item:hover .tooltip {
    visibility: visible;
    opacity: 1;
}

.fade-enter-active,
.fade-leave-active {
    transition: opacity .5s;
}

.fade-enter,
.fade-leave-to {
    opacity: 0;
}

.vertical-line {
    position: absolute;
    top: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 2px;
    height: 100%;
    background-color: var(--color-highlight);
    z-index: 0;
}

@media (max-width: 1024px) {
    .flex-wrap {
        max-width: 100%;
    }
}
</style>
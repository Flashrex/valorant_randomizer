<script setup lang="ts">
import { nextTick, onMounted, ref, watch } from 'vue';
import type { Map } from '@/types/map';
import axios from 'axios';
import Errors from './Errors.vue';
import { v4 as uuidv4 } from 'uuid';

import selectedImageSrc from '@/assets/icons/selected.png';
import notSelectedImageSrc from '@/assets/icons/not_selected.png';

const errors = ref<string[]>([]);

const isLoading = ref<boolean>(false);
const maps = ref<Map[]>([]);
const mapItems = ref<Map[]>([]);
const spinning = ref<boolean>(false);

const spinButton = ref<HTMLElement>();
const isButtonVisible = ref<boolean>(true);

const selectedImage = ref(new Image());
const notSelectedImage = ref(new Image());

var optionExcludeMaps = ref<boolean>(JSON.parse(localStorage.getItem("optionExcludeMaps") || "false"));
var usedMaps = JSON.parse(localStorage.getItem("usedMaps") || "[]");

const data = ref({
    cardCount: 5,
    width: 220, //px
    containerWidth: 0, //px
    gap: 25, //px
    transitionDuration: 5000, //ms
    maxMoveSpeed: 50, //px
    minMoveSpeed: 2.5, //px
})

/** Initialization */
onMounted(async () => {
    selectedImage.value.src = selectedImageSrc
    notSelectedImage.value.src = notSelectedImageSrc;

    await loadMaps();

    updateDimensions();
    addMapItems();

    window.addEventListener('resize', () => {
        if (spinning.value) return;
        if (updateDimensions()) addMapItems();
    });
})

async function loadMaps() {

    let result = await fetchMaps();

    if (!result || result.length === 0) {
        const cachedMaps = localStorage.getItem('maps');
        if (cachedMaps) result = JSON.parse(cachedMaps);
    }

    if (!result) return;

    maps.value = result.map(map => ({
        ...map,
        selected: optionExcludeMaps.value ? !usedMaps.includes(map.displayName) : true,
        current: false
    }));
    localStorage.setItem('maps', JSON.stringify(maps.value));
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
    mapItems.value = [];

    const activeMaps = maps.value.filter(map => map.selected).splice(0, data.value.cardCount + 1);

    shuffleArray(activeMaps);

    resetMaps(activeMaps);

    mapItems.value = [...activeMaps];
}

const resetMaps = (maps: Map[]) => {
    if (!maps) return;

    maps.forEach((map, index) => {
        if (index === Math.floor(data.value.cardCount / 2)) map.current = true;
        else map.current = false;
        map.key = generateKey();
        map.left = data.value.gap * index + (data.value.width * index);
        map.hidden = false;
    });
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
            if (optionExcludeMaps.value) {
                if (!usedMaps.includes(map.displayName)) {
                    usedMaps.push(map.displayName);
                    localStorage.setItem("usedMaps", JSON.stringify(usedMaps));
                }
                const mapRef = maps.value.find(m => m.displayName === map.displayName);
                if (mapRef) mapRef.selected = false;
            }

            isButtonVisible.value = true;

            const activeMaps = mapItems.value?.filter(m => !m.hidden).sort((a, b) => a.left - b.left);
            resetMaps(activeMaps);

            return true;
        }
    }
    map.left -= moveSpeed;

    const isInCenter = isInCenterArea(map);

    if (map.current != isInCenter) {
        map.current = isInCenter;
    }

    if (map.left <= -data.value.width) {
        console.log('Map hidden:', map.displayName);
        hideMap(map);
        addMap(nextMap());
    }
    return false;
}

const mapSelect = (map: Map) => {
    if (!maps.value || spinning.value) return;
    map.selected = !map.selected;
    if (optionExcludeMaps.value) {
        usedMaps = maps.value.filter(map => !map.selected).map(map => map.displayName);
        localStorage.setItem("usedMaps", JSON.stringify(usedMaps));
    }
}

const isInCenterArea = (map: Map) => {
    if (!map.left) return false;

    const cardMid = map.left + data.value.width / 2;

    const min = (data.value.containerWidth / 2) - (data.value.width / 2);
    const max = (data.value.containerWidth / 2) + (data.value.width / 2);

    return cardMid > min && cardMid < max;
}

const isCentered = (map: Map) => {
    if (!map.left) return false;

    const cardMid = map.left + data.value.width / 2;

    const min = data.value.containerWidth / 2 - 10;
    const max = data.value.containerWidth / 2 + 10;

    return cardMid >= min && cardMid <= max;
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
    if (optionExcludeMaps.value) {
        usedMaps = [];
        localStorage.setItem("usedMaps", JSON.stringify(usedMaps));
    }
}

const deselectAll = () => {
    if (!maps.value || spinning.value) return;
    maps.value.forEach(map => map.selected = false);
    if (optionExcludeMaps.value) {
        usedMaps = maps.value.map(map => map.displayName);
        localStorage.setItem("usedMaps", JSON.stringify(usedMaps));
    }
}

const generateKey = () => {
    return uuidv4();
}

const updateDimensions = () => {

    let reloadMaps = false;

    const newCardCount = window.innerWidth < 1024 ? 3 : 5;
    if (data.value.cardCount !== newCardCount) {
        data.value.cardCount = newCardCount;
        reloadMaps = true;
    }

    data.value.containerWidth = (data.value.width * data.value.cardCount) + (data.value.gap * (data.value.cardCount - 1));

    return reloadMaps;
}

watch(optionExcludeMaps, () => {
    if (optionExcludeMaps.value) {
        usedMaps = maps.value.filter(map => !map.selected).map(map => map.displayName);
    } else {
        usedMaps = [];
    }
    localStorage.setItem("usedMaps", JSON.stringify(usedMaps));
    localStorage.setItem("optionExcludeMaps", JSON.stringify(optionExcludeMaps.value));
})
</script>

<template>
    <div class="raffle-container">
        <div v-if="!isLoading" class="inner-raffle-container" :style="{ width: `${data.containerWidth}px` }">
            <div class="raffle">
                <div v-for="map in mapItems" class="raffle-item" :class="map.current ? 'current' : ''"
                    :style="{ width: `${data.width}px`, left: `${map.left}px` }" :key="map.key">
                    <img :src="map.listViewIconTall">
                    <p class="map-name">{{ map.displayName }}</p>
                    <transition name="fade">
                        <button class="button-spin" v-if="map.current && isButtonVisible" ref="spinButton"
                            @click="onSpin">{{ $t('Spin') }}</button>
                    </transition>
                </div>

            </div>
            <!-- <span class="vertical-line"></span> -->
        </div>


        <div class="selection-container">
            <div class="flex-wrap">
                <div v-for="map in maps" :key="map.key" class="map-item" :class="{ selected: map.selected }"
                    @click="mapSelect(map)">
                    <p>{{ map.displayName }}</p>
                    <span class="tooltip">{{ map.selected ? "Click to disable" : "Click to enable" }}</span>
                </div>
                <Errors v-if="errors" :errors="errors" />
            </div>
            <div style="display: flex; gap: 1rem;">
                <button @click="selectAll">{{ $t('Select All') }}</button>
                <button @click="deselectAll">{{ $t('De-select All') }}</button>
            </div>
            <div class="flex options-container" @click="optionExcludeMaps = !optionExcludeMaps">
                <img v-if="optionExcludeMaps" class="sel-icon" :src="selectedImage.src" alt="selected">
                <img v-else class="sel-icon" :src="notSelectedImage.src" alt="not_selected">
                <label>{{ $t('Exclude rolled map from future rolls') }}</label>
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

.map-name {
    font-family: 'ValorantFont', sans-serif;
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

    .selection-container {
        width: 100%;
    }
}

.sel-icon {
    width: 1.5rem;
    height: 1.5rem;
}

.options-container,
.options-container * {
    cursor: pointer;
}
</style>
<script setup lang="ts">
import { nextTick, onMounted, ref } from 'vue';
import type { Map } from '@/types/map';
import axios from 'axios';

const raffle = ref(null as HTMLElement | null);
const maps = ref(null as Map[] | null);
const mapItems = ref(null as Map[] | null);
const currentMapIndex = ref(2);
const isButtonVisible = ref(true);

const data = {
    width: 220, //px
    gap: 25, //px
    transitionDuration: 2500, //ms
}


/** Initialization */
onMounted(async () => {
    await loadMaps();
})

async function loadMaps() {
    const cachedMaps = localStorage.getItem('maps');

    if (cachedMaps) {
        const temp = JSON.parse(cachedMaps);
        maps.value = temp.map((map: Map) => ({ ...map, selected: true, current: false }));
    } else {
        maps.value = await requestMapsFromServer();
    }

    //waiting for nextTick to ensure that the DOM is updated
    await nextTick();
    if (!maps.value) return;

    //adding initial items
    addMapItems();

    //selecting initial map
    selectMap(true);
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

async function requestMapsFromServer(): Promise<Map[]> {
    await axios.get('https://valorant-api.com/v1/maps')
        .then((response) => {
            //const filtered = response.data.data.filter((map: Map) => agent.isPlayableCharacter);
            //console.log(filtered);

            return response.data.data.map((map: Map) => ({ ...map, selected: true, current: false }));
        })
        .catch((error) => {
            console.error(error);
        });

    return [];
}

const addMapItems = () => {
    if (!raffle.value || !maps.value) return;
    if (!mapItems.value) mapItems.value = [];

    const filteredMaps = maps.value.filter(map => map.selected);

    const tempArr = [];
    for (var i = 0; i < maps.value.length * 2; i++) {
        tempArr.push(filteredMaps[Math.floor(Math.random() * filteredMaps.length)]);
    }
    shuffleArray(tempArr);

    mapItems.value = [...mapItems.value, ...tempArr.map(map => ({ ...map }))];
    console.log(mapItems.value);
}

/** Selection */
const onSpin = (e: MouseEvent) => {
    if (!raffle.value || !maps.value || !mapItems.value || !e.target) return;

    isButtonVisible.value = false;

    //add new items so we dont run out of items
    addMapItems();

    //select winner and start spinning to map
    const winner = selectWinner();
    currentMapIndex.value = winner;
    selectMap();

    setTimeout(() => {
        isButtonVisible.value = true;
    }, data.transitionDuration);
}

const selectWinner = (): number => {
    if (!mapItems.value || !maps.value) return -1;

    const currentIndex = currentMapIndex.value + maps.value.length; //adding maps.length to ensure that we dont get a map that is already visible

    const filtered = maps.value.filter(map => map.selected);

    const winner = filtered[Math.floor(Math.random() * filtered.length)];

    return mapItems.value.findIndex((map, i) => i >= currentIndex && map.uuid === winner.uuid) + 1;
}

const selectMap = (instant = false) => {
    if (!mapItems.value || !raffle.value) return;

    //reset current map
    mapItems.value.forEach(m => m.current = false);

    //translate to the selected map
    const translateX = data.gap * (currentMapIndex.value - 1) + (data.width * (currentMapIndex.value - 2));
    raffle.value.style.transform = `translateX(${translateX * -1}px)`;

    if (instant) {
        mapItems.value[currentMapIndex.value].current = true;
        return;
    }


    setTimeout(() => {
        //set current map
        if (mapItems.value) mapItems.value[currentMapIndex.value].current = true;
    }, data.transitionDuration);
};

const mapSelect = (map: Map) => {
    if (!maps.value) return;
    map.selected = !map.selected;
}
</script>

<template>
    <div class="raffle-container">
        <h1>Map Raffle</h1>
        <div class="inner-raffle-container">
            <div ref="raffle" class="raffle"
                :style="{ gap: `${data.gap}px`, transitionDuration: `${data.transitionDuration}ms` }">
                <div v-for="map in mapItems" class="raffle-item" :class="map.current ? 'current' : ''"
                    :style="{ width: `${data.width}px` }" :key="map.uuid">
                    <img :src="map.listViewIconTall">
                    <p>{{ map.displayName }}</p>
                </div>
            </div>
            <button v-if="isButtonVisible" @click="onSpin">Spin</button>
        </div>


        <div class="selection-container">
            <div class="flex-wrap">
                <div v-for="map in maps" :key="map.uuid" class="map-item" :class="{ selected: map.selected }"
                    @click="mapSelect(map)">
                    <p>{{ map.displayName }}</p>
                    <span class="tooltip">Click to disable</span>
                </div>
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
    width: 80%;
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
    display: flex;
    transition: transform 0.5s ease-in-out;
}

.raffle-item {
    position: relative;
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
    position: absolute;
    color: var(--color-highlight);
    font-size: 1.5rem;
    font-weight: bold;
    top: 2rem;
}

.raffle-item img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

button {
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
    flex-wrap: wrap;
}

.current {
    transform: scale(1.05);
    filter: grayscale(0%);
}

.flex-wrap {
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
</style>
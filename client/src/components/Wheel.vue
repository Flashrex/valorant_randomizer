<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { Wheel } from 'spin-wheel';
import axios from 'axios';
import type { Map } from '@/types/map';

const wheelContainer = ref(null);

let wheel: { spinToItem: (winningItemIndex: number, duration: number, spinToCenter: boolean, numberOfRevolutions: number, direction: number, easingFunction: Function | null) => void; } | null = null;

const spinData = {
    duration: 5000,
    spinToCenter: false,
    numberOfRevolutions: 1,
    easingFunction: null,
}

const currentMap = ref(null as Map | null);
const maps = ref(null as Map[] | null);

onMounted(async () => {
    await loadMaps();

    const items = maps.value?.map(map => ({
        label: map.displayName,
        image: map.listViewIconTall
    }));

    wheel = new Wheel(wheelContainer.value, { items });
})

const onSpin = () => {

    if (!maps.value) return;
    const winner = Math.floor(Math.random() * maps.value?.length);

    wheel?.spinToItem(winner, spinData.duration, spinData.spinToCenter, spinData.numberOfRevolutions, 1, spinData.easingFunction);
}

async function loadMaps() {
    const cachedMaps = localStorage.getItem('maps');

    if (cachedMaps) {
        const temp = JSON.parse(cachedMaps);
        maps.value = temp?.map((map: Map) => ({ ...map, selected: true }));

        currentMap.value = maps.value ? maps.value[0] : null;
        return;
    }

    await requestMapsFromServer();
}

async function requestMapsFromServer() {
    await axios.get('https://valorant-api.com/v1/maps')
        .then((response) => {
            //const filtered = response.data.data.filter((map: Map) => agent.isPlayableCharacter);
            //console.log(filtered);

            maps.value = response.data.data

            localStorage.setItem('maps', JSON.stringify(maps.value));
        })
        .catch((error) => {
            console.error(error);
        });
}
</script>

<template>
    <div ref="wheelContainer" class="container">
        <button @click="onSpin">Spin</button>
    </div>
</template>

<style scoped>
.container {
    width: 100%;
    height: 100%;
    margin: auto;
}
</style>
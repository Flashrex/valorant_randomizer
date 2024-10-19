<script setup lang="ts">
import type { SelectorItem } from '@/types/selectorItem';
import { computed, onMounted } from 'vue';

const emit = defineEmits(['select']);

const props = defineProps<{
    items: SelectorItem[];
    locked: boolean;
}>();

const groupedItems = computed(() => {
    return props.items?.reduce((acc, item) => {
        if (item.group) {
            if (!acc[item.group]) {
                acc[item.group] = [];
            }
            acc[item.group].push(item);
        }
        return acc;
    }, {} as Record<string, SelectorItem[]>);
});

const onSelect = (item: SelectorItem) => {
    if (props.locked) return;
    emit('select', item.id);
}

</script>

<template>
    <div class="container">
        <div v-if="groupedItems" v-for="(group, index) in groupedItems" :key="index">
            <div class="flex-wrap">
                <div v-for="item in group" :key="item.id" class="group-item">
                    <img class="item-icon" :class="{ selected: item.selected }" :src="item.icon" :alt="item.id"
                        @click="onSelect(item)">
                    <span class="tooltip">{{ item.selected ? "Click to disable" : "Click to enable" }}</span>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.container {
    display: flex;
    flex-direction: column;
    gap: 1rem;
}

.group-item {
    position: relative;
}

.item-icon {
    width: 50px;
    aspect-ratio: 1/1;
    cursor: pointer;
    filter: grayscale(100%);
}

.item-icon.selected {
    filter: grayscale(0%);
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

.group-item:hover .tooltip {
    visibility: visible;
    opacity: 1;
}
</style>
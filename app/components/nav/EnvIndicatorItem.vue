<script setup lang="ts">
import { useConfigStore } from '~/stores/config-store';

const config = useConfigStore();
</script>

<template>
    <div
        v-if="config.env && config.env !== 'prod'"
        class="items-center justify-center rounded-sm text-sm text-white font-bold uppercase px-1 py-0.5"
        :class="[
            config.env === 'dev' ? 'bg-green-500' : 'bg-red-600',
        ]"
    >
        {{ config.env }}
    </div>
</template>

<script setup lang="ts">
defineProps<{
    name?: string,
}>()
</script>

<template>
    <label
        :for="name"
        class="block text-sm font-medium leading-6 text-core-light-900 dark:text-core-dark-100"
    >
        <slot/>
    </label>
</template>

<script setup lang="ts">
defineProps<{
    error?: string,
    name?: string,
}>()
</script>

<template>
    <label
        :for="name"
        class="absolute -mt-px inline-block bg-body-bg dark:bg-body-bg-dark px-1 text-xs font-medium top-[-7px] left-[7px] z-10"
        :class="[
            error ? 'text-red-600' : 'text-core-light-900 dark:text-core-dark-200',
        ]"
    ><slot/></label>
</template>

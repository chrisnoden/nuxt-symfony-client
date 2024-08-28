<script setup lang="ts">
withDefaults(defineProps<{
    disabled?: boolean,
}>(), {
    disabled: false,
})
defineEmits<{
    click: [],
}>()
</script>

<template>
    <button
        type="button"
        class="w-full flex justify-center rounded-md px-3 py-1.5 text-sm font-semibold leading-6 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-highlight-600 uppercase"
        :class="[
            disabled
                ? 'bg-transparent text-core-light-600 dark:text-core-dark-400'
                : 'bg-core-light-50 dark:bg-core-dark-950 hover:bg-core-light-200 dark:hover:bg-core-dark-800 text-core-light-800 dark:text-core-dark-200'
        ]"
        :disabled="disabled"
        @click.prevent="$emit('click')"
    >
        <slot>Cancel</slot>
    </button>
</template>

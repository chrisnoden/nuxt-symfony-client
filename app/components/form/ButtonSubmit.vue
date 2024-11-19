<script setup lang="ts">
withDefaults(defineProps<{
    disabled?: boolean,
    isProcessing?: boolean,
}>(), {
    disabled: false,
    isProcessing: false,
})
defineEmits<{
    click: [],
}>()
</script>

<template>
    <div class="mx-auto max-w-full md:max-w-sm">
        <button
            type="submit"
            class="flex w-full justify-center rounded-md px-3 text-sm font-semibold uppercase leading-6 text-white shadow-sm py-1.5 focus-visible:outline-highlight-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
            :class="[ (disabled || isProcessing) ? 'bg-highlight-400' : 'bg-highlight-600 hover:bg-highlight-500' ]"
            :disabled="disabled || isProcessing"
            @click.prevent="$emit('click')"
        >
            <slot v-if="!isProcessing">Submit</slot>

            <div v-else class="sm:flex sm:items-start">
                <span class="block h-6 w-6 animate-spin rounded-full border-2 border-t-highlight-300" />
            </div>
        </button>
    </div>
</template>

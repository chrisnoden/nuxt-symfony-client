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
    <div class="max-w-64 md:max-w-full">
        <button
            type="submit"
            class="w-full flex justify-center rounded-md px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-highlight-600"
            :class="[ (disabled || isProcessing) ? 'bg-highlight-400' : 'bg-highlight-600 hover:bg-highlight-500' ]"
            :disabled="disabled || isProcessing"
            @click.prevent="$emit('click')"
        >
            <slot v-if="!isProcessing">Submit</slot>

            <div v-else class="sm:flex sm:items-start">
                <span class="h-6 w-6 block rounded-full border-2 border-t-highlight-300 animate-spin" />
            </div>

        </button>
    </div>
</template>

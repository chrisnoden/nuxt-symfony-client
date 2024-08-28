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
        class="w-full flex justify-center rounded-md px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-highlight-600 uppercase"
        :class="[ disabled ? 'bg-highlight-400' : 'bg-highlight-600 hover:bg-highlight-500' ]"
        :disabled="disabled"
        @click.prevent="$emit('click')"
    >
        <slot>Edit</slot>
    </button>
</template>

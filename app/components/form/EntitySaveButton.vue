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
        type="submit"
        class="w-full flex justify-center rounded-md px-3 py-1.5 text-sm font-bold leading-6 text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600 uppercase"
        :class="[ disabled ? 'bg-green-400' : 'bg-green-600 hover:bg-green-500' ]"
        :disabled="disabled"
        @click.prevent="$emit('click')"
    >
        <slot>Save</slot>
    </button>
</template>

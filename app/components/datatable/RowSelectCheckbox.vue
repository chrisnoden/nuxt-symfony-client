<script setup lang="ts">
const props = defineProps<{
    checked: boolean,
    idx?: number,
}>()
const emit = defineEmits<{
    change: [checked: boolean],
}>()

const value = ref<boolean>(props.checked);

const onClick = () => {
    emit('change', value.value);
}

watch(() => props.checked, (checked: boolean) => value.value = checked);
</script>

<template>
    <input
        :id="`select-${idx ?? 'all'}`"
        v-model="value"
        :aria-describedby="idx ? 'Select row' : 'Select all rows'"
        :name="`select-${idx ?? 'all'}`"
        type="checkbox"
        class="h-5 w-5 cursor-pointer rounded border-core-light-300 text-highlight-600 focus:ring-highlight-600 dark:border-core-dark-700"
        @click="onClick"
    >
</template>

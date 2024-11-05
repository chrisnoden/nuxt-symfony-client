<script setup lang="ts">
import FieldLabel from '~/components/form/FieldLabel.vue';

const value = defineModel<boolean>({ required: true });
withDefaults(defineProps<{
    disabled?: boolean
    label?: string,
    name?: string,
}>(), {
    disabled: false,
    label: 'Enabled',
    name: 'input-enabled',
})
</script>

<template>
    <div class="grid grid-cols-2 sm:grid-cols-3 sm:items-start gap-4 sm:py-6">
        <FieldLabel :name="name">{{ label ?? 'Enabled' }}</FieldLabel>

        <div class="flex h-6 items-center">
            <input
                :id="name"
                v-model="value"
                :aria-describedby="name"
                :disabled="disabled"
                :name="name"
                type="checkbox"
                class="h-6 w-6 rounded border-core-light-300 dark:border-core-dark-700 text-highlight-600 focus:ring-highlight-600"
                :class="[
                    !disabled && 'cursor-pointer'
                ]"
            >
        </div>
    </div>
</template>

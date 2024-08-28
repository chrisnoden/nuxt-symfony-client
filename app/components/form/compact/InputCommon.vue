<script setup lang="ts">
import FieldLabel from '~/components/form/compact/FieldLabel.vue';

const value = defineModel<string>();
withDefaults(defineProps<{
    autocomplete?: string,
    disabled?: boolean
    error?: string,
    label?: string,
    maxLength?: number,
    name?: string,
    placeholder?: string,
    required?: boolean,
    type?: 'email'|'password'|'tel'|'text',
}>(), {
    autocomplete: 'off',
    disabled: false,
    error: undefined,
    label: undefined,
    maxLength: 255,
    name: 'input-text',
    placeholder: undefined,
    required: false,
    type: 'text'
})
defineEmits<{
    input: [value: string],
}>()
</script>

<template>
    <div class="relative">
        <FieldLabel
            :error="error"
            :name="name"
        >{{ label ?? 'Input' }}</FieldLabel>

        <div>
            <input
                :id="name"
                v-model="value"
                :autocomplete="autocomplete"
                :disabled="disabled"
                :maxlength="maxLength"
                :name="name"
                :placeholder="placeholder"
                :required="required"
                :type="type"
                class="relative w-full rounded-md border border-gray-300 bg-body-bg dark:bg-body-bg-dark hover:border-core-light-600 px-3 py-2 shadow-sm no-select focus-within:border-indigo-600 focus-within:ring-1 focus-within:ring-indigo-600"
                :class="[
                    error ? 'ring-red-600' : 'ring-core-light-300',
                ]"
                @input="$emit('input', $event.target?.value ?? '')"
            >
        </div>
        <div class="absolute -bottom-4 px-1 text-xs text-red-600">
            {{ error }}
        </div>
    </div>
</template>

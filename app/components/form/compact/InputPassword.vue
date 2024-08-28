<script setup lang="ts">
import InputCommon from '~/components/form/compact/InputCommon.vue';

const password = defineModel<string>();
withDefaults(defineProps<{
    disabled?: boolean
    error?: string,
    label?: string,
    name?: 'current-password' | 'new-password' | 'confirm-password',
}>(), {
    disabled: false,
    error: undefined,
    label: undefined,
    name: 'current-password',
});
defineEmits<{
    input: [value: string],
}>()
</script>

<template>
    <InputCommon
        v-model="password"
        :autocomplete="name"
        :disabled="disabled"
        :error="error"
        :label="label ?? 'Password'"
        :name="name"
        required
        type="password"
        @input="$emit('input', $event)"
    />
</template>

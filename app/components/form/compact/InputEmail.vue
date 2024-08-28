<script setup lang="ts">
import InputCommon from '~/components/form/compact/InputCommon.vue';

const email = defineModel<string>();
withDefaults(defineProps<{
    disabled?: boolean
    error?: string,
}>(), {
    disabled: false,
    error: undefined,
})
defineEmits<{
    input: [value: string],
}>()
</script>

<template>
    <InputCommon
        v-model="email"
        autocomplete="on"
        :disabled="disabled"
        :error="error"
        label="Email address"
        name="email"
        required
        type="email"
        @input="$emit('input', $event)"
    />
</template>

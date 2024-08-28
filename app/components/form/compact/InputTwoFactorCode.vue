<script setup lang="ts">
import InputCommon from '~/components/form/compact/InputCommon.vue';

const authCode = defineModel<string>();
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
        v-model="authCode"
        autocomplete="on"
        :disabled="disabled"
        :error="error"
        label="2FA Auth code"
        name="_auth_code"
        required
        type="tel"
        @input="$emit('input', $event)"
    />
</template>

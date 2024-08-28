<script setup lang="ts">
import InputTwoFactorCode from '~/components/form/compact/InputTwoFactorCode.vue';

const twoFactorCode = defineModel<string>();
const { disabled = false} = defineProps<{disabled: boolean}>();
</script>

<template>
    <h2 class="my-10 text-center text-2xl font-bold leading-9 tracking-tight">Authenticator Code</h2>
    <InputTwoFactorCode
        v-model="twoFactorCode"
        :disabled="disabled"
    />
</template>

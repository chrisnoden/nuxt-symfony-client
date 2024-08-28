<script setup lang="ts">
import InputPassword from '~/components/form/compact/InputPassword.vue';

const password = defineModel<string>();
</script>

<template>
    <div class="mt-8 lg:mx-4 py-2 px-4 grid grid-cols-1 md:grid-cols-2 gap-4 rounded-lg border border-highlight-100 shadow-lg">
        <p class="text-sm">
            To confirm the changes, please enter your current password
        </p>
        <div>
            <InputPassword
                v-model="password"
            />
        </div>
    </div>
</template>

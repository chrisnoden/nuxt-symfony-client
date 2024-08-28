<script setup lang="ts">
import InputPassword from '~/components/form/compact/InputPassword.vue';
import InputEmail from '~/components/form/compact/InputEmail.vue';

const { disabled = false } = defineProps<{ disabled: boolean }>();
const emit = defineEmits<{
    input: [credentials: LoginFormType]
}>();

const email = ref<string>('');
const password = ref<string>('');
const rememberMe = ref<boolean>(false);

const onInput = () => {
    emit('input', {
        email: email.value,
        password: password.value,
        rememberMe: rememberMe.value,
    })
}
</script>

<template>
    <div class="my-10 text-center text-2xl font-bold leading-9 tracking-tight text-core-light-700 dark:text-core-dark-200">
        Please enter your credentials
    </div>

    <div class="space-y-8">
        <div>
            <InputEmail
                v-model="email"
                :disabled="disabled"
                @input="onInput"
            />
        </div>

        <div>
            <InputPassword
                v-model="password"
                :disabled="disabled"
                @input="onInput"
            />
        </div>
    </div>

    <div class="flex items-center justify-between pt-4">
        <div class="flex items-center">
            <input
                id="remember-me"
                v-model="rememberMe"
                name="remember-me"
                type="checkbox"
                class="h-4 w-4 rounded border-core-light-300 text-highlight-600  focus:ring-highlight-600"
                @change="onInput"
            >
            <label for="remember-me" class="ml-3 block text-sm leading-6 text-core-light-900 dark:text-core-dark-100">Remember me</label>
        </div>

        <div class="text-sm leading-6">
            <NuxtLink
                to="/security/reset-password"
                class="font-semibold text-highlight-600 hover:text-highlight-500"
            >Forgot password?</NuxtLink>
        </div>
    </div>
</template>

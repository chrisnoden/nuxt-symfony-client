<script setup lang="ts">
import SecurityRepository from '~~/repositories/security-repository';
import { FetchError } from 'ofetch';
import ButtonSubmit from '~/components/form/ButtonSubmit.vue';
import InputPassword from '~/components/form/compact/InputPassword.vue';
import PleaseWaitModal from '~/components/modal/PleaseWaitModal.vue';
import SecurityLogo from '~/components/security/SecurityLogo.vue';

definePageMeta({
    layout: 'minimal'
})

const security = new SecurityRepository();

const token = useCookie('resetToken');
const password = ref<string>('');
const password2 = ref<string>('');
const error = ref<undefined | string>();
const isProcessing = ref<boolean>(false);
const router = useRouter();

const onSubmitClick = async () => {
    isProcessing.value = true;
    error.value = undefined;
    if (undefined === token.value || null === token.value) {
        error.value = 'invalid request';
    } else {
        try {
            await security.resetPasswordReset(token.value, password.value);
            token.value = undefined;
            await router.push('/security/activation/complete')
        } catch (e) {
            if (e instanceof FetchError) {
                error.value = e.data.message;
            }
        }
    }

    isProcessing.value = false;
}

const isValidForm = computed(() => (password.value.length > 7 && password.value === password2.value));

// Parse the token from the querystring and store in a temp cookie, then remove it from the querystring
if (undefined !== queryPropAsString('token')) {
    token.value = queryPropAsString('token');
    router.replace('/security/activation');
}
</script>

<template>
    <div
        class="flex flex-1 flex-col justify-center sm:px-6 py-12 lg:px-8"
    >
        <div
            class="border rounded-lg w-full max-w-2xl mx-auto mb-36 bg-body-bg dark:bg-core-dark-950"
            :class="[
                error ? 'border-red-600' : 'border-none',
            ]"
        >
            <div class="px-6 sm:px-16 pt-8">
                <SecurityLogo />

                <div class="flex flex-col items-center justify-center space-y-6 pt-6">
                    <div class="text-core-light-600 dark:text-core-dark-400 text-center">
                        To activate your new login, you must choose a secure password.
                        <br>
                        Never reveal your password to anyone.
                    </div>
                </div>

                <div class="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                    <form class="space-y-8" @submit="onSubmitClick">
                        <InputPassword
                            v-model="password"
                            label="New Password"
                            name="new-password"
                        />

                        <InputPassword
                            v-model="password2"
                            label="Repeat New Password"
                            name="confirm-password"
                        />

                        <ButtonSubmit
                            :disabled="!isValidForm"
                            @click="onSubmitClick"
                        />
                    </form>
                </div>
            </div>

            <div
                class="rounded-b-lg text-center mt-4 p-4 w-full"
                :class="[
                    error ? 'bg-red-600 text-white' : 'bg-none text-transparent'
                ]"
            >
                {{ error ?? 'no error' }}

                <NuxtLink to="/" class="uppercase hover:underline">Back</NuxtLink>
            </div>
        </div>
    </div>

    <PleaseWaitModal
        v-model="isProcessing"
    />
</template>

<script setup lang="ts">
import LoginForm from '~/components/security/LoginForm.vue';
import PleaseWaitModal from '~/components/modal/PleaseWaitModal.vue';
import SecurityRepository from '~~/repositories/security-repository';
import TwoFactorCodeForm from '~/components/security/TwoFactorCodeForm.vue';
import { FetchError } from 'ofetch';
import ButtonSubmit from '~/components/form/ButtonSubmit.vue';
import Logo from '~/components/branding/Logo.vue';
import { ApiErrorService } from '~~/services/api-error-service';

definePageMeta({
    layout: 'minimal'
})

const security = new SecurityRepository();
const email = ref<string>('');
const password = ref<string>('');
const rememberMe = ref<boolean>(false);
const error = ref<undefined | string>();
const isProcessing = ref<boolean>(false);
const router = useRouter();
const step = ref<'login' | '2fa'>('login');
const twoFactorCode = ref<undefined | string>();

const onLogin = async () => {
    isProcessing.value = true;
    error.value = undefined;
    if (step.value === 'login' && email.value.length > 4 && password.value.length > 0) {
        try {
            const response = await security.login(email.value, password.value, rememberMe.value);

            if (response.two_factor_required && !response.two_factor_complete) {
                step.value = '2fa';
            } else {
                await router.push('/');
            }
        } catch (e) {
            if (e instanceof FetchError) {
                const ars = new ApiErrorService();
                ars.handle(e);
                error.value = ars.getError().message;
            }
        }
    } else if (step.value === '2fa' && undefined !== twoFactorCode.value) {
        const response = await security.twoFactorAuth(twoFactorCode.value);

        if (response.login === 'success' && response.two_factor_complete) {
            await router.push('/');
        } else {
            twoFactorCode.value = undefined;
            error.value = 'invalid code, try again';
        }
    }

    isProcessing.value = false;
}

const isValidForm = computed(() =>
    (step.value === 'login' && email.value.length > 0 && password.value.length > 0)
        || (twoFactorCode.value !== undefined && twoFactorCode.value.length === 6)
);

const onFormInput = (credentials: LoginFormType) => {
    email.value = credentials.email;
    password.value = credentials.password;
    rememberMe.value = credentials.rememberMe;
}
</script>

<template>
    <div
        class="flex flex-1 flex-col justify-center sm:px-6 py-12 lg:px-8"
    >
        <div
            class="border rounded-lg w-full max-w-2xl mx-auto mb-36 bg-body-bg dark:bg-core-dark-950"
            :class="[
                error ? 'border-red-600' : 'border-transparent dark:border-core-dark-600',
            ]"
        >
            <div class="px-6 sm:px-16 pt-8">
                <div class="mx-auto">
                    <Logo/>
                </div>

                <div class="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                    <form @submit="onLogin">

                        <LoginForm
                            v-if="step === 'login'"
                            :disabled="isProcessing"
                            @input="onFormInput"
                        />

                        <TwoFactorCodeForm
                            v-else
                            v-model="twoFactorCode"
                            :disabled="isProcessing"
                        />

                        <ButtonSubmit
                            class="pt-8"
                            :disabled="!isValidForm"
                            @click="onLogin"
                        />
                    </form>
                </div>
            </div>

            <div
                class="mt-8 rounded-b-lg text-center p-4 w-full"
                :class="[
                    error ? 'bg-red-600 text-white' : 'bg-none text-transparent'
                ]"
            >
                {{ error ?? 'no error' }}
            </div>
        </div>
    </div>

    <PleaseWaitModal
        v-model="isProcessing"
    />
</template>

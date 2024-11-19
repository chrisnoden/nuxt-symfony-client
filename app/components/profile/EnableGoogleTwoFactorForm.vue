<script setup lang="ts">
import { FetchError } from 'ofetch';
import { ApiErrorService } from '~~/services/api-error-service';
import SecurityRepository from '~~/repositories/security-repository';
import InputTwoFactorCode from '~/components/form/compact/InputTwoFactorCode.vue';
import ButtonSubmit from '~/components/form/ButtonSubmit.vue';

const emit = defineEmits<{
    'enabled': [],
}>()

const security = new SecurityRepository();
const authCode = ref<string>('');
const error = ref<undefined|string>();
const notifications = useNotifications();

const onClickSubmit = async() => {
    error.value = undefined;
    try {
        await security.enableTwoFactor('google-authenticator', authCode.value);
        notifications.success('2FA has been enabled')
        emit('enabled');
    } catch (e) {
        if (e instanceof FetchError) {
            const ars = new ApiErrorService();
            ars.handle(e);
            error.value = ars.getFirstValidationError();
        }
    }
}
</script>

<template>
    <div class="flex w-full flex-col justify-center min-w-3xl">
        <p class="text-sm text-core-light-700 dark:text-core-dark-300 md:text-base">
            You will need an app for your phone or computer to
            <span class="font-bold">scan the QR code below</span> and then enter the 6 digit numeric
            code the app will provide.
        </p>
        <p class="text-sm text-core-light-700 dark:text-core-dark-300 md:text-base">
            Once enabled, every time you login you will need to provide a new 6 digit code from the app.
        </p>

        <p class="text-sm text-core-light-700 dark:text-core-dark-300 md:text-base"/><h3>App Recommendations</h3>

        <ul class="list-inside list-disc text-sm text-core-light-700 dark:text-core-dark-300">
            <li>
                <NuxtLink to="https://support.google.com/accounts/answer/1066447" target="_blank">Google Authenticator</NuxtLink>
            </li>
            <li>
                <NuxtLink to="https://1password.com/" target="_blank">1Password</NuxtLink>
            </li>
            <li>
                <NuxtLink to="https://authy.com/features/setup/" target="_blank">Authy</NuxtLink>
            </li>
        </ul>
        <div class="flex w-full flex-col items-center">
            <img
                :src="`/api/security/2fa/qr_code`"
                alt="qr code"
                width="320"
                height="320"
                class="h-auto w-[260px]"
            >

            <InputTwoFactorCode
                v-model="authCode"
                class="mt-4"
                :error="error"
            />
        </div>
    </div>

    <div class="self-center mt-8">
        <ButtonSubmit
            class="max-w-sm upp"
            :disabled="authCode.length < 6"
            @click="onClickSubmit"
        >
            Enable One-Time Password Security
        </ButtonSubmit>
    </div>

</template>

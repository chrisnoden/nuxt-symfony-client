<script setup lang="ts">
import FormModal from '~/components/modal/FormModal.vue';
import InputPassword from '~/components/form/compact/InputPassword.vue';
import SecurityRepository from '~~/repositories/security-repository';
import { FetchError } from 'ofetch';
import { ApiErrorService } from '~~/services/api-error-service';
import InputTwoFactorCode from '~/components/form/compact/InputTwoFactorCode.vue';
import ButtonSubmit from '~/components/form/ButtonSubmit.vue';

const visible = defineModel<boolean>();
const { user } = defineProps<{
    user?: UserType,
}>()
const emit = defineEmits<{
    'change': [],
}>()

const security = new SecurityRepository();
const authCode = ref<string>('');
const error = ref<undefined|string>();
const password = ref<string>('');
const notifications = useNotifications();

const onClickSubmit = async() => {
    error.value = undefined;
    try {
        if (user && user.twoFactorEnabled) {
            await security.disableTwoFactor(password.value);
            notifications.warning('2FA has been disabled')
        } else if (user && !user.twoFactorEnabled) {
            await security.enableTwoFactor(authCode.value);
            notifications.success('2FA has been enabled')
        }
        visible.value = false;
        emit('change');
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
    <FormModal
        v-if="user"
        v-model="visible"
        :title="`${user.twoFactorEnabled ? 'Disable' : 'Enable'} Two Factor Authentication`"
    >
        <div v-if="user.twoFactorEnabled">
            <p>
                It is highly recommended that you leave 2FA enabled. It improves the security of your
                account significantly
            </p>
            <p>
                If you wish to disable 2FA as part of your login, you must enter your account password below.
            </p>

            <div class="mt-4 border-t border-gray-200 pt-4">
                <InputPassword
                    v-model="password"
                    :error="error"
                />
            </div>
        </div>

        <div v-else class="w-full min-w-3xl flex flex-col justify-center">
            <p class="text-sm md:text-base text-core-light-700 dark:text-core-dark-300">
                You will need an app for your phone or computer to
                <span class="font-bold">scan the QR code below</span> and then enter the 6 digit numeric
                code the app will provide.
            </p>
            <p class="text-sm md:text-base text-core-light-700 dark:text-core-dark-300">
                Once enabled, everytime you login you will need to provide a new 6 digit code from the app.
            </p>

            <p class="text-sm md:text-base text-core-light-700 dark:text-core-dark-300"/><h3>App Recommendations</h3>

            <ul class="list-disc list-inside text-core-light-700 dark:text-core-dark-300 text-sm">
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
            <div class="w-full flex flex-col items-center">
                <img
                    v-if="visible"
                    :src="`/api/security/2fa/qr_code`"
                    alt="qr code"
                    width="320"
                    height="320"
                    class="w-[260px] h-auto"
                >

                <InputTwoFactorCode
                    v-model="authCode"
                    class="mt-4"
                    :error="error"
                />
            </div>
        </div>

        <div class="mt-8">
            <ButtonSubmit
                @click="onClickSubmit"
            >
                {{ user.twoFactorEnabled ? 'Disable' : 'Enable' }} 2FA
            </ButtonSubmit>
        </div>

    </FormModal>
</template>

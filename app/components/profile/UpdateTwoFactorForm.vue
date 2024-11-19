<script setup lang="ts">
import { FetchError } from 'ofetch';
import { ApiErrorService } from '~~/services/api-error-service';
import { defineAsyncComponent } from 'vue';
import SecurityRepository from '~~/repositories/security-repository';
import FormModal from '~/components/modal/FormModal.vue';
import InputPassword from '~/components/form/compact/InputPassword.vue';
import ButtonSubmit from '~/components/form/ButtonSubmit.vue';

const visible = defineModel<boolean>({ required: true });
const { user } = defineProps<{
    user?: UserType,
}>()
const emit = defineEmits<{
    'change': [],
}>()

const EnableGoogleTwoFactorForm = defineAsyncComponent(() => import('~/components/profile/EnableGoogleTwoFactorForm.vue'));
const EnableMagicLinkTwoFactorForm = defineAsyncComponent(() => import('~/components/profile/EnableMagicLinkTwoFactorForm.vue'));

const security = new SecurityRepository();
const error = ref<undefined | string>();
const chosenMethod = ref<TwoFactorMethodType>('disabled');
const password = ref<string>('');
const notifications = useNotifications();

const onCompleted = () => {
    visible.value = false;
    emit('change');
}

const onClickDisable = async () => {
    error.value = undefined;
    try {
        await security.disableTwoFactor(password.value);
        notifications.warning('2FA has been disabled')
        onCompleted()
    } catch (e) {
        if (e instanceof FetchError) {
            const ars = new ApiErrorService();
            ars.handle(e);
            error.value = ars.getFirstValidationError();
        }
    }
}

const currentMethod = computed(() => {
    switch (user?.twoFactorMethod) {
        case 'google-authenticator':
            return 'One Time Password (6 digit code)'

        case 'magic-link':
            return 'Email Magic Link';

        default:
            return 'disabled';
    }
})

watch(() => visible.value,
    () => {
        if (user?.twoFactorEnabled === false) {
            chosenMethod.value = 'disabled';
        }
    }
)

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
                You currently use a <span class="font-bold">{{ currentMethod }}</span> as your additional
                security step.
            </p>
            <p>
                If you wish to disable this additional security step you must enter your account password below.
            </p>

            <div class="mt-4 border-t border-gray-200 pt-4">
                <InputPassword
                    v-model="password"
                    :error="error"
                />
            </div>

            <div class="mt-8">
                <ButtonSubmit
                    @click="onClickDisable"
                >
                    Disable 2FA
                </ButtonSubmit>
            </div>

        </div>

        <div v-else-if="chosenMethod === 'disabled'" class="flex w-full flex-col justify-center min-w-3xl">
            Please choose which security method you prefer.

            <div class="mt-4 grid w-full grid-cols-2 gap-8">
                <div
                    class="flex w-full cursor-pointer flex-col items-center rounded-md border shadow-sm border-highlight-600 group hover:bg-highlight-500"
                    @click="chosenMethod = 'google-authenticator'"
                >
                    <div
                        class="w-full py-2 text-center text-sm font-semibold uppercase text-white bg-highlight-600 hover:bg-highlight-500">
                        One Time Password
                    </div>
                    <div
                        class="block rounded-b-md px-2 py-1 text-sm leading-tight bg-core-light-50 text-core-light-500 group-hover:bg-core-light-100 dark:bg-core-dark-950 dark:text-core-dark-500 dark:group-hover:bg-core-dark-900">
                        Use an app to generate a unique 6-digit code every time you login
                    </div>
                </div>

                <div
                    class="flex w-full cursor-pointer flex-col items-center rounded-md border shadow-sm border-highlight-600 group hover:bg-highlight-500"
                    @click="chosenMethod = 'magic-link'"
                >
                    <div
                        class="w-full py-2 text-center text-sm font-semibold uppercase text-white bg-highlight-600 hover:bg-highlight-500">
                        Magic Link
                    </div>
                    <div
                        class="block rounded-b-md px-2 py-1 text-left text-sm leading-tight bg-core-light-50 text-core-light-500 group-hover:bg-core-light-100 dark:bg-core-dark-950 dark:text-core-dark-500 dark:group-hover:bg-core-dark-900">
                        Complete your login by clicking on a link that will be emailed to you
                    </div>
                </div>
            </div>
        </div>

        <EnableGoogleTwoFactorForm
            v-else-if="chosenMethod === 'google-authenticator'"
            @enabled="onCompleted"
        />

        <EnableMagicLinkTwoFactorForm
            v-else-if="chosenMethod === 'magic-link'"
            @enabled="onCompleted"
        />

    </FormModal>
</template>

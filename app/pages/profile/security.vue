<script setup lang="ts">
import { defineAsyncComponent } from 'vue';
import SecurityRepository from '~~/repositories/security-repository';
import UpdatePasswordForm from '~/components/profile/UpdatePasswordForm.vue';
import UpdateEmailAddressForm from '~/components/profile/UpdateEmailAddressForm.vue';
import ProfileItemValue from '~/components/profile/ProfileItemValue.vue';

const UpdateTwoFactorForm = defineAsyncComponent(() => import('~/components/profile/UpdateTwoFactorForm.vue'));

const session = useSessionStore();
const key = ref<number>(0);
const showEmailModalHasBeenLoaded = ref<boolean>(false);
const showUpdateEmailForm = ref<boolean>(false);
const showPasswordModalHasBeenLoaded = ref<boolean>(false);
const showUpdatePasswordForm = ref<boolean>(false);
const modalHasBeenShown = ref<boolean>(false);
const showTwoFactorForm = ref<boolean>(false);
const user = ref(session.user);

const onDataChanged = async() => {
    const security = new SecurityRepository();
    const me = await security.session();
    showUpdatePasswordForm.value = false;
    showTwoFactorForm.value = false;
    showUpdateEmailForm.value = false;

    session.setSession(me);
    user.value = session.user;
    key.value += 1;
}

const onClickUpdateTwoFactor = () => {
    modalHasBeenShown.value = true;
    showTwoFactorForm.value = true;
}

const onClickShowEmailForm = () => {
    showEmailModalHasBeenLoaded.value = true;
    showUpdateEmailForm.value = true;
}

const onClickShowPasswordForm = () => {
    showPasswordModalHasBeenLoaded.value = true;
    showUpdatePasswordForm.value = true;
}
</script>

<template>
    <div>
        <h2 class="text-base font-semibold leading-7 text-gray-900 py-0">Security</h2>

        <dl class="mt-6 space-y-6 divide-y divide-gray-100 border-t border-gray-200 text-sm leading-6">
            <div class="pt-6 sm:flex">
                <ProfileItemLabel>Email address</ProfileItemLabel>
                <dd class="mt-1 flex justify-between gap-x-6 sm:mt-0 sm:flex-auto">
                    <ProfileItemValue>{{ session.email }}</ProfileItemValue>
                    <button
                        type="button"
                        class="font-semibold text-highlight-600 hover:text-highlight-500"
                        @click="onClickShowEmailForm"
                    >Update</button>
                </dd>
            </div>

            <div class="pt-6 sm:flex">
                <ProfileItemLabel>Password</ProfileItemLabel>
                <dd class="mt-1 flex justify-between gap-x-6 sm:mt-0 sm:flex-auto">
                    <ProfileItemValue class="text-gray-900">************</ProfileItemValue>
                    <button
                        type="button"
                        class="font-semibold text-highlight-600 hover:text-highlight-500"
                        @click="onClickShowPasswordForm"
                    >Update</button>
                </dd>
            </div>

            <div class="pt-6 sm:flex">
                <ProfileItemLabel>2FA Enabled</ProfileItemLabel>
                <dd class="mt-1 flex justify-between gap-x-6 sm:mt-0 sm:flex-auto">
                    <ProfileItemValue class="text-gray-900">{{ session.twoFactorEnabled ? 'YES' : 'NO' }}</ProfileItemValue>
                    <button
                        type="button" class="font-semibold text-highlight-600 hover:text-highlight-500"
                        @click="onClickUpdateTwoFactor"
                    >Update</button>
                </dd>
            </div>
        </dl>
    </div>

    <UpdateTwoFactorForm
        v-if="modalHasBeenShown"
        :key="key"
        v-model="showTwoFactorForm"
        :user="user"
        @change="onDataChanged"
    />

    <UpdateEmailAddressForm
        v-if="showEmailModalHasBeenLoaded"
        :key="key"
        v-model="showUpdateEmailForm"
        :user="user"
        @change="onDataChanged"
    />

    <UpdatePasswordForm
        v-if="showPasswordModalHasBeenLoaded"
        :key="key"
        v-model="showUpdatePasswordForm"
        :user="user"
        @change="onDataChanged"
    />
</template>

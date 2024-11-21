<script setup lang="ts">
import { FetchError } from 'ofetch';
import SecurityRepository from '~~/repositories/security-repository';
import PleaseWaitModal from '~/components/modal/PleaseWaitModal.vue';
import SecurityLogo from '~/components/security/SecurityLogo.vue';

definePageMeta({
    layout: 'minimal'
})

const security = new SecurityRepository();

const token = useCookie('emailConfirmToken');
const error = ref<undefined | string>();
const isProcessing = ref<boolean>(true);
const router = useRouter();

const onConfirmEmail = async () => {
    isProcessing.value = true;
    error.value = undefined;
    if (undefined === token.value || null === token.value) {
        error.value = 'invalid request';
    } else {
        try {
            await security.confirmEmail(token.value);
            token.value = undefined;
        } catch (e) {
            if (e instanceof FetchError) {
                error.value = e.data.message;
            }
        }
    }

    isProcessing.value = false;
}

onMounted(() => {
    onConfirmEmail();
})

// Parse the token from the querystring and store in a temp cookie, then remove it from the querystring
if (undefined !== queryPropAsString('token')) {
    token.value = queryPropAsString('token');
    router.replace('/security/confirm-email');
}
</script>

<template>
    <div
        class="flex flex-1 flex-col justify-center py-12 sm:px-6 lg:px-8"
    >
        <div
            v-if="!isProcessing"
            class="mx-auto mb-36 w-full max-w-2xl rounded-lg border"
            :class="[
                error ? 'border-red-600' : 'border-none',
            ]"
        >
            <div class="px-6 pt-8 sm:px-16">
                <SecurityLogo />

                <div
                    v-if="!error"
                    class="mt-10 sm:mx-auto sm:w-full sm:max-w-sm"
                >
                    <h2 class="uppercase">
                        Thank you!
                    </h2>

                    <p>
                        Your email address is confirmed and can be used to login from this moment on.
                    </p>
                </div>

                <div
                    v-else
                    class="mt-10 text-center font-bold uppercase text-red-600 sm:mx-auto sm:w-full sm:max-w-md"
                >
                    Your email change request may have expired!
                </div>
            </div>

            <div
                class="mt-4 w-full rounded-b-lg p-4 text-center"
                :class="[
                    error ? 'bg-red-600 text-white' : 'bg-none text-transparent'
                ]"
            >ERROR
            </div>
        </div>
    </div>

    <PleaseWaitModal
        v-model="isProcessing"
    />
</template>

<script setup lang="ts">
import PleaseWaitModal from '~/components/modal/PleaseWaitModal.vue';
import Logo from '~/components/branding/Logo.vue';
import SecurityRepository from '~~/repositories/security-repository';
import { FetchError } from 'ofetch';

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
        class="flex flex-1 flex-col justify-center sm:px-6 py-12 lg:px-8"
    >
        <div
            v-if="!isProcessing"
            class="border rounded-lg w-full max-w-2xl mx-auto mb-36"
            :class="[
                error ? 'border-red-600' : 'border-none',
            ]"
        >
            <div class="px-6 sm:px-16 pt-8">
                <div class="sm:mx-auto">
                    <Logo />
                </div>

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
                    class="mt-10 sm:mx-auto sm:w-full sm:max-w-md uppercase text-red-600 font-bold text-center"
                >
                    Your email change request may have expired!
                </div>
            </div>

            <div
                class="mt-4 rounded-b-lg text-center p-4 w-full"
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

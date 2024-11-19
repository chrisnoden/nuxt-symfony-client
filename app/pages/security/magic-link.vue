<script setup lang="ts">
import SecurityRepository from '~~/repositories/security-repository';
import Logo from '~/components/branding/Logo.vue';
import PleaseWaitModal from '~/components/modal/PleaseWaitModal.vue';

definePageMeta({
    layout: 'minimal'
})

const security = new SecurityRepository();

const error = ref<undefined | string>();
const isProcessing = ref<boolean>(true);
const router = useRouter();

const completeLogin = async() => {
    const token = queryPropAsString('token');
    if (undefined === token) {
        error.value = 'no token in URL';
    } else {
        const response = await security.twoFactorAuth(token);

        if (response.login === 'success' && response.two_factor_complete) {
            await router.push('/');
        } else {
            error.value = 'invalid code, try again';
        }
    }

    isProcessing.value = false;
}


onMounted(() => {
    completeLogin();
})
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
                <div class="mx-auto">
                    <Logo/>
                </div>

                <div
                    v-if="!error"
                    class="mt-10 sm:mx-auto sm:w-full sm:max-w-sm"
                >
                    <h2 class="uppercase">
                        Thank you!
                    </h2>

                    <p>
                        Completing login.....
                    </p>
                </div>

                <div
                    v-else
                    class="mt-10 sm:mx-auto sm:w-full sm:max-w-md uppercase text-red-600 font-bold text-center"
                >
                    Your login may have expired!
                </div>
            </div>

            <div
                class="mt-4 rounded-b-lg text-center p-4 w-full"
                :class="[
                    error ? 'bg-red-600 text-white' : 'bg-none text-transparent'
                ]"
            >
                ERROR
            </div>
        </div>
    </div>

    <PleaseWaitModal
        v-model="isProcessing"
    />
</template>

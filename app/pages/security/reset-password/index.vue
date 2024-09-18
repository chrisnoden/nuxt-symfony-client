<script setup lang="ts">
import ButtonSubmit from '~/components/form/ButtonSubmit.vue';
import Logo from '~/components/branding/Logo.vue';
import InputEmail from '~/components/form/compact/InputEmail.vue';
import SecurityRepository from '~~/repositories/security-repository';
import { FetchError } from 'ofetch';
import PleaseWaitModal from '~/components/modal/PleaseWaitModal.vue';

definePageMeta({
    layout: 'minimal'
})

const security = new SecurityRepository();

const email = ref<string>('');
const error = ref<undefined | string>();
const isProcessing = ref<boolean>(false);
const router = useRouter();

const onSubmitClick = async () => {
    isProcessing.value = true;

    try {
        await security.resetPasswordBegin(email.value);
        await router.push('/security/reset-password/sent');
    } catch (e) {
        if (e instanceof FetchError) {
            error.value = e.data.message;
        }
    }

    isProcessing.value = false;
}

const isValidForm = computed(() => (email.value.length > 4));
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
            <div class="px-6 sm:px-16 py-8">
                <div class="mx-auto">
                    <Logo/>
                </div>


                <div class="sm:mx-auto sm:w-full sm:max-w-sm text-center">
                    <h1 class="text-core-light-800 dark:text-core-dark-200">Reset Password</h1>

                    <p class="text-core-light-700 dark:text-core-dark-300">Please enter your login email address below.</p>

                    <form class="my-10" @submit="onSubmitClick">
                        <InputEmail
                            v-model="email"
                        />

                        <ButtonSubmit
                            class="pt-8"
                            :disabled="!isValidForm"
                            @click="onSubmitClick"
                        />
                    </form>
                </div>

            </div>

            <div
                class="rounded-b-lg text-center p-4 w-full"
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

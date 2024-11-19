<script setup lang="ts">
import { FetchError } from 'ofetch';
import { ApiErrorService } from '~~/services/api-error-service';
import SecurityRepository from '~~/repositories/security-repository';
import ButtonSubmit from '~/components/form/ButtonSubmit.vue';

const emit = defineEmits<{
    'enabled': [],
}>()

const security = new SecurityRepository();
const error = ref<undefined|string>();
const notifications = useNotifications();

const onClickSubmit = async() => {
    error.value = undefined;
    try {
        await security.enableTwoFactor('magic-link');
        notifications.success('Magic Link has been enabled')
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
            Once enabled, as part of each login, you will be emailed a link which you must click.
        </p>
    </div>

    <div class="self-center mt-8">
        <ButtonSubmit
            class="max-w-sm"
            @click="onClickSubmit"
        >
            Enable Magic Link
        </ButtonSubmit>
    </div>

</template>

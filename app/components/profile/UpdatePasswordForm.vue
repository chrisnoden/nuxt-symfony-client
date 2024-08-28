<script setup lang="ts">
import { ApiErrorService } from '~~/services/api-error-service';
import { FetchError } from 'ofetch';
import ButtonSubmit from '~/components/form/ButtonSubmit.vue';
import ConfirmChangesPassword from '~/components/profile/ConfirmChangesPassword.vue';
import FormModal from '~/components/modal/FormModal.vue';
import SecurityRepository from '~~/repositories/security-repository';
import InputPassword from '~/components/form/compact/InputPassword.vue';

const { user } = defineProps<{
    user?: UserType,
}>()
const emit = defineEmits<{
    'change': [],
}>()

const security = new SecurityRepository();
const error = ref<undefined | string>();
const password = ref<string>('');
const newPassword = ref<string>('');
const confirmPassword = ref<string>('');
const isProcessing = ref<boolean>(false);
const notifications = useNotifications();
const visible = ref<boolean>(true);

const onClickSubmit = async () => {
    isProcessing.value = true;
    error.value = undefined;
    try {
        await security.setUserPassword(password.value, newPassword.value);
        visible.value = false;
        notifications.info('Your password has been changed');
        emit('change');
    } catch (e) {
        if (e instanceof FetchError) {
            const ars = new ApiErrorService();
            ars.handle(e);
            error.value = ars.getFirstValidationError();
        }

        isProcessing.value = false;
    }
}

const canSubmitForm = computed(
    () => newPassword.value.length >= 7
        && password.value.length >= 8
        && newPassword.value === confirmPassword.value
);
</script>

<template>
    <FormModal
        v-if="user"
        v-model="visible"
        title="Change Your Password"
    >
        <div class="space-y-8">
            <InputPassword
                v-model="newPassword"
                label="New Password"
                name="new-password"
            />

            <InputPassword
                v-model="confirmPassword"
                label="Repeat New Password"
                name="confirm-password"
            />
        </div>

        <ConfirmChangesPassword v-model="password"/>

        <div class="mt-8">
            <ButtonSubmit
                :disabled="!canSubmitForm"
                :is-processing="isProcessing"
                @click="onClickSubmit"
            >
                Save Changes
            </ButtonSubmit>
        </div>

    </FormModal>
</template>

<script setup lang="ts">
import { ApiErrorService } from '~~/services/api-error-service';
import { FetchError } from 'ofetch';
import ButtonSubmit from '~/components/form/ButtonSubmit.vue';
import ConfirmChangesPassword from '~/components/profile/ConfirmChangesPassword.vue';
import FormModal from '~/components/modal/FormModal.vue';
import InputCommon from '~/components/form/compact/InputCommon.vue';
import SecurityRepository from '~~/repositories/security-repository';

const { user } = defineProps<{
    user?: UserType,
}>()
const emit = defineEmits<{
    'change': [],
}>()

const security = new SecurityRepository();
const error = ref<undefined | string>();
const email = ref<string>('');
const password = ref<string>('');
const isProcessing = ref<boolean>(false);
const notifications = useNotifications();
const visible = ref<boolean>(true);

const onClickSubmit = async () => {
    isProcessing.value = true;
    error.value = undefined;
    try {
        await security.setUserEmail(email.value, password.value);
        visible.value = false;
        notifications.info('Please check your email inbox to complete the change');
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

const canSubmitForm = computed(() => email.value.length >= 4 && password.value.length >= 8);
</script>

<template>
    <FormModal
        v-if="user"
        v-model="visible"
        title="Update Your Email Address"
    >
        <p class="text-red-700 pb-6">
            Email change will not be completed until you click a link sent to your new email address
        </p>
        <div>
            <InputCommon
                v-model="email"
                name="email"
                label="New Email Address"
                :error="error"
                type="email"
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

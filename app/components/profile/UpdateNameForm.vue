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
const name = ref<string>(user?.name ?? '');
const password = ref<string>('');
const isProcessing = ref<boolean>(false);
const notifications = useNotifications();
const visible = ref<boolean>(true);

const onClickSubmit = async () => {
    isProcessing.value = true;
    error.value = undefined;
    try {
        await security.setUserName(name.value, password.value);
        visible.value = false;
        notifications.info('Your details have been changed');
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

const canSubmitForm = computed(() => name.value.length >= 6 && password.value.length >= 8);
</script>

<template>
    <FormModal
        v-if="user"
        v-model="visible"
        title="Update Your Name"
    >
        <div>
            <InputCommon
                v-model="name"
                name="name"
                label="Full Name"
                :error="error"
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

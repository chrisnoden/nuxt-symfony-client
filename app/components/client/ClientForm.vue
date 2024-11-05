<script setup lang="ts">
import { cloneDeep, merge } from 'lodash-es';
import { FetchError } from 'ofetch';
import { ApiErrorService } from '~~/services/api-error-service';
import ClientRepository from '~~/repositories/client-repository';
import InputCommon from '~/components/form/InputCommon.vue';
import InputEnabledYesNo from '~/components/form/InputEnabledYesNo.vue';
import PleaseWaitModal from '~/components/modal/PleaseWaitModal.vue';

const editable = defineModel<boolean>('editable');
const client = defineModel<ClientType|ClientNewType>({ required: true });

const props = defineProps<{
    isNew?: boolean,
}>()
const emit = defineEmits<{
    'saved': [user: ClientType],
}>()

const clients = new ClientRepository();
const errors = new ApiErrorService();
const isSaving = ref<boolean>(false);

// The data we will modify is a clone of the original user data
const data = reactive<ClientType|ClientNewType>(cloneDeep(client.value));

const onClickCancel = () => {
    // reset the visible data to the saved user data
    merge(data, client.value);
    errors.clear();
}

const onClickSave = async() => {
    isSaving.value = true;
    errors.clear();
    const notifications = useNotifications();

    try {
        let c:ClientType;
        if (props.isNew) {
            // create a new client
            c = await clients.create(data as ClientNewType);
            notifications.success('User created');
        } else {
            c = await clients.update(data as ClientType);
            client.value = c;
            notifications.success('User data successfully updated');
            editable.value = false;
        }

        emit('saved', c);
    } catch (e) {
        if (e instanceof FetchError) {
            errors.handle(e);
        }
    } finally {
        isSaving.value = false;
    }
}

defineExpose({
    onClickCancel,
    onClickSave,
})
</script>

<template>
    <form
        v-if="data"
        class="mx-auto max-w-3xl"
    >
        <div class="space-y-12 sm:space-y-16">
            <div class="border-b border-gray-900/10 pb-12 space-y-8 sm:space-y-0 sm:divide-y sm:divide-gray-900/10 sm:border-t sm:pb-0">

                <InputEnabledYesNo
                    v-if="client.id !== 1"
                    v-model="data.enabled"
                    :disabled="!editable"
                    label="Enabled"
                    name="enabled"
                />

                <InputCommon
                    v-model="data.companyName"
                    :disabled="!editable"
                    :errors="errors.validationErrors.value"
                    label="Company Name"
                    name="companyName"
                    required
                />

            </div>
        </div>
    </form>

    <PleaseWaitModal v-model="isSaving" />
</template>

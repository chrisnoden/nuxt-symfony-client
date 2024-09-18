<script setup lang="ts">
import { cloneDeep, merge } from 'lodash-es';
import { FetchError } from 'ofetch';
import { ApiErrorService } from '~~/services/api-error-service';
import UserRepository from '~~/repositories/user-repository';
import ClientSelect from '~/components/form/ClientSelect.vue';
import InputCommon from '~/components/form/InputCommon.vue';
import InputEnabledYesNo from '~/components/form/InputEnabledYesNo.vue';
import PleaseWaitModal from '~/components/modal/PleaseWaitModal.vue';
import RoleSelectGroup from '~/components/form/RoleSelectGroup.vue';

const editable = defineModel<boolean>('editable');
const user = defineModel<UserType|UserNewType>({ required: true });

const props = defineProps<{
    isNew?: boolean,
}>()
const emit = defineEmits<{
    'saved': [user: UserType],
}>()

const errors = new ApiErrorService();
const isSaving = ref<boolean>(false);
const session = useSessionStore();
const users = new UserRepository();

// The data we will modify is a clone of the original user data
const data = reactive<UserType|UserNewType>(cloneDeep(user.value));

const onClickCancel = () => {
    // reset the visible data to the saved user data
    merge(data, user.value);
    errors.clear();
}

const onClickSave = async() => {
    isSaving.value = true;
    errors.clear();
    const notifications = useNotifications();

    try {
        let u:UserType;
        if (props.isNew) {
            // create a new user
            u = await users.create(<UserNewType>data);
            notifications.success('User created');
        } else {
            u = await users.update(<UserType>data);
            user.value = u;
            notifications.success('User data successfully updated');
            editable.value = false;
        }

        emit('saved', u);
    } catch (e) {
        if (e instanceof FetchError) {
            errors.handle(e);
        }
    } finally {
        isSaving.value = false;
    }
}

const showClientSelect = computed((): boolean => (session.client?.id === 1 && hasRole('ROLE_CLIENT_ADMINISTRATION')));

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
                    v-model="data.enabled"
                    :disabled="!editable"
                    label="Enabled"
                    name="enabled"
                />

                <ClientSelect
                    v-if="showClientSelect"
                    v-model="data.client"
                    :disabled="!editable"
                />

                <InputCommon
                    v-model="data.name"
                    :disabled="!editable"
                    :errors="errors.validationErrors.value"
                    label="Name"
                    name="name"
                    required
                />

                <InputCommon
                    v-model="data.email"
                    :disabled="!editable"
                    :errors="errors.validationErrors.value"
                    label="Email address"
                    name="email"
                    type="email"
                    required
                />

                <RoleSelectGroup
                    v-model="data.roles"
                    :disabled="!editable"
                    :errors="errors.validationErrors.value"
                />
            </div>
        </div>
    </form>

    <PleaseWaitModal v-model="isSaving" />
</template>

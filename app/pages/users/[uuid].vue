<script setup lang="ts">
import { useTemplateRef } from 'vue'
import UserRepository from '~~/repositories/user-repository';
import EntityDetail from '~/components/framework/EntityDetail.vue';
import UserForm from '~/components/user/UserForm.vue';

type UserFormType = InstanceType<typeof UserForm>;

const pageTitle = 'Modify User Data';

definePageMeta({
    title: 'Modify User Data'
})

const editable = ref<boolean>(false);
const formRef = useTemplateRef<UserFormType>('form');
const user = ref<UserType>();

const fetchData = async() => {
    const route = useRoute();
    const users = new UserRepository();
    const { uuid } = route.params;
    const u = await users.find(`${uuid}`);

    if (undefined !== u) {
        user.value = u;
    }
}

fetchData();
</script>

<template>
    <Title>{{ pageTitle }}</Title>
    <PageTitle>{{ pageTitle }}</PageTitle>

    <EntityDetail
        v-model:editable="editable"
        can-edit
        @click-cancel="formRef?.onClickCancel()"
        @click-save="formRef?.onClickSave()"
    >
        <template #sidebar>
            <div
                v-if="editable"
                class="text-sm text-core-light-600 dark:text-core-dark-400"
            >
                Changing the email address will cause an email to be sent to the new email for validation
            </div>

            <div
                v-if="!editable && user?.active === false"
                class="text-sm text-amber-600 dark:text-amber-400 font-bold space-y-4"
            >
                <div>
                    User has not activated their account. They should have received an email
                    with a link to activate and set their password.
                </div>
                <div>
                    Alternatively, they can use the "Forgot Password" link on the login screen.
                </div>
            </div>
        </template>

        <UserForm
            v-if="user"
            ref="form"
            v-model="user"
            v-model:editable="editable"
        />

    </EntityDetail>
</template>

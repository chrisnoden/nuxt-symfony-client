<script setup lang="ts">
import { useTemplateRef } from 'vue'
import EntityDetail from '~/components/framework/EntityDetail.vue';
import UserForm from '~/components/user/UserForm.vue';

type UserFormType = InstanceType<typeof UserForm>;

const pageTitle = 'Create New User';

definePageMeta({
    title: 'Create New User'
})

const editable = ref<boolean>(true);
const formRef = useTemplateRef<UserFormType>('form');
const router = useRouter();
const session = useSessionStore();
const user = reactive<UserNewType>({
    client: session.client,
    name: undefined,
    email: undefined,
    roles: [],
    enabled: false,
});

const onCreated = async(newUser: UserType) => {
    await router.push(`/users/${newUser.id}`);
}
</script>

<template>
    <Title>{{ pageTitle }}</Title>
    <PageTitle>{{ pageTitle }}</PageTitle>

    <EntityDetail
        v-model:editable="editable"
        is-new
        @click-cancel="router.back()"
        @click-save="formRef?.onClickSave()"
    >
        <template #sidebar>
            <div
                v-if="editable"
                class="text-sm text-core-light-600 dark:text-core-dark-400"
            >
                an email to be sent to the new user to activate their account and set their password
            </div>
        </template>

        <UserForm
            ref="form"
            v-model="user"
            v-model:editable="editable"
            is-new
            @saved="onCreated"
        />

    </EntityDetail>
</template>

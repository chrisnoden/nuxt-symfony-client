<script setup lang="ts">
import { useTemplateRef } from 'vue'
import ClientForm from '~/components/client/ClientForm.vue';
import EntityDetail from '~/components/framework/EntityDetail.vue';

type ClientFormType = InstanceType<typeof ClientForm>;

const pageTitle = 'Create New Client';

definePageMeta({
    title: 'Create New Client'
})

const editable = ref<boolean>(true);
const formRef = useTemplateRef<ClientFormType>('form');
const router = useRouter();
const client = reactive<ClientNewType>({
    companyName: undefined,
    enabled: false,
});

const onCreated = async(newClient: ClientType) => {
    await router.push(`/clients/${newClient.id}`);
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

        <ClientForm
            ref="form"
            v-model="client"
            v-model:editable="editable"
            is-new
            @saved="onCreated"
        />

    </EntityDetail>
</template>

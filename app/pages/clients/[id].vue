<script setup lang="ts">
import { useTemplateRef } from 'vue'
import ClientRepository from '~~/repositories/client-repository';
import ClientForm from '~/components/client/ClientForm.vue';
import EntityDetail from '~/components/framework/EntityDetail.vue';

type ClientFormType = InstanceType<typeof ClientForm>;

const pageTitle = 'Modify Client Data';

definePageMeta({
    title: 'Modify Client Data'
})

const editable = ref<boolean>(false);
const formRef = useTemplateRef<ClientFormType>('form');
const client = ref<ClientType>();

const fetchData = async() => {
    const route = useRoute();
    const clients = new ClientRepository();
    const { id } = route.params;
    const c = await clients.find(parseInt(`${id}`, 10));

    if (undefined !== c) {
        client.value = c;
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
                v-if="!editable && client?.enabled === false"
                class="text-sm font-bold text-amber-600 space-y-4 dark:text-amber-400"
            >
                <div>
                    Clients users are unable to login while the client is disabled.
                </div>
            </div>
        </template>

        <ClientForm
            v-if="client"
            ref="form"
            v-model="client"
            v-model:editable="editable"
        />

    </EntityDetail>
</template>

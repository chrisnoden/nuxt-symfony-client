<script setup lang="ts">
import { columns } from './columns'
import ClientRepository from '~~/repositories/client-repository';
import DataTable from '~/components/datatable/DataTable.vue'

definePageMeta({
    title: 'Client Admin'
})

const router = useRouter();
const clientRepository = new ClientRepository();

const onClickNew = async() => {
    await router.push('/clients/create');
}

const onRowDblClick = async(c: ClientType) => {
    await router.push(`/clients/${c.id}`);
}
</script>

<template>
    <Title>Client Admin</Title>

    <div>
        <PageTitle>
            Client Admin
            <template #text>Create, edit or delete clients. Double click any row to edit</template>
        </PageTitle>

        <main>
            <DataTable
                :api-service="clientRepository"
                :columns="columns"
                default-sort-field="name"
                double-click
                show-new-button
                @click-new="onClickNew"
                @double-click="onRowDblClick"
            />
        </main>
    </div>
</template>

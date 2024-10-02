<script setup lang="ts">
import UserRepository from '~~/repositories/user-repository';
import { columns } from './columns'
import DataTable from '~/components/datatable/DataTable.vue'
import QuickSearchFilter from '~/components/datatable/filters/QuickSearchFilter.vue';

definePageMeta({
    title: 'User Admin'
})

const router = useRouter();
const session = useSessionStore();
const userRepository = new UserRepository();

const onClickNew = async() => {
    await router.push('/users/create');
}

const onRowDblClick = async(u: UserType) => {
    if (u.id !== session.user?.id) {
        await router.push(`/users/${u.id}`);
    }
}

const rowClass = (row: UserType): string[] => {
    const classes: string[] = [];
    if (session.user?.id === row.id) {
        classes.push('italic', 'disabled');
    }
    if (!row.active) {
        classes.push('font-bold','!text-red-600');
    }

    return classes;
}
</script>

<template>
    <Title>User Admin</Title>

    <div>
        <PageTitle>
            User Admin
            <template #text>Create, edit or delete users. Double click any row to edit that user.</template>
        </PageTitle>

        <main>
            <DataTable
                :api-service="userRepository"
                :columns="columns"
                default-sort-field="name"
                double-click
                :row-class="rowClass"
                show-new-button
                @click-new="onClickNew"
                @double-click="onRowDblClick"
            >
                <template #filters>
                    <QuickSearchFilter />
                </template>
            </DataTable>
        </main>
    </div>
</template>

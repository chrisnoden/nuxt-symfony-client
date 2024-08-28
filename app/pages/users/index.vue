<script setup lang="ts">
import UserRepository from '~~/repositories/user-repository';
import DataTable from '~/components/datatable/DataTable.vue';
import TrueFalseColumn from '~/components/datatable/column-types/TrueFalseColumn.vue';

definePageMeta({
    title: 'User Admin'
})

const router = useRouter();
const session = useSessionStore();
const userRepository = new UserRepository();

let idx: number = 1;
const columns:DataTableColumnType[] = [
    {
        id: idx++,
        props: {
            header: 'ID',
            field: 'id',
        },
        hideFromChooser: true,
        dataKey: true,
        sortable: true,
        visible: false,
    },
    {
        id: idx++,
        props: {
            header: 'Client',
            field: 'client.name',
        },
        hideFromChooser: (undefined !== session.client && session.client?.id > 1),
        sortable: false,
        visible: session.client?.id === 1,
    },
    {
        id: idx++,
        props: {
            header: 'Name',
            field: 'name',
        },
        sortable: true,
        visible: true,
    },
    {
        id: idx++,
        props: {
            header: 'Email',
            field: 'email',
        },
        sortable: true,
        visible: true,
    },
    {
        id: idx++,
        props: {
            header: 'Enabled',
            class: 'text-center',
            field: 'enabled',
        },
        component: TrueFalseColumn,
        visible: true,
        width: 88,
    },
    {
        id: idx++,
        props: {
            header: '2FA',
            class: 'text-center',
            field: 'twoFactorEnabled',
        },
        component: TrueFalseColumn,
        visible: true,
        width: 80,
    },
    {
        id: idx++,
        props: {
            header: 'Active',
            class: 'text-center',
            field: 'active',
        },
        component: TrueFalseColumn,
        visible: false,
        width: 80,
    },
    {
        id: idx++,
        props: {
            header: 'You',
            class: 'text-center',
            activeClass: 'text-green-800 bg-green-200',
            inactiveClass: 'hidden',
            value: (data: UserType) => (data.id === session.user?.id),
        },
        component: TrueFalseColumn,
        visible: false,
        width: 80,
    },
]

const onClickNew = async() => {
    await router.push('/users/create');
}

const onRowDblClick = async(e: UserType) => {
    await router.push(`/users/${e.id}`);
}

const rowClass = (row: UserType): string[] => {
    const classes: string[] = [];
    if (session.user?.id === row.id) {
        classes.push('italic');
    }
    if (row.active === false) {
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
                v-model="columns"
                :api-service="userRepository"
                default-sort-field="name"
                double-click
                :row-class="rowClass"
                show-new-button
                @click-new="onClickNew"
                @double-click="onRowDblClick"
            />
        </main>
    </div>
</template>

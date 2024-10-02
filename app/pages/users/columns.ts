import { h } from 'vue'
import type { ColumnDef } from '@tanstack/vue-table'
import TrueFalseColumn from '~/components/datatable/column-types/TrueFalseColumn.vue';

export const columns: ColumnDef<UserType>[] = [
    {
        accessorKey: 'id',
        header: 'UUID',
        meta: {
            defaultVisible: false,
        },
    },
    {
        accessorKey: 'client.companyName',
        accessorFn: ((row: UserType) => row.client.name),
        header: 'Client',
    },
    {
        accessorKey: 'name',
        header: 'Name',
    },
    {
        accessorKey: 'email',
        header: 'Email',
    },
    {
        accessorKey: 'enabled',
        size: 100,
        header: () => h('div', { class: 'text-center' }, 'Enabled'),
        cell: ({ row }) => h(TrueFalseColumn, {
            value: row.getValue('enabled') === true,
        }),
        enableSorting: false,
    },
    {
        accessorKey: 'twoFactorEnabled',
        size: 100,
        header: () => h('div', { class: 'text-center' }, '2FA'),
        cell: ({ row }) => h(TrueFalseColumn, {
            value: row.getValue('enabled') === true,
        }),
        enableSorting: false,
    },
]

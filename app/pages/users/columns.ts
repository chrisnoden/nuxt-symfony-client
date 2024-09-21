import { h } from 'vue'
import type { ColumnDef } from '@tanstack/vue-table'
import TrueFalseColumn from '~/components/datatable/column-types/TrueFalseColumn.vue';

export const columns: ColumnDef<UserType>[] = [
    {
        accessorKey: 'id',
        header: () => h('div', { }, 'UUID'),
        meta: {
            defaultVisible: false,
        }
    },
    {
        accessorKey: 'client',
        accessorFn: ((row: UserType) => row.client.name),
        header: () => h('div', { }, 'Client'),
    },
    {
        accessorKey: 'name',
        header: () => h('div', { }, 'Name'),
    },
    {
        accessorKey: 'email',
        header: () => h('div', { }, 'Email'),
    },
    {
        accessorKey: 'enabled',
        enableResizing: true,
        size: 100,
        header: () => h('div', { class: 'text-center' }, 'Enabled'),
        cell: ({ row }) => h('div', { class: '' },
            h(TrueFalseColumn, {
                value: row.getValue('enabled') === true,
            }))
    },
    {
        accessorKey: 'twoFactorEnabled',
        size: 100,
        header: () => h('div', { class: 'text-center' }, '2FA'),
        cell: ({ row }) => h(TrueFalseColumn, {
            value: row.getValue('enabled') === true,
        })
    },
]

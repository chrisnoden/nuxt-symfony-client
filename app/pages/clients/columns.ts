import { h } from 'vue'
import type { ColumnDef } from '@tanstack/vue-table'
import TrueFalseColumn from '~/components/datatable/column-types/TrueFalseColumn.vue';

export const columns: ColumnDef<ClientType>[] = [
    {
        accessorKey: 'id',
        header: 'ID',
    },
    {
        accessorKey: 'companyName',
        accessorFn: ((row: ClientType) => row.companyName),
        header: 'Company Name',
    },
    {
        accessorKey: 'enabled',
        enableResizing: true,
        size: 100,
        header: () => h('div', { class: 'text-center' }, 'Enabled'),
        cell: ({ row }) => h('div', { class: '' },
            h(TrueFalseColumn, {
                value: row.getValue('enabled') === true,
            })
        ),
        enableSorting: false,
    },
]

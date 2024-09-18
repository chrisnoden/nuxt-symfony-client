<script setup lang="ts" generic="TData, TValue">
import type {
    ColumnDef,
    Header,
    Row,
} from '@tanstack/vue-table'
import { useStorage } from '@vueuse/core';
import { DatatableService } from '~~/services/datatable-service';
import {
    FlexRender,
} from '@tanstack/vue-table'
import { ArrowPathIcon } from '@heroicons/vue/24/outline';
import ColumnChooser from '~/components/datatable/ColumnChooser.vue';
import Pagination from '~/components/datatable/Pagination.vue';

const props = defineProps<{
    apiService: DataTableAwareApiClientContract<TData>,
    columns: ColumnDef<TData, TValue>[],
    doubleClick?: boolean,
    defaultSortField?: string,
    entity: string,
    hideColumnChooser?: boolean,
    // eslint-disable-next-line no-unused-vars
    rowClass?: (row: TData) => string|string[],
    selectable?: boolean,
    showNewButton?: boolean,
}>()
const emit = defineEmits<{
    clickNew: [],
    doubleClick: [row: TData],
    selectionChange: [selectedRows: TData[]],
}>()

const datatable = new DatatableService<TData, TValue>(props.apiService, props.columns, {
    defaultSortField: props.defaultSortField,
});

const dt = ref();
const selectedRows = ref([]);
const state = useStorage(`dt-${props.entity}`, {
    id: false,
})
await datatable.initialise();


const styles = (header: Header<TData, unknown>): string => {
    const arr = [];

    if (header.getSize() !== 150) {
        arr.push(`width: ${header.getSize()}px`);
    }

    return arr.join(' ');
}

const onDoubleClick = (row: Row<TData>) => {
    if (props.doubleClick) {
        emit('doubleClick', row.original);
    }
}

onMounted(() => {
    datatable.initialise();
})
</script>

<template>
    <div class="relative mx-auto max-w-screen-2xl py-4 lg:py-0">
        <slot name="header">
            <div class="relative mb-2 grid grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 xl:gap-6">
                <div
                    class="flex flex-row items-center justify-end gap-1"
                    style="grid-column-end: -1;"
                >
                    <div
                        class="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-core-light-50 group hover:bg-core-light-100 dark:bg-core-dark-950 dark:hover:bg-core-dark-900"
                        @click="datatable.reload"
                    >
                        <ArrowPathIcon
                            class="h-6 w-6 text-highlight-300 group-hover:text-highlight-600"
                        />
                    </div>

                    <ColumnChooser
                        v-if="hideColumnChooser !== true"
                        :model-value="datatable.getAllColumns()"
                        class="flex-1"
                        @update:model-value="datatable.renderKey.value += 1"
                    />

                    <button
                        v-if="showNewButton"
                        type="button"
                        class="flex w-fit justify-center rounded-md px-3 text-sm font-semibold uppercase leading-6 text-white shadow-sm bg-highlight-500 py-1.5 hover:bg-highlight-600 focus-visible:outline-highlight-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
                        @click.prevent="$emit('clickNew')"
                    >
                        + {{ entity ?? 'new' }}
                    </button>
                </div>
            </div>
        </slot>

        <div class="border rounded-md">
            <table ref="dt" class="datatable">

                <thead>
                    <tr
                        v-for="headerGroup in datatable.getHeaderGroups()"
                        :key="headerGroup.id"
                    >
                        <th
                            v-for="header in headerGroup.headers"
                            :key="header.id"
                            :style="styles(header)"
                        >
                            <FlexRender
                                v-if="!header.isPlaceholder"
                                :render="header.column.columnDef.header"
                                :props="header.getContext()"
                            />
                        </th>
                    </tr>
                </thead>

                <tbody>
                    <template v-if="datatable.getRowModel().rows?.length">
                        <tr
                            v-for="row in datatable.getRowModel().rows"
                            :key="row.id"
                            :class="[
                                doubleClick && 'double-click',
                                rowClass && rowClass(row.original),
                            ]"
                            :data-state="row.getIsSelected() ? 'selected' : undefined"
                            @dblclick="onDoubleClick(row)"
                        >
                            <td
                                v-for="cell in row.getVisibleCells()"
                                :key="cell.id"
                            >
                                <FlexRender
                                    :render="cell.column.columnDef.cell"
                                    :props="cell.getContext()"
                                />
                            </td>
                        </tr>
                    </template>

                    <template v-else>
                        <tr>
                            <td
                                :colspan="columns.length"
                                class="h-24 text-center"
                            >
                                No results.
                            </td>
                        </tr>
                    </template>
                </tbody>

            </table>
        </div>

        <Pagination
            class="py-4 flex justify-center"
            :pagination="datatable.meta.value?.pagination"
            @change-page="datatable.onPaginationChange($event)"
        />
    </div>
</template>

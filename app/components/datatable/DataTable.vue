<script setup lang="ts" generic="TData, TValue">
import type {
    ColumnDef,
    Header,
    Row,
} from '@tanstack/vue-table'
import { filter } from 'lodash-es';
import { DatatableService } from '~~/services/datatable-service';
import {
    FlexRender,
} from '@tanstack/vue-table'
import { ArrowPathIcon, FunnelIcon, PlusIcon } from '@heroicons/vue/24/outline';
import { ArrowsUpDownIcon, BarsArrowDownIcon, BarsArrowUpIcon } from '@heroicons/vue/16/solid';
import ColumnChooser from '~/components/datatable/ColumnChooser.vue';
import Pagination from '~/components/datatable/Pagination.vue';
import RowSelectCheckbox from '~/components/datatable/RowSelectCheckbox.vue';

const props = defineProps<{
    apiService: DataTableAwareApiClientContract<TData>,
    columns: ColumnDef<TData, TValue>[],
    doubleClick?: boolean,
    defaultSortField?: string,
    hideColumnChooser?: boolean,
    // eslint-disable-next-line no-unused-vars
    rowClass?: (row: TData) => string|string[],
    selectable?: boolean,
    showNewButton?: boolean,
}>()
const emit = defineEmits<{
    clickNew: [],
    doubleClick: [row: TData],
    selectionChange: [selectedRows: SelectedRowType<TData>[]],
}>()

const filterBus = useEventBus(`dt-${props.apiService.entity()}-filters`);

const datatable = new DatatableService<TData, TValue>(props.apiService, props.columns, {
    defaultSortField: props.defaultSortField,
});

const dt = ref();
const dirtyFilters = ref<Record<string, boolean>>({});
const selectionKey = ref<number>(0);

if (import.meta.client) {
    await datatable.initialise();
}

const styles = (header: Header<TData, unknown>): string => {
    const arr = [];

    if (header.getSize() !== 150) {
        arr.push(`width: ${header.getSize()}px`);
    }

    return arr.join(' ');
}

const onApplyFilters = async():Promise<void> => {
    await datatable.applyFilters();
    filterBus.emit('filtersApplied');
}

const onDoubleClick = (row: Row<TData>):void => {
    if (props.doubleClick) {
        emit('doubleClick', row.original);
    }
}

const onSelectAll = ():void => {
    datatable.selectAllRows(!datatable.isAllRowsSelected());
    selectionKey.value += 1;
}

const onSelectRow = (idx: number): void => {
    datatable.selectRow(idx);
    selectionKey.value += 1;
}

filterBus.on(async (type, props) => {
    switch (type) {
        case 'dirtyFilters':
            dirtyFilters.value[props.name] = props.value;
            break;

        case 'filtersApplied':
            dirtyFilters.value = {};
            break;

        case 'selectionChange':
            emit('selectionChange', props as SelectedRowType<TData>[]);
            break;
    }
})

const hasDirtyFilters = computed((): boolean => filter(dirtyFilters.value, v => v).length > 0)

onMounted(() => {
    if (import.meta.client) {
        datatable.initialise();
    }
})
</script>

<template>
    <div class="relative mx-auto max-w-screen-2xl py-4 lg:py-0">
        <ClientOnly>
            <div class="relative mb-2 grid grid-cols-1 gap-x-2 gap-y-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 xl:gap-x-6 xl:gap-y-3">

                <slot name="filters" />

                <div
                    class="flex flex-row items-center justify-end gap-1"
                    style="grid-column-end: -1;"
                >
                    <div
                        class="flex h-8 w-8 cursor-pointer items-center justify-center rounded-md bg-green-400 py-1.5 group hover:bg-green-500"
                        :class="[
                            hasDirtyFilters && 'visible',
                            !hasDirtyFilters && 'invisible',
                        ]"
                        @click="onApplyFilters()"
                    >
                        <FunnelIcon class="h-6 w-6 text-white"/>
                    </div>

                    <div
                        class="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-core-light-50 group hover:bg-core-light-100 dark:bg-core-dark-950 dark:hover:bg-core-dark-900"
                        @click="datatable.reload"
                    >
                        <ArrowPathIcon class="h-6 w-6 text-highlight-300 group-hover:text-highlight-600"/>
                    </div>

                    <ColumnChooser
                        v-if="hideColumnChooser !== true"
                        :columns="datatable.columns.value"
                        class="flex-1"
                        @update:model-value="datatable.renderKey.value += 1"
                    />

                    <button
                        v-if="showNewButton"
                        type="button"
                        class="flex justify-center rounded-md px-2 text-sm font-semibold uppercase leading-6 text-white shadow-sm bg-highlight-500 py-1.5 group hover:bg-highlight-600 focus-visible:outline-highlight-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
                        @click.prevent="$emit('clickNew')"
                    >
                        <PlusIcon class="h-6 w-6 text-white group-hover:text-core-light-100" />
                    </button>
                </div>
            </div>

            <div class="rounded-md border">
                <table v-if="datatable.isReady" ref="dt" class="datatable">

                    <thead>
                        <tr
                            v-for="headerGroup in datatable.getHeaderGroups()"
                            :key="headerGroup.id"
                        >
                            <th
                                v-if="selectable"
                                class="w-[36px]"
                            >
                                <RowSelectCheckbox
                                    :key="selectionKey"
                                    :checked="datatable.isAllRowsSelected()"
                                    @change="onSelectAll"
                                />
                            </th>
                            <th
                                v-for="header in headerGroup.headers"
                                :key="header.id"
                                :style="styles(header)"
                            >
                                <div class="flex flex-row items-center gap-1 justify-stretch">
                                    <div class="flex-1">
                                        <FlexRender
                                            v-if="!header.isPlaceholder"
                                            :render="header.column.columnDef.header"
                                            :props="header.getContext()"
                                        />
                                    </div>

                                    <div v-if="header.column.getCanSort()">
                                        <BarsArrowDownIcon
                                            v-if="datatable.getSortField() === header.column.id && datatable.getSortOrder() === 'desc'"
                                            class="h-4 w-4 cursor-pointer text-core-light-500 hover:text-core-dark-700 dark:text-core-dark-500 hover:dark:text-core-dark-300"
                                            @click="header.column.toggleSorting()"
                                        />
                                        <BarsArrowUpIcon
                                            v-else-if="datatable.getSortField() === header.column.id && datatable.getSortOrder() === 'asc'"
                                            class="h-4 w-4 cursor-pointer text-core-light-500 hover:text-core-dark-700 dark:text-core-dark-500 hover:dark:text-core-dark-300"
                                            @click="header.column.toggleSorting()"
                                        />
                                        <ArrowsUpDownIcon
                                            v-else
                                            class="h-4 w-4 cursor-pointer text-core-light-500 hover:text-core-dark-700 dark:text-core-dark-500 hover:dark:text-core-dark-300"
                                            @click="header.column.toggleSorting()"
                                        />
                                    </div>
                                </div>
                            </th>
                        </tr>
                    </thead>

                    <tbody>
                        <template v-if="datatable.getRowModel().rows?.length">
                            <tr
                                v-for="(row, idx) in datatable.getRowModel().rows"
                                :key="row.id"
                                :class="[
                                    doubleClick && 'double-click',
                                    rowClass && rowClass(row.original),
                                    idx % 2 === 0 ? 'row-odd' : 'row-even',
                                ]"
                                :data-state="row.getIsSelected() ? 'selected' : undefined"
                                @dblclick="onDoubleClick(row)"
                            >
                                <td
                                    v-if="selectable"
                                >
                                    <RowSelectCheckbox
                                        :checked="datatable.isSelected(idx)"
                                        :idx="idx"
                                        @change="onSelectRow(idx)"
                                    />
                                </td>
                                <td
                                    v-for="cell in row.getAllCells()"
                                    :key="cell.id"
                                    :class="[
                                        !cell.column.getIsVisible() && 'hidden',
                                    ]"
                                >
                                    <FlexRender
                                        :render="cell.column.columnDef.cell"
                                        :props="cell.getContext()"
                                    />
                                </td>
                            </tr>
                        </template>

                        <template v-else-if="datatable.isReady && !datatable.isLoading">
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
                class="w-full py-4 mb-4"
                :pagination="datatable.meta.value?.pagination"
                @change="datatable.onPaginationChange($event)"
            />
        </ClientOnly>
    </div>
</template>

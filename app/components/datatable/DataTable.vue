<script setup lang="ts" generic="T">
import { DatatableService } from '~~/services/datatable-service';
import { ArrowPathIcon } from '@heroicons/vue/24/outline'
import Column from 'primevue/column';
import DataTable from 'primevue/datatable';
import ColumnChooser from '~/components/datatable/ColumnChooser.vue';
import PleaseWaitModal from '~/components/modal/PleaseWaitModal.vue';

const columns = defineModel<DataTableColumnType[]>({required: true});

const { apiService, defaultSortField, rowClass } = defineProps<{
    apiService: DataTableAwareApiClientContract<T>,
    doubleClick?: boolean,
    defaultSortField?: string,
    entityType?: string,
    hideColumnChooser?: boolean,
    // eslint-disable-next-line no-unused-vars
    rowClass?: (row: T) => string|string[],
    selectable?: boolean,
    showNewButton?: boolean,
}>()
const emit = defineEmits<{
    clickNew: [],
    doubleClick: [row: T],
    selectionChange: [selectedRows: T[]],
}>()

const datatable = new DatatableService<T>(apiService, unref(columns), {
    defaultSortField,
});
const dt = ref();
const selectedRows = ref([]);

const applyRowClass = (data: T):string|string[] => {
    if (typeof (rowClass) === 'function') {
        return rowClass(data)
    }

    return '';
}

const onUpdateSelection = () => {
    emit('selectionChange', selectedRows.value)
}

onMounted(() => {
    datatable.initialise();
})
</script>

<template>
    <div class="relative py-4 lg:py-0 max-w-screen-2xl mx-auto">
        <DataTable
            ref="dt"
            :key="datatable.renderKey.value"
            v-model:selection="selectedRows"
            class="w-full p-datatable"
            :class="[
                doubleClick && 'dbl-click',
                selectable && 'selectable',
            ]"
            current-page-report-template="{first} to {last} of {totalRecords}"
            :always-show-paginator="false"
            :first="datatable.firstRow.value"
            lazy
            paginator
            paginator-template="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
            :row-class="applyRowClass"
            :row-hover="doubleClick"
            :rows="datatable.getRows.value"
            :rows-per-page-options="[10,25,50,100]"
            :sort-field="datatable.sortField()"
            :sort-order="datatable.sortOrder()"
            :total-records="datatable.getTotalRecords.value"
            :value="datatable.rows.value"
            @row-dblclick="doubleClick && $emit('doubleClick', $event.data)"
            @sort="datatable.onSort($event)"
            @update:selection="onUpdateSelection"
        >
            <template #empty>
                {{ !datatable.isLoading ? 'NO RESULTS' : '' }}
            </template>

            <template #header>
                <div class="relative mb-2 grid grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 xl:gap-6">
                    <div
                        class="flex flex-row gap-1 items-center justify-end"
                        style="grid-column-end: -1;"
                    >
                        <div
                            class="w-8 h-8 cursor-pointer bg-core-light-50 dark:bg-core-dark-950 rounded-full flex items-center justify-center group hover:bg-core-light-100 dark:hover:bg-core-dark-900"
                            @click="datatable.reload"
                        >
                            <ArrowPathIcon
                                class="w-6 h-6 text-highlight-300 group-hover:text-highlight-600"
                            />
                        </div>

                        <ColumnChooser
                            v-if="hideColumnChooser !== true"
                            v-model="columns"
                            class="flex-1"
                            @update:model-value="datatable.renderKey.value += 1"
                        />

                        <button
                            v-if="showNewButton"
                            type="button"
                            class="w-fit bg-highlight-500 hover:bg-highlight-600 flex justify-center rounded-md px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-highlight-600 uppercase"
                            @click.prevent="$emit('clickNew')"
                        >
                            + {{ entityType ?? 'new'}}
                        </button>
                    </div>
                </div>
            </template>

            <Column
                v-if="selectable"
                selection-mode="multiple"
                class="p-selection-column"
            />

            <template
                v-for="column in columns"
                :key="column.id"
            >
                <Column
                    v-bind="column.props"
                    :class="column.props.class"
                    :body-class="column.component ? '' : column.props.bodyClass"
                    :header-class="column.props.headerClass"
                    :hidden="!column.visible"
                    :sortable="column.sortable"
                    :style="column.width && `width: ${column.width}px`"
                >
                    <template
                        #body="{data : rowData}"
                    >
                        <component
                            :is="datatable.columnTemplate(column)"
                            :data="rowData"
                            :column="column"
                        />
                    </template>
                </Column>
            </template>
        </DataTable>
    </div>

    <PleaseWaitModal v-model="datatable.isLoading.value"/>
</template>

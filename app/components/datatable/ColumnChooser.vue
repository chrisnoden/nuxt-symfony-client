<script setup lang="ts" generic="TData, TValue">
import type { Column } from '@tanstack/vue-table';
import { ref } from 'vue';
import { onClickOutside } from '@vueuse/core';
import ColumnChooserLabel from '~/components/datatable/ColumnChooserLabel.vue';
import FieldLabel from '~/components/form/compact/FieldLabel.vue';

defineProps<{
    columns: Column<TData, TValue>[],
}>()

const panelVisible = ref<boolean>(false);
const target = ref(null)

onClickOutside(target, () => panelVisible.value = false);
</script>

<template>
    <div
        ref="target"
        class="relative"
    >
        <div
            class="relative cursor-pointer rounded-md border border-gray-300 bg-body-bg dark:bg-body-bg-dark hover:border-core-light-600 px-3 py-2 shadow-sm no-select focus-within:border-indigo-600 focus-within:ring-1 focus-within:ring-indigo-600"
            @click="panelVisible = !panelVisible"
        >
            <FieldLabel>Columns</FieldLabel>

            <div class="text-sm text-core-light-900 dark:text-core-dark-200 min-w-[54px]">
                Choose
            </div>
        </div>

        <div
            v-show="panelVisible"
            class="
                absolute right-0 z-40 h-fit overflow-auto rounded-md bg-body-bg dark:bg-core-dark-900
                shadow-lg dark:shadow-core-dark-700 ring-1 ring-core-light-900 dark:ring-core-dark-400 ring-opacity-5
                top-[40px] w-[260px] max-w-[100vw] focus:outline-none sm:text-sm
            "
        >
            <ColumnChooserLabel
                v-for="(column, idx) in columns.filter((column) => column.getCanHide())"
                :key="column.id"
                :column="column"
                class="flex w-full flex-row items-center justify-between px-4 py-2"
                :class="idx % 2 ? 'bg-core-light-50 dark:bg-core-dark-950 rounded-md' : ''"
            />
        </div>
    </div>
</template>

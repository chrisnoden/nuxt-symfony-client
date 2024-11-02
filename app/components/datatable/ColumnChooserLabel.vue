<script setup lang="ts" generic="TData, TValue">
import type { Column } from '@tanstack/vue-table';
import { has } from 'lodash-es';
import ToggleSwitch from '~/components/form/elements/ToggleSwitch.vue';

const { column } = defineProps<{
    column: Column<TData, TValue>,
}>()

const onClickToggle = (column: Column<TData, TValue>, value: boolean) => {
    column.toggleVisibility(value)
}

const label = computed(() => {
    if (has(column.columnDef?.meta, 'label')) {
        return column.columnDef?.meta.label
    }

    if (typeof column.columnDef.header === 'function') {
        return column.id;
    }

    return column.columnDef?.header ?? column.id
})
</script>

<template>
    <div>
        <div class="flex-1">
            {{ label }}
        </div>

        <ToggleSwitch
            :model-value="column.getIsVisible()"
            :label="column.id"
            @update:model-value="onClickToggle(column, $event)"
        />
    </div>
</template>

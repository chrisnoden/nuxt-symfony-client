<script setup lang="ts" generic="T">
const { data, column } = defineProps<{
    data: T,
    column: DataTableColumnType,
}>();
</script>

<template>
    <component
        :is="column.component"
        :data="data"
        :props="column.props"
    />
</template>

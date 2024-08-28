<script setup lang="ts" generic="T">
import { has } from 'lodash-es';

const { data, column } = defineProps<{
    data: T,
    column: DataTableColumnType,
}>();

const dataValue = () => {
    const key = column.props.field;
    const [ stub, child, grandchild ] = key.split('.', 3);

    if (!stub) {
        return null;
    } else if (!child) {
        return data[key];
    }

    try {
        if (has(data, stub) && has(data[stub], child)) {
            if (grandchild && has(data[stub][child], grandchild)) {
                return data[stub][child][grandchild];
            }

            return data[stub][child];
        }
    } catch (e) {
        // ignore
    }

    return null;
}

</script>

<template>
    <div :class="column.class">
        {{ dataValue() }}
    </div>
</template>

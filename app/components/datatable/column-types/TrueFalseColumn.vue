<script setup lang="ts" generic="T">
import { has, isObject } from 'lodash-es';

const { data, props } = defineProps<{
    data: T,
    props: DataTableColumnPropsType<T>,
}>();

const value = computed((): boolean => {
    if (props.value) {
        return props.value(data) === true;
    }

    if (has(props, 'field')) {
        const key: string = `${props.field}`;

        if (isObject(data) && has(data, key)) {
            return data[key] === true;
        }
    }

    return false;
})

const activeClass = computed(() => has(props, 'activeClass') ? props.activeClass : 'text-green-800 bg-green-200');
const inactiveClass = computed(() => has(props, 'inactiveClass') ? props.inactiveClass : 'text-red-800 bg-red-200');
const activeValue = computed(() => has(props, 'activeValue') ? props.activeValue : 'yes');
const inactiveValue = computed(() => has(props, 'inactiveValue') ? props.inactiveValue : 'no');
</script>

<template>
    <div
        class="uppercase text-center not-italic font-bold rounded-md px-1 py-0.5"
        :class="[
            props.class,
            props.bodyClass,
            value ? activeClass : inactiveClass,
        ]"
    >
        {{ value ? activeValue : inactiveValue }}
    </div>
</template>

<style scoped>

</style>

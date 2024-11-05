<script setup lang="ts">
import { has } from 'lodash-es';
import ClearFieldIcon from '~/components/el/ClearFieldIcon.vue';

const modelValue = defineModel<string|undefined>();
const {
    dataTableEntity,
    label = 'Text Input',
    minLength = 1,
    maxLength = 255,
    name,
    placeholder,
} = defineProps<{
    dataTableEntity: string,
    label?: string,
    minLength?: number,
    maxLength?: number,
    name: string,
    placeholder?: string,
}>()
const emit = defineEmits(['input']);

const route = useRoute();
const filterBus = useEventBus(`dt-${dataTableEntity}-filters`);

const currentValue = ref<string|undefined>(modelValue.value);
const dirty = ref<boolean>(false);
const hasFocus = ref<boolean>(false);
const initialValue = ref<string|undefined>(modelValue.value);

const emitValue = () => {
    emit('input', { [name]: modelValue.value });
    filterBus.emit('setFilter', { [name]: modelValue.value })
    filterBus.emit('dirtyFilters', { name, value: dirty.value });
}

const onInput = () => {
    if (!currentValue.value || currentValue.value.length < minLength) {
        modelValue.value = undefined;
    } else {
        modelValue.value = currentValue.value;
    }

    dirty.value = modelValue.value !== initialValue.value;
    emitValue();
}

const onClear = () => {
    currentValue.value = undefined;
    modelValue.value = undefined;
    dirty.value = currentValue.value !== initialValue.value;
    emitValue();
}

const setInitialValues = (v: string|undefined) => {
    currentValue.value = v;
    initialValue.value = v;
    modelValue.value = v;
    emitValue();
}

if (route.query && has(route.query, name)) {
    setInitialValues(queryPropAsString(name))
}

watch(route, () => {
    setInitialValues(queryPropAsString(name))
})
</script>

<template>
    <div class="relative rounded-md border border-gray-300 bg-white px-3 py-2 shadow-sm focus-within:border-indigo-600 focus-within:ring-1 focus-within:ring-indigo-600 dark:bg-black">
        <label
            :for="name"
            class="absolute -mt-px inline-block bg-white px-1 text-xs font-medium text-cire-light-900 top-[-7px] left-[7px] dark:text-core-dark-100 dark:bg-black"
        >{{ label }}</label>

        <input
            :id="name"
            v-model="currentValue"
            :minlength="minLength"
            :maxlength="maxLength"
            type="text"
            :name="name"
            class="block w-full border-0 bg-white p-0 text-core-light-900 placeholder-core-light-500 pr-[20px] focus:ring-0 dark:text-core-dark-100 dark:placeholder-core-dark-500 dark:bg-black sm:text-sm"
            :placeholder="placeholder ?? label"
            @input.prevent="onInput"
            @focusin="hasFocus = true"
            @focusout="hasFocus = false"
        >

        <ClearFieldIcon
            v-show="currentValue"
            class="absolute right-1 top-[9px]"
            @click="onClear"
        />
    </div>
</template>

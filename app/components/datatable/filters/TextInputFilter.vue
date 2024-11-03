<script setup lang="ts">
import { has } from 'lodash-es';
import ClearFieldIcon from '~/components/el/ClearFieldIcon.vue';

const modelValue = defineModel<string|undefined>();
const { dataTableEntity, minLength, name } = withDefaults(defineProps<{
    clearable?: boolean,
    clearOnSubmit?: boolean,
    dataTableEntity: string,
    label?: string,
    minLength?: number,
    maxLength?: number,
    name: string,
    placeholder?: string,
}>(), {
    clearable: false,
    clearOnSubmit: false,
    label: 'Text Input',
    minLength: 1,
    maxLength: 255,
    placeholder: '',
})
const emit = defineEmits(['input']);

const { query } = useRoute();
const filterBus = useEventBus(`dt-${dataTableEntity}-filters`);

const currentValue = ref<string|undefined>(modelValue.value);
const initialValue = ref<string|undefined>(modelValue.value);
const dirty = ref<boolean>(false);
const hasFocus = ref<boolean>(false);

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

if (query && has(query, name)) {
    currentValue.value = queryPropAsString(name);
    initialValue.value = queryPropAsString(name);
    modelValue.value = queryPropAsString(name);
    emitValue();
}
</script>

<template>
    <div class="relative rounded-md border border-gray-300 bg-white px-3 py-2 shadow-sm focus-within:border-indigo-600 focus-within:ring-1 focus-within:ring-indigo-600">
        <label
            :for="name"
            class="absolute -mt-px inline-block bg-white px-1 text-xs font-medium text-gray-900 top-[-7px] left-[7px]"
        >{{ label }}</label>

        <input
            :id="name"
            v-model="currentValue"
            :minlength="minLength"
            :maxlength="maxLength"
            type="text"
            :name="name"
            class="block w-full border-0 p-0 text-gray-900 placeholder-gray-500 focus:ring-0 sm:text-sm pr-[20px]"
            :placeholder="label"
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

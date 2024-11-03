<script setup lang="ts">
import { has } from 'lodash-es';
import ClearFieldIcon from '~/components/el/ClearFieldIcon.vue';

const modelValue = defineModel<string|undefined>();
const { dataTableEntity } = defineProps<{
    dataTableEntity: string,
}>()
const name = 'q';
const emit = defineEmits<{
    input: [value: { [name]: string|undefined }],
    submit: [value: { [name]: string|undefined }],
}>()

const filterBus = useEventBus(`dt-${dataTableEntity}-filters`);

const currentValue = ref<string|undefined>(modelValue.value);
const dirty = ref<boolean>(false);
const hasFocus = ref<boolean>(false);
const initialValue = ref<string|undefined>(modelValue.value);
const label = 'Quick Search';
const minLength = 3;
const maxLength = 50;
const { query } = useRoute();

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

const onSubmit = () => {
    emit('submit', { [name]: modelValue.value });
    filterBus.emit('applyFilters');
    dirty.value = false;
};

const onClear = () => {
    currentValue.value = undefined;
    modelValue.value = undefined;
    dirty.value = currentValue.value !== initialValue.value;
    emitValue();
    emit('submit', { [name]: undefined });
    filterBus.emit('applyFilters')
}

const showReturnTippy = computed(() => hasFocus.value && dirty.value && currentValue.value && currentValue.value.length >= minLength);

if (query && has(query, name)) {
    currentValue.value = queryPropAsString(name);
    initialValue.value = queryPropAsString(name);
    modelValue.value = queryPropAsString(name);
    emitValue();
}
</script>

<template>
    <div
        class="relative rounded-md border border-gray-300 bg-white px-3 py-2 shadow-sm focus-within:border-indigo-600 focus-within:ring-1 focus-within:ring-indigo-600"
    >
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
            class="block w-full border-0 p-0 text-gray-900 placeholder-gray-500 focus:ring-0 sm:text-sm pr-[36px]"
            :placeholder="label"
            @keydown.enter="onSubmit"
            @input.prevent="onInput"
            @focusin="hasFocus = true"
            @focusout="hasFocus = false"
        >

        <div
            v-show="showReturnTippy"
            class="absolute right-7 top-[4px]"
        >
            <kbd
                v-tippy="{ content: 'press return key to search',
                           placement: 'bottom' }"
                class="px-1 py-1 text-xs font-semibold text-gray-900 bg-white border border-gray-200 rounded-md"
            >↲</kbd>
        </div>

        <ClearFieldIcon
            v-show="currentValue"
            class="absolute right-1 top-[9px]"
            @click="onClear"
        />
    </div>
</template>

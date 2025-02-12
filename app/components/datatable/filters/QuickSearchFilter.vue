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
const route = useRoute();

const currentValue = ref<string|undefined>(modelValue.value);
const dirty = ref<boolean>(false);
const hasFocus = ref<boolean>(false);
const initialValue = ref<string|undefined>(modelValue.value);
const label = 'Quick Search';
const minLength = 3;
const maxLength = 50;

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

const setInitialValues = (v: string|undefined) => {
    currentValue.value = v;
    initialValue.value = v;
    modelValue.value = v;
    emitValue();
}

const showReturnTippy = computed(() => hasFocus.value && dirty.value && currentValue.value && currentValue.value.length >= minLength);

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
                class="rounded-md border border-gray-200 bg-white px-1 py-1 text-xs font-semibold text-gray-900"
            >↲</kbd>
        </div>

        <ClearFieldIcon
            v-show="currentValue"
            class="absolute right-1 top-[9px]"
            @click="onClear"
        />
    </div>
</template>

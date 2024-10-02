<script setup lang="ts">
import ClearFieldIcon from '~/components/el/ClearFieldIcon.vue';
import { has } from 'lodash-es';

const modelValue = defineModel<string|undefined>();
const props = withDefaults(defineProps<{
    clearable?: boolean,
    clearOnSubmit?: boolean,
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
const emit = defineEmits<{
    submit: [value: string|undefined],
}>()

const onSubmit = (val: string|undefined) => {
    modelValue.value = val;
    emit('submit', val);
    if (props.clearOnSubmit) {
        modelValue.value = undefined;
    }
};

const onClear = () => {
    modelValue.value = undefined;
}

onMounted(() => {
    const route = useRoute();
    if (has(route.query, props.name)) {
        modelValue.value = `${route.query[props.name]}`;
    }
})

watch(() => modelValue.value, (value) => {
    const v = `${value?.trim()}`;
    if (v === '' || undefined === value || null === value) {
        addPropertyToRouteQuery(props.name, undefined)
    } else if (v.length >= props.minLength) {
        addPropertyToRouteQuery(props.name, v)
    }
})
</script>

<template>
    <div
        class="relative rounded-md border border-gray-300 bg-white px-3 py-2 shadow-sm focus-within:border-indigo-600 focus-within:ring-1 focus-within:ring-indigo-600"
    >
        <label
            :for="name ?? 'text-input-filter'"
            class="absolute -mt-px inline-block bg-white px-1 text-xs font-medium text-gray-900 top-[-7px] left-[7px]"
        >{{ label }}</label>

        <input
            :id="name"
            v-model="modelValue"
            :minlength="minLength"
            :maxlength="maxLength"
            type="text"
            :name="name ?? 'text-input-filter'"
            class="block w-full border-0 p-0 text-gray-900 placeholder-gray-500 focus:ring-0 sm:text-sm pr-[20px]"
            :placeholder="placeholder"
            @keydown.enter="onSubmit(($event.target as HTMLInputElement)?.value)"
        >

        <ClearFieldIcon
            v-show="modelValue && clearable"
            class="absolute right-1 top-[9px]"
            @click="onClear"
        />
    </div>
</template>

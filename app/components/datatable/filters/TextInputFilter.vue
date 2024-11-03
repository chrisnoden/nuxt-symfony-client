<script setup lang="ts">
import { has } from 'lodash-es';
import ClearFieldIcon from '~/components/el/ClearFieldIcon.vue';

const modelValue = defineModel<string|undefined>();
const { minLength, name } = withDefaults(defineProps<{
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
const emit = defineEmits(['input']);

const currentValue = ref<string|undefined>(modelValue.value);
const { query } = useRoute();

const onInput = (v: string|undefined) => {
    if (v && v.length >= minLength) {
        modelValue.value = v;
        emit('input', { [name]: modelValue.value });
    } else {
        if (undefined !== modelValue.value) {
            emit('input', { [name]: undefined });
        }
        modelValue.value = undefined;
    }
}

const onClear = () => {
    currentValue.value = undefined;
    modelValue.value = undefined;
    emit('input', {[name]: undefined });
}

if (query && has(query, name)) {
    currentValue.value = queryPropAsString(name);
    onInput(queryPropAsString(name));
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
            class="block w-full border-0 p-0 text-gray-900 placeholder-gray-500 focus:ring-0 sm:text-sm pr-[62px]"
            :placeholder="label"
            @input.prevent="onInput(($event.target as HTMLInputElement)?.value)"
        >

        <ClearFieldIcon
            v-show="currentValue"
            class="absolute right-1 top-[9px]"
            @click="onClear"
        />
    </div>
</template>

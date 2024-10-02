<script setup lang="ts">
import ClearFieldIcon from '~/components/el/ClearFieldIcon.vue';
import { has } from 'lodash-es';

const modelValue = defineModel<string|undefined>();
const emit = defineEmits<{
    submit: [value: string|undefined],
}>()
const label = 'Quick Search';
const minLength = 3;
const maxLength = 50;
const name = 'q';

const onSubmit = (value: string|undefined) => {
    emit('submit', value);

    const v = `${value?.trim()}`;
    if (v === '' || undefined === value) {
        addPropertyToRouteQuery(name, undefined)
    } else if (v.length >= minLength) {
        addPropertyToRouteQuery(name, v)
    }
};

const onClear = () => {
    modelValue.value = undefined;
}

onMounted(() => {
    const route = useRoute();
    if (has(route.query, name)) {
        modelValue.value = `${route.query[name]}`;
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
            class="block w-full border-0 p-0 text-gray-900 placeholder-gray-500 focus:ring-0 sm:text-sm pr-[62px]"
            :placeholder="label"
            @keydown.enter="onSubmit(($event.target as HTMLInputElement)?.value)"
        >

        <div
            v-show="modelValue && modelValue.length >= minLength"
            class="absolute right-7 top-[4px]"
        >
            <kbd
                v-tippy="{ content: 'press return key to search',
                           placement: 'bottom' }"
                class="px-1 py-1 text-xs font-semibold text-gray-900 bg-white border border-gray-200 rounded-md"
            >↲</kbd>
        </div>

        <ClearFieldIcon
            v-show="modelValue"
            class="absolute right-1 top-[9px]"
            @click="onClear"
        />
    </div>
</template>

<script setup lang="ts">
import { find, has } from 'lodash-es';
import ClientRepository from '~~/repositories/client-repository';
import { CheckIcon, ChevronUpDownIcon, XMarkIcon } from '@heroicons/vue/20/solid'
import {
    Combobox,
    ComboboxButton,
    ComboboxInput,
    ComboboxOption,
    ComboboxOptions,
} from '@headlessui/vue'

const modelValue = defineModel<number|undefined>();
const {
    dataTableEntity,
} = defineProps<{
    dataTableEntity: string,
}>()
const emit = defineEmits(['input']);

const filterBus = useEventBus(`dt-${dataTableEntity}-filters`);
const route = useRoute();
const clients = new ClientRepository();

const allItemCount = ref<number>(0);
const currentValue = ref<ClientType|null>(null);
const dirty = ref<boolean>(false);
const hasFocus = ref<boolean>(false);
const initialValue = ref<ClientType|null>(null);
const items = ref<ClientType[]>([]);
const name = 'client';
const query = ref<string>('')

const emitValue = () => {
    emit('input', { [name]: modelValue.value });
    filterBus.emit('setFilter', { [name]: modelValue.value })
    filterBus.emit('dirtyFilters', { name, value: dirty.value });
}

const fetchItems = async() => {
    try {
        if (query.value.length > 0) {
            const response = await clients.search({ q: query.value });
            items.value = response.data;
        } else {
            const response = await clients.search();
            items.value = response.data;
            allItemCount.value = items.value.length;

            if (!dirty.value && route.query && has(route.query, name)) {
                setInitialValues(queryPropAsNumber(name))
            }
        }
        // eslint-disable-next-line no-unused-vars
    } catch (e) {/* empty */}
}

const onClear = async() => {
    currentValue.value = null;
    modelValue.value = undefined;
    dirty.value = currentValue.value !== initialValue.value;
    query.value = '';
    emitValue();
    await fetchItems();
}

const onFilterItems = async(q: string) => {
    query.value = q;

    // implement a cheap 'debounce'
    if (typeof window.LIT !== 'undefined') {
        clearTimeout(window.LIT);
    }
    window.LIT = setTimeout(async function () {
        await fetchItems();
    }, 300);
}

const setInitialValues = (v: number|undefined) => {
    currentValue.value = find(items.value, (i: ClientType) => i.id === v) ?? null;
    initialValue.value = currentValue.value;
    modelValue.value = v;
    emitValue();
}

const displayName = (item: unknown): string => {
    if (undefined === item || !has(item, 'companyName')) {
        return query.value;
    }

    let value: string = `${item.companyName}`;

    if (has(item, 'id') && item.id && (item.id as number) > 0) {
        value += ` (${item.id})`;
    }

    return value;
}

watch(route, () => {
    setInitialValues(queryPropAsNumber(name))
})

watch (() => currentValue.value, () => {
    if (currentValue.value === null || currentValue.value === undefined) {
        modelValue.value = undefined;
    } else {
        modelValue.value = currentValue.value.id;
    }

    dirty.value = (modelValue.value ?? null) !== initialValue.value;
    emitValue();
})

fetchItems();
</script>

<template>
    <div
        v-if="isRootClient() && allItemCount > 0"
        class="relative rounded-md border border-gray-300 bg-white px-3 py-2 shadow-sm focus-within:border-indigo-600 focus-within:ring-1 focus-within:ring-indigo-600 dark:bg-black"
    >
        <label
            for="client-filter"
            class="absolute -mt-px inline-block bg-white px-1 text-xs font-medium text-cire-light-900 top-[-7px] left-[7px] dark:text-core-dark-100 dark:bg-black"
        >Client</label>

        <Combobox
            v-model="currentValue"
            as="div"
            name="client-filter"
            nullable
        >
            <div class="relative mt-2 w-full sm:col-span-2 sm:mt-0">
                <ComboboxInput
                    class="block w-full border-0 bg-white p-0 text-core-light-900 placeholder-core-light-500 pr-[20px] focus:ring-0 dark:text-core-dark-100 dark:placeholder-core-dark-500 dark:bg-black sm:text-sm"
                    :display-value="(item) => displayName(item)"
                    @change="onFilterItems($event.target.value)"
                    @focusin="hasFocus = true"
                    @focusout="hasFocus = false"
                />

                <ComboboxButton
                    v-if="items.length > 0 && !currentValue"
                    class="absolute inset-y-0 -right-2 flex items-center rounded-r-md px-2 focus:outline-none"
                >
                    <ChevronUpDownIcon
                        class="h-5 w-5 text-core-light-400 hover:text-core-light-600 dark:text-core-dark-600 dark:hover:text-core-dark-400"
                        aria-hidden="true"
                    />
                </ComboboxButton>

                <XMarkIcon
                    v-show="currentValue"
                    class="absolute top-0 right-0 h-5 w-5 cursor-pointer text-core-light-600 hover:text-red-700 dark:text-core-dark-400"
                    @click="onClear"
                />

                <transition
                    enter-active-class="transition duration-100 ease-out"
                    enter-from-class="scale-95 transform opacity-0"
                    enter-to-class="scale-100 transform opacity-100"
                    leave-active-class="transition duration-75 ease-out"
                    leave-from-class="scale-100 transform opacity-100"
                    leave-to-class="scale-95 transform opacity-0"
                >
                    <ComboboxOptions
                        class="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md py-1 text-base shadow-lg ring-1 ring-black/5 bg-main-bg focus:outline-none dark:bg-main-bg-dark sm:text-sm"
                    >
                        <ComboboxOption
                            v-for="item in items"
                            :key="item.id"
                            v-slot="{ active }"
                            :value="item"
                            as="template"
                        >
                            <li
                                :class="[
                                    'relative cursor-pointer select-none py-2 pl-3 pr-9',
                                    active && 'bg-core-light-300 dark:bg-core-dark-700',
                                    !active && 'bg-main-bg hover:bg-core-light-200 dark:bg-main-bg-dark dark:hover:bg-core-dark-800',
                                ]"
                            >
                                <div class="flex flex-col">
                                    <div class="flex items-center">
                                        <span class="truncate pl-2 font-semibold">
                                            {{ displayName(item) }}
                                        </span>
                                    </div>
                                </div>

                                <span
                                    v-if="currentValue"
                                    :class="[
                                        'absolute inset-y-0 right-0 flex items-center pr-4',
                                        active ? 'text-white' : 'text-highlight-600'
                                    ]"
                                >
                                    <CheckIcon
                                        class="h-5 w-5"
                                        aria-hidden="true"
                                    />
                                </span>
                            </li>
                        </ComboboxOption>

                        <ComboboxOption v-if="items.length === 0 && query !== ''">
                            <li class="relative cursor-not-allowed select-none py-2 pr-9 pl-3">No results</li>
                        </ComboboxOption>
                    </ComboboxOptions>
                </transition>

            </div>
        </Combobox>
    </div>
</template>

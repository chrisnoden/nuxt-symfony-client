<script setup lang="ts">
import { ref } from 'vue';
import { CheckIcon, ChevronUpDownIcon, XMarkIcon } from '@heroicons/vue/20/solid'
import {
    Combobox,
    ComboboxButton,
    ComboboxInput,
    ComboboxOption,
    ComboboxOptions,
} from '@headlessui/vue'
import ClientRepository from '~~/repositories/client-repository';
import FieldLabel from '~/components/form/FieldLabel.vue';
import { find, has } from 'lodash-es';
import { ExclamationTriangleIcon } from '@heroicons/vue/24/outline';

const client = defineModel<ClientType|null>();
const props = withDefaults(defineProps<{
    disabled?: boolean,
    errors?: ValidationErrorType[],
    label?: string,
    name?: string,
}>(), {
    disabled: false,
    errors: undefined,
    label: 'Client',
    name: 'client',
})

const clients = new ClientRepository();

const items = ref<ClientType[]>([]);
const query = ref<string>('')

const fetchItems = async() => {
    items.value = [];
    try {
        if (query.value.length >= 3) {
            const response = await clients.search({ name: query.value });
            items.value = response.data;
        }
        // eslint-disable-next-line no-unused-vars
    } catch (e) {/* empty */}
}

const onClear = () => {
    client.value = null;
    query.value = '';
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

const hasError = computed((): boolean =>
    (null === client.value || undefined === client.value)
    || (undefined !== find(props.errors, (e) => e?.field === props.name))
);
const error = computed(
    (): string => {
        return find(props.errors, (e) => e?.field === props.name)?.message ?? 'choose client';
    })

fetchItems();
</script>

<template>
    <Combobox
        v-model="client"
        as="div"
        class="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:py-6"
        :disabled="disabled"
        :name="name"
        nullable
    >
        <FieldLabel :name="name">{{ label  }}</FieldLabel>

        <div class="relative mt-2 w-full sm:col-span-2 sm:mt-0">
            <ComboboxInput
                class="
                    block w-full rounded-md border-0 py-1.5 dark:bg-body-bg-dark
                    text-core-light-900 dark:text-core-dark-100 placeholder:text-core-light-400 dark:placeholder:text-core-dark-600
                    ring-1 ring-inset focus:ring-2 sm:text-sm sm:leading-6
                "
                :class="[
                    items.length === 0
                        ? 'border-core-light-100 dark:border-core-dark-900'
                        : 'border-core-light-300 dark:border-core-dark-700',
                    hasError && 'has-error',
                    (!disabled && !hasError) && 'shadow-sm',
                    (disabled) && 'ring-core-light-100 dark:ring-core-dark-900',
                    (hasError && !disabled) && 'ring-red-600',
                ]"
                :display-value="(item) => (has(item, 'name') ? item?.name : '')"
                @change="onFilterItems($event.target.value)"
            />

            <ComboboxButton
                v-if="items.length > 0"
                class="absolute inset-y-0 flex items-center rounded-r-md px-2 right-[20px] focus:outline-none"
            >
                <ChevronUpDownIcon
                    class="h-5 w-5 text-core-light-400 hover:text-core-light-600 dark:text-core-dark-600 dark:hover:text-core-dark-400"
                    aria-hidden="true"
                />
            </ComboboxButton>

            <XMarkIcon
                v-if="client && !disabled"
                class="absolute h-5 w-5 cursor-pointer text-core-light-600 top-[8px] right-[8px] hover:text-red-700 dark:text-core-dark-400"
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
                    class="
                        absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1
                        text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm
                    "
                >
                    <ComboboxOption
                        v-for="item in items"
                        :key="item.id"
                        v-slot="{ active, selected }"
                        :value="item"
                        as="template"
                    >
                        <li
                            :class="[
                                'relative cursor-default select-none py-2 pl-3 pr-9',
                                active ? 'bg-highlight-600 text-white' : 'text-core-light-900 dark:text-core-dark-100'
                            ]"
                        >
                            <div class="flex flex-col">
                                <div class="flex items-center">
                                    <span class="truncate pl-2 font-semibold">
                                        {{ item.companyName }}
                                    </span>
                                </div>
                            </div>

                            <span
                                v-if="selected"
                                :class="['absolute inset-y-0 right-0 flex items-center pr-4', active ? 'text-white' : 'text-highlight-600']"
                            >
                                <CheckIcon
                                    class="h-5 w-5"
                                    aria-hidden="true"
                                />
                            </span>
                        </li>
                    </ComboboxOption>
                </ComboboxOptions>
            </transition>

            <div
                v-if="!disabled"
                v-tooltip.left="{ value: error,
                                  class: 'error' }"
                class="top-2 right-2 inline-flex items-center pt-1 md:absolute md:pt-0"
                :class="[
                    hasError ? 'visible' : 'invisible',
                ]"
            >
                <ExclamationTriangleIcon
                    class="h-5 w-5 text-red-600"
                />

                <div
                    class="ml-2 text-sm text-red-600 md:hidden"
                >{{ error }}</div>
            </div>

        </div>
    </Combobox>
</template>


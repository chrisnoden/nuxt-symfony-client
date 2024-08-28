<script setup lang="ts">
import { CheckCircleIcon } from '@heroicons/vue/24/solid'

defineProps<{
    checked: boolean,
    disabled?: boolean,
    name: string,
    description: string,
}>()
</script>

<template>
    <div
        class="relative block rounded-lg border px-6 py-2 sm:flex sm:justify-between"
        :class="[
            !disabled && 'cursor-pointer shadow-lg',
            checked
                ? 'border-highlight-600 bg-highlight-50 dark:bg-highlight-700'
                : 'border-core-light-300 dark:border-core-dark-700 dark:bg-core-dark-950',
            (checked && !disabled) && 'hover:bg-core-light-100 dark:hover:bg-core-dark-700',
            (!checked && !disabled) && 'hover:bg-highlight-50 dark:hover:bg-highlight-950',
        ]"
    >
        <span class="flex items-center w-full">
            <span class="flex-1 flex flex-col text-sm">
                <span
                    as="span"
                    class="font-medium uppercase text-core-light-900"
                    :class="[
                        checked ? 'dark:text-core-dark-100' : 'dark:text-core-dark-300'
                    ]"
                >{{ name }}</span>
                <span
                    as="span"
                    :class="[
                        checked ? 'text-core-light-700 dark:text-core-dark-300' : 'text-core-light-600 dark:text-core-dark-400'
                    ]"
                >
                    <span class="block sm:inline">{{ description }}</span>
                </span>
            </span>

            <CheckCircleIcon v-if="checked" class="w-6 h-6 text-highlight-600 dark:text-highlight-200" />
        </span>
    </div>
</template>

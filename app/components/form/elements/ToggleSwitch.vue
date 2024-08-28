<script setup lang="ts">
import { Switch } from '@headlessui/vue'

const value = defineModel<boolean>({ required: true });
defineProps<{
    disabled?: boolean,
    label: string,
}>();
</script>

<template>
    <Switch
        v-model="value"
        class="group relative inline-flex h-5 max-h-5 w-10 flex-shrink-0 cursor-pointer items-center justify-center rounded-full focus:outline-none focus:ring-2 focus:ring-highlight-600 focus:ring-offset-2"
    >
        <span class="sr-only">Toggle {{ label }} column</span>
        <span
            aria-hidden="true"
            class="pointer-events-none absolute h-full w-full rounded-md"
        />
        <span
            aria-hidden="true"
            :class="[value ? 'bg-highlight-600' : 'bg-gray-200', 'pointer-events-none absolute mx-auto h-4 w-9 rounded-full transition-colors duration-200 ease-in-out']"
        />
        <span
            aria-hidden="true"
            :class="[value ? 'translate-x-5' : 'translate-x-0', 'pointer-events-none absolute left-0 inline-block h-5 w-5 transform rounded-full border border-gray-200 bg-white shadow ring-0 transition-transform duration-200 ease-in-out']"
        />
    </Switch>
</template>

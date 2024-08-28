<script setup lang="ts">
import { MenuItem } from '@headlessui/vue';

defineProps<{
    name: string,
    href: string,
    roles?: string[],
}>()
</script>

<template>
    <MenuItem
        v-if="hasRole(roles)"
    >
        <NuxtLink
            :to="href"
            class="block cursor-pointer text-sm px-4 py-2 hover:bg-core-light-300 text-menu-fg"
        >
            {{ name }}
        </NuxtLink>
    </MenuItem>
</template>

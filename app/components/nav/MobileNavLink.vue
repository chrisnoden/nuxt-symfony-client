<script setup lang="ts">
const route = useRoute();

defineProps<{
    item: {
        name: string,
        href: string,
    }
}>()

const isCurrent = (link: string):boolean => route.path === link;
</script>

<template>
    <NuxtLink
        :to="item.href"
        :class="[
            isCurrent(item.href) ? 'border-core-light-400 bg-core-light-50 text-menu-fg' : 'border-transparent text-menu-fg dark:text-menu-fg-dark hover:bg-core-light-200 hover:text-core-light-700 hover:dark:bg-core-dark-800 hover:dark:text-core-dark-300',
            'block border-l-4 py-2 pl-3 pr-4 text-base font-medium'
        ]"
    >
        {{ item.name }}
    </NuxtLink>
</template>

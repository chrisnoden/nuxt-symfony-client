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
            isCurrent(item.href) ? 'current border-highlight-500 text-gray-900 dark:text-gray-100' : 'border-transparent text-gray-500 dark:text-gray-400 hover:border-gray-300 hover:text-gray-700',
            'inline-flex items-center border-b-2 px-1 pt-1 text-sm font-medium hover:no-underline'
        ]"
        :aria-current="isCurrent(item.href) ? 'page' : undefined"
    >{{ item.name }}</NuxtLink>
</template>

<script setup lang="ts">
import {
    FingerPrintIcon,
    UserCircleIcon,
} from '@heroicons/vue/24/outline'

const route = useRoute();
const path = ref<string>(route.path);

const secondaryNavigation = [
    { name: 'General', href: '/profile', icon: UserCircleIcon },
    { name: 'Security', href: '/profile/security', icon: FingerPrintIcon },
]

watch(
    () => route.path,
    () => {
        path.value = route.path
    }
)
</script>

<template>
    <div class="mx-auto w-full max-w-7xl lg:flex lg:gap-x-16 lg:px-8">
        <h1 class="sr-only">General Settings</h1>

        <aside class="flex overflow-x-auto border-b border-gray-900/5 py-4 lg:block lg:w-64 lg:flex-none lg:border-0 lg:py-16">
            <nav class="flex-none px-4 sm:px-6 lg:px-0">
                <ul role="list" class="flex gap-x-3 gap-y-1 whitespace-nowrap lg:flex-col">
                    <li v-for="item in secondaryNavigation" :key="item.name">
                        <NuxtLink
                            :to="item.href"
                            :class="[
                                item.href === path ? 'bg-core-light-50 dark:bg-core-dark-950 text-highlight-600 dark:text-highlight-300' : 'text-core-light-700 dark:text-core-dark-300 hover:bg-core-light-50 dark:hover:bg-core-dark-800 hover:text-highlight-600 dark:hover:text-core-dark-400',
                                'group flex gap-x-3 rounded-md py-2 pl-2 pr-3 text-sm font-semibold leading-6'
                            ]"
                        >
                            <component
                                :is="item.icon"
                                :class="[
                                    item.href === path ? 'text-highlight-600 dark:text-highlight-300' : 'text-core-light-400 dark:text-core-dark-400 group-hover:text-highlight-600 dark:group-hover:text-core-dark-500',
                                    'h-6 w-6 shrink-0'
                                ]"
                                aria-hidden="true"
                            />
                            {{ item.name }}
                        </NuxtLink>
                    </li>
                </ul>
            </nav>
        </aside>

        <main class="w-full px-4 py-6 md:py-8 sm:px-6 lg:flex-auto lg:px-0 lg:py-16">
            <div class="mx-auto max-w-6xl space-y-16 sm:space-y-20 lg:mx-0 lg:max-w-none">
                <NuxtPage />
            </div>
        </main>
    </div>
</template>

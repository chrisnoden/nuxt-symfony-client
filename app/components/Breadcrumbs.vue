<script setup lang="ts">
import { ChevronRightIcon, HomeIcon } from '@heroicons/vue/20/solid';
import { each, find, has } from 'lodash-es';

const route = useRoute();
const router = useRouter();

const pages: {
    name: string,
    href: string|undefined,
}[] = [];

const pathParts = route.path.split('/');
const allRoutes = router.getRoutes();

let target = '';
each (pathParts, (pathEl: string, key: number) => {
    if (key < 1 || key >= (pathParts.length - 1)) {
        return;
    }

    target += `/${pathEl}`;
    const matchRoute = find(allRoutes, (rte) => rte.path === target && has(rte.meta, 'title'))

    if (undefined !== matchRoute) {
        pages.push({
            name: `${matchRoute.meta.title}`,
            href: target,
        })
    }
})

// add the current page
if (has(route.meta, 'title')) {
    pages.push({
        name: `${route.meta.title}`,
        href: route.path
    })
}

// console.dir(pages);
const isCurrent = (link?: string):boolean => route.path === link;
</script>

<template>
    <nav class="flex" aria-label="Breadcrumb">
        <ol v-if="pages.length > 0" role="list" class="flex items-center space-x-2 pb-6">
            <li>
                <div>
                    <NuxtLink to="/" class="text-core-light-400 dark:text-core-dark-200 hover:text-gray-500 dark:hover:text-core-dark-400">
                        <HomeIcon class="h-5 w-5 flex-shrink-0" aria-hidden="true" />
                        <span class="sr-only">Home</span>
                    </NuxtLink>
                </div>
            </li>

            <li v-for="page in pages" :key="page.name">
                <div class="flex items-center">
                    <ChevronRightIcon class="h-5 w-5 flex-shrink-0 text-gray-300" aria-hidden="true" />
                    <div
                        v-if="isCurrent(page.href)"
                        class="ml-2 text-sm text-core-light-500 dark:text-core-dark-100 font-medium"
                        aria-current="page"
                    >{{ page.name}}</div>
                    <NuxtLink
                        v-else
                        :to="page.href"
                        class="ml-2 text-sm font-medium text-core-light-400 dark:text-core-dark-200 hover:text-gray-500 dark:hover:text-core-dark-400"
                    >{{ page.name }}</NuxtLink>
                </div>
            </li>
        </ol>
    </nav>
</template>

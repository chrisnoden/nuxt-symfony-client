<script setup lang="ts">
import PleaseWaitModal from '~/components/modal/PleaseWaitModal.vue';
import { isMaintenanceMode } from '~/composables/is-maintenance-mode';
import Maintenance from '~/pages/maintenance.vue';
import { useColorMode, useEventBus } from '@vueuse/core';
import Problem from '~/pages/problem.vue';

const nuxtApp = useNuxtApp();
const loading = ref<boolean>(false);
const showProblemScreen = ref<boolean>(false);
useColorMode(); // ensure color mode is injected all pages

nuxtApp.hook("page:start", () => {
    loading.value = true;
});
nuxtApp.hook("page:finish", () => {
    loading.value = false;
});

const bus = useEventBus<string>('server-error');
bus.on(() => {
    showProblemScreen.value = true;
})

useHead({
    titleTemplate: (title) => `${title ?? 'Welcome'} | ${$env('SITE_NAME')}`,
    link: [
        { rel: 'apple-touch-icon', sizes: '180x180', href: '/favicon/apple-touch-icon.png' },
        { rel: 'icon', type: 'image/png', sizes: '32x32', href: '/favicon/favicon-32x32.png' },
        { rel: 'icon', type: 'image/png', sizes: '16x16', href: '/favicon/favicon-16x16.png' },
        { rel: 'manifest', href: '/favicon/site.webmanifest' },
    ],
    htmlAttrs: {
        class: 'h-full',
    }
})
</script>

<template>
    <div class="flex min-h-svh flex-col">
        <PleaseWaitModal v-model="loading" />

        <Maintenance v-if="isMaintenanceMode()"/>

        <Problem v-else-if="showProblemScreen" />

        <NuxtLayout v-else>
            <NuxtPage />
        </NuxtLayout>
    </div>
</template>

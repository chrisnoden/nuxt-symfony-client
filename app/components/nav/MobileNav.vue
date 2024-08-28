<script setup lang="ts">
import UserNavItem from '~/components/nav/UserNavItem.vue';
import ToolsNavItem from '~/components/nav/ToolsNavItem.vue';
import { Bars3Icon, XMarkIcon } from '@heroicons/vue/24/outline';
import {
    Dialog,
    DialogPanel,
} from '@headlessui/vue'
import Logo from '~/components/branding/Logo.vue';
import EnvIndicatorItem from '~/components/nav/EnvIndicatorItem.vue';

defineProps<{
    items: {
        name: string,
        href: string,
    }[]
}>()

const nuxtApp = useNuxtApp();

const open = ref<boolean>(false);
const route = useRoute();

nuxtApp.hook("page:start", () => {
    open.value = false;
});

const isCurrent = (link: string): boolean => route.path === link;
</script>

<template>
    <div class="w-full bg-menu-bg dark:bg-menu-bg-dark text-menu-fg dark:text-menu-fg-dark">
        <div class="flex justify-between items-center">
            <div class="flex flex-shrink-0 items-center ml-2">
                <Logo />
            </div>

            <div class="flex flex-row gap-4 items-center">
                <EnvIndicatorItem/>

                <button
                    class="mr-2 relative inline-flex items-center justify-center rounded-md p-2 hover:bg-core-light-200 hover:text-core-light-700 hover:dark:bg-core-dark-800 hover:dark:text-core-dark-400 focus:outline-none">
                    <span class="sr-only">Open main menu</span>
                    <Bars3Icon v-if="!open" class="block h-8 w-8" aria-hidden="true" @click="open = true"/>
                </button>
            </div>
        </div>

        <Dialog :open="open">
            <div class="fixed inset-0 bg-menu-bg dark:bg-menu-bg-dark z-50 overflow-y-auto">
                <DialogPanel>
                    <div class="w-full flex justify-between items-center">

                        <div class="flex flex-shrink-0 items-center ml-2">
                            <Logo />
                        </div>

                        <div class="flex flex-row gap-4 items-center">
                            <EnvIndicatorItem/>

                            <button
                                class="mr-2 relative inline-flex items-center justify-center rounded-md p-2 hover:bg-core-light-200 hover:text-core-light-700 hover:dark:bg-core-dark-800 hover:dark:text-core-dark-400 focus:outline-none">
                                <span class="sr-only">Close main menu</span>
                                <XMarkIcon class="block h-8 w-8" aria-hidden="true" @click="open = false"/>
                            </button>
                        </div>
                    </div>

                    <div class="w-full h-full">
                        <div class="w-full space-y-1 pb-3 pt-2">
                            <NuxtLink
                                v-for="item in items"
                                :key="item.name" as="a"
                                :to="item.href"
                                :class="[
                                    isCurrent(item.href) ? 'border-core-light-400 bg-core-light-50 text-menu-fg' : 'border-transparent text-menu-fg dark:text-menu-fg-dark hover:bg-core-light-200 hover:text-core-light-700 hover:dark:bg-core-dark-800 hover:dark:text-core-dark-300',
                                    'block border-l-4 py-2 pl-3 pr-4 text-base font-medium'
                                ]"
                                :aria-current="isCurrent(item.href) ? 'page' : undefined"
                            >{{ item.name }}
                            </NuxtLink>
                        </div>

                        <ToolsNavItem type="mobile"/>

                        <UserNavItem type="mobile"/>
                    </div>
                </DialogPanel>
            </div>
        </Dialog>
    </div>

</template>

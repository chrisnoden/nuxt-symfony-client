<script setup lang="ts">
import { Menu, MenuButton, MenuItems } from '@headlessui/vue';
import { CogIcon } from '@heroicons/vue/24/outline';
import { filter } from 'lodash-es';
import MobileNavLink from '~/components/nav/MobileNavLink.vue';
import DropdownMenuItem from '~/components/nav/DropdownMenuItem.vue';

const { type } = defineProps<{ type: 'desktop' | 'mobile' }>()

const menuItems = [
    { name: 'User Administration', href: '/users', roles: [ 'ROLE_USER_ADMINISTRATION' ] },
]

const filteredItems = computed(() => filter(menuItems, (i) => hasRole(i.roles)));
</script>

<template>
    <div
        v-if="filteredItems.length > 0"
        class="sm:inline-flex sm:items-center"
    >
        <Menu v-if="type === 'desktop'" v-slot="{ close }" as="div" class="relative">
            <div>
                <MenuButton
                    class="w-8 h-8 relative flex max-w-xs items-center justify-center rounded-full hover:bg-core-light-100 dark:hover:bg-core-dark-700 focus:outline-none focus:ring-2 focus:ring-highlight-500 focus:ring-offset-2"
                >
                    <span class="sr-only">Open tools menu</span>
                    <CogIcon class="w-7 h-7 text-gray-400" />
                </MenuButton>
            </div>
            <transition
                enter-active-class="transition ease-out duration-200"
                enter-from-class="transform opacity-0 scale-95"
                enter-to-class="transform opacity-100 scale-100"
                leave-active-class="transition ease-in duration-75"
                leave-from-class="transform opacity-100 scale-100"
                leave-to-class="transform opacity-0 scale-95"
            >
                <MenuItems
                    class="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-menu-popup-bg dark:bg-menu-popup-bg-dark py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
                >
                    <DropdownMenuItem
                        v-for="item in filteredItems"
                        :key="item.name"
                        :name="item.name"
                        :href="item.href"
                        :roles="item.roles"
                        @mouseup="close"
                    />
                </MenuItems>
            </transition>
        </Menu>

        <div v-if="type === 'mobile'" class="border-t border-core-light-200 pb-3">
            <div class="flex items-center px-4 py-2">
                <CogIcon class="w-8 h-8 text-core-light-400" />
                <div class="ml-2">
                    <div class="text-base font-medium text-core-light-800 dark:text-core-dark-300">Tools</div>
                </div>
            </div>

            <div class="w-full mt-3 space-y-1">
                <MobileNavLink
                    v-for="item in filteredItems"
                    :key="item.name"
                    :item="item"
                />
            </div>
        </div>
    </div>

</template>

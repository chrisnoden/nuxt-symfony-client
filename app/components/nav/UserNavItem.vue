<script setup lang="ts">
import { Menu, MenuButton, MenuItems } from '@headlessui/vue';
import MobileNavLink from '~/components/nav/MobileNavLink.vue';
import DropdownMenuItem from '~/components/nav/DropdownMenuItem.vue';

const { type } = defineProps<{ type: 'desktop' | 'mobile' }>()

const session = useSessionStore();

const userNavigation = [
    { name: 'Your Profile', href: '/profile', roles: [], },
    { name: 'Sign out', href: '/security/logout', roles: [], },
]

const initials = (): string => session.name?.replace(/[^a-zA-Z- ]/g, '')
    .match(/\b\w/g)?.join('').substring(0,2) ?? '';
</script>

<template>
    <div class="sm:inline-flex sm:items-center">
        <Menu v-if="type === 'desktop'" v-slot="{ close }" as="div" class="relative">
            <div>
                <MenuButton
                    class="w-8 h-8 relative flex max-w-xs items-center justify-center rounded-full hover:bg-core-light-100 dark:hover:bg-core-dark-700 text-sm text-core-light-500 dark:text-core-dark-300 focus:outline-none focus:ring-2 focus:ring-highlight-500 focus:ring-offset-2"
                >
                    <span class="sr-only">Open user menu</span>
                    {{ initials() }}
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
                        v-for="item in userNavigation"
                        :key="item.name"
                        :name="item.name"
                        :href="item.href"
                        :roles="item.roles"
                        @mouseup="close"
                    />
                </MenuItems>
            </transition>
        </Menu>

        <div v-if="type === 'mobile'" class="border-t border-gray-200 pb-3 pt-4">
            <div class="flex items-center px-4">
                <div
                    class="flex-shrink-0 flex items-center justify-center w-10 h-10 bg-core-light-200 text-core-light-500 dark:bg-core-dark-600 dark:text-core-dark-400 rounded-full">
                    {{ initials() }}
                </div>
                <div class="ml-2">
                    <div class="text-base font-medium text-core-light-800 dark:text-core-dark-300">{{ session.name }}</div>
                    <div class="text-sm font-medium text-core-light-500 dark:text-core-dark-400">{{ session.email }}</div>
                </div>
            </div>
            <div class="mt-3 space-y-1">
                <MobileNavLink
                    v-for="item in userNavigation"
                    :key="item.name"
                    :item="item"
                />
            </div>
        </div>
    </div>

</template>

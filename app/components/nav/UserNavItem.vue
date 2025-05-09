<script setup lang="ts">
import { Menu, MenuButton, MenuItems } from '@headlessui/vue';
import MobileNavLink from '~/components/nav/MobileNavLink.vue';
import DropdownMenuItem from '~/components/nav/DropdownMenuItem.vue';
import DropdownMenuGroup from '~/components/nav/DropdownMenuGroup.vue';

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
    <div
        :class="[
            type === 'desktop' && 'sm:inline-flex sm:items-center',
        ]"
    >
        <Menu v-if="type === 'desktop'" v-slot="{ close }" as="div" class="relative">
            <div>
                <MenuButton
                    class="relative flex h-8 w-8 max-w-xs items-center justify-center rounded-full text-sm text-core-light-500 hover:bg-core-light-100 focus:ring-highlight-500 focus:outline-none focus:ring-2 focus:ring-offset-2 dark:text-core-dark-300 dark:hover:bg-core-dark-700"
                >
                    <span class="sr-only">Open user menu</span>
                    {{ initials() }}
                </MenuButton>
            </div>
            <DropdownMenuGroup>
                <DropdownMenuItem
                    v-for="item in userNavigation"
                    :key="item.name"
                    :name="item.name"
                    :href="item.href"
                    :roles="item.roles"
                    @mouseup="close"
                />
            </DropdownMenuGroup>
        </Menu>

        <div v-if="type === 'mobile'" class="border-t border-gray-200 pt-4 pb-3">
            <div class="flex items-center px-4">
                <div
                    class="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-core-light-200 text-core-light-500 dark:bg-core-dark-600 dark:text-core-dark-400">
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

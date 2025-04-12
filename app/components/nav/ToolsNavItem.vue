<script setup lang="ts">
import { Menu, MenuButton } from '@headlessui/vue';
import { CogIcon } from '@heroicons/vue/24/outline';
import { filter } from 'lodash-es';
import MobileNavLink from '~/components/nav/MobileNavLink.vue';
import DropdownMenuItem from '~/components/nav/DropdownMenuItem.vue';
import DropdownMenuGroup from '~/components/nav/DropdownMenuGroup.vue';

const { type } = defineProps<{ type: 'desktop' | 'mobile' }>()

const menuItems = [
    { name: 'Client Administration', href: '/clients', roles: [ 'ROLE_CLIENT_ADMINISTRATION' ] },
    { name: 'User Administration', href: '/users', roles: [ 'ROLE_USER_ADMINISTRATION' ] },
]

const filteredItems = computed(() => filter(menuItems, (i) => hasRole(i.roles)));
</script>

<template>
    <div
        v-if="filteredItems.length > 0"
        :class="[
            type === 'desktop' && 'sm:inline-flex sm:items-center',
        ]"
    >
        <Menu v-if="type === 'desktop'" v-slot="{ close }" as="div" class="relative">
            <div>
                <MenuButton
                    class="relative flex h-8 w-8 max-w-xs items-center justify-center rounded-full hover:bg-core-light-100 focus:ring-highlight-500 focus:outline-none focus:ring-2 focus:ring-offset-2 dark:hover:bg-core-dark-700"
                >
                    <span class="sr-only">Open tools menu</span>
                    <CogIcon class="h-7 w-7 text-gray-400" />
                </MenuButton>
            </div>
            <DropdownMenuGroup>
                <DropdownMenuItem
                    v-for="item in filteredItems"
                    :key="item.name"
                    :name="item.name"
                    :href="item.href"
                    :roles="item.roles"
                    @mouseup="close"
                />
            </DropdownMenuGroup>
        </Menu>

        <div v-if="type === 'mobile'" class="border-t pb-3 border-core-light-200">
            <div class="flex items-center px-4 py-2">
                <CogIcon class="h-8 w-8 text-core-light-400" />
                <div class="ml-2">
                    <div class="text-base font-medium text-core-light-800 dark:text-core-dark-300">Tools</div>
                </div>
            </div>

            <div class="mt-3 w-full space-y-1">
                <MobileNavLink
                    v-for="item in filteredItems"
                    :key="item.name"
                    :item="item"
                />
            </div>
        </div>
    </div>

</template>

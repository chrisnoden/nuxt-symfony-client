<script setup lang="ts">
import { useColorMode } from '@vueuse/core'
import { Menu, MenuButton, MenuItem } from '@headlessui/vue'
import DropdownMenuGroup from '~/components/nav/DropdownMenuGroup.vue';

const colorMode = useColorMode()

const setMode = (mode: 'light'|'dark'|'auto') => {
    colorMode.value = mode;
}
</script>

<template>
    <Menu as="div" class="relative">
        <MenuButton
            class="flex h-8 w-8 items-center justify-center rounded-full hover:bg-gray-100 focus:ring-highlight-500 focus:outline-none focus:ring-2 focus:ring-offset-2 dark:hover:bg-gray-700"
        >
            <Icon
                v-show="colorMode === 'dark'"
                name="radix-icons:moon"
                class="h-5 w-5 text-gray-400"
            />
            <Icon
                v-show="colorMode === 'light'"
                name="radix-icons:sun"
                class="h-5 w-5 text-gray-400"
            />
        </MenuButton>

        <DropdownMenuGroup>
            <div class="py-1">
                <MenuItem>
                    <div
                        class="block cursor-pointer px-4 py-2 text-sm text-menu-fg hover:bg-component-highlight/80"
                        @click="setMode('dark')"
                    >Dark</div>
                </MenuItem>
                <MenuItem>
                    <div
                        class="block cursor-pointer px-4 py-2 text-sm text-menu-fg hover:bg-component-highlight/80"
                        @click="setMode('light')"
                    >Light</div>
                </MenuItem>
                <MenuItem>
                    <div
                        class="block cursor-pointer px-4 py-2 text-sm text-menu-fg hover:bg-component-highlight/80"
                        @click="setMode('auto')"
                    >System</div>
                </MenuItem>
            </div>
        </DropdownMenuGroup>
    </Menu>
</template>

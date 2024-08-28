<script setup lang="ts">
import { useColorMode } from '@vueuse/core'
import { Menu, MenuButton, MenuItems, MenuItem } from '@headlessui/vue'

const colorMode = useColorMode()

const setMode = (mode: 'light'|'dark'|'auto') => {
    colorMode.value = mode;
}
</script>

<template>
    <Menu as="div" class="relative">
        <MenuButton
            class="h-8 w-8 flex items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-highlight-500 focus:ring-offset-2"
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

        <transition
            enter-active-class="transition ease-out duration-100"
            enter-from-class="transform opacity-0 scale-95"
            enter-to-class="transform opacity-100 scale-100"
            leave-active-class="transition ease-in duration-75"
            leave-from-class="transform opacity-100 scale-100"
            leave-to-class="transform opacity-0 scale-95"
        >
            <MenuItems class="absolute right-0 z-10 mt-2 w-fit origin-top-right rounded-md bg-menu-popup-bg dark:bg-menu-popup-bg-dark shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                <div class="py-1">
                    <MenuItem v-slot="{ active }">
                        <div
                            class="block cursor-pointer text-sm px-4 py-2 hover:bg-component-highlight/80 text-menu-fg"
                            @click="setMode('dark')"
                        >Dark</div>
                    </MenuItem>
                    <MenuItem v-slot="{ active }">
                        <div
                            class="block cursor-pointer text-sm px-4 py-2 hover:bg-component-highlight/80 text-menu-fg"
                            @click="setMode('light')"
                        >Light</div>
                    </MenuItem>
                    <MenuItem v-slot="{ active }">
                        <div
                            class="block cursor-pointer text-sm px-4 py-2 hover:bg-component-highlight/80 text-menu-fg"
                            @click="setMode('auto')"
                        >System</div>
                    </MenuItem>
                </div>
            </MenuItems>
        </transition>

    </Menu>
</template>

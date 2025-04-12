<script setup lang="ts">
import { MenuItems } from '@headlessui/vue';
</script>

<template>
    <transition
        enter-active-class="transition duration-200 ease-out"
        enter-from-class="scale-95 transform opacity-0"
        enter-to-class="scale-100 transform opacity-100"
        leave-active-class="transition duration-75 ease-in"
        leave-from-class="scale-100 transform opacity-100"
        leave-to-class="scale-95 transform opacity-0"
    >
        <MenuItems
            class="absolute right-0 z-10 pl-2 pr-4 mt-2 w-fit origin-top-right whitespace-nowrap rounded-md py-1 shadow-lg ring-1 ring-core-light-200 bg-menu-popup-bg focus:outline-none dark:bg-menu-popup-bg-dark"
        >
            <slot/>
        </MenuItems>
    </transition>
</template>

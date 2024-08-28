<script setup lang="ts">
import DarkModeMenuItem from '~/components/nav/DarkModeMenuItem.vue';
import Logo from '~/components/branding/Logo.vue';
import ToolsNavItem from '~/components/nav/ToolsNavItem.vue';
import UserNavItem from '~/components/nav/UserNavItem.vue';
import EnvIndicatorItem from '~/components/nav/EnvIndicatorItem.vue';
import DesktopNavLink from '~/components/nav/DesktopNavLink.vue';

defineProps<{
    items: {
        name: string,
        href: string,
    }[]
}>()
</script>

<template>
    <nav class="sticky top-0 bg-menu-bg dark:bg-menu-bg-dark text-menu-fg dark:text-menu-fg-dark w-full z-40">

        <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div class="flex h-12 justify-between">
                <div class="flex">
                    <div class="flex flex-shrink-0 items-center">
                        <Logo />
                    </div>
                    <div class="hidden sm:-my-px sm:ml-6 sm:flex sm:space-x-8">
                        <DesktopNavLink
                            v-for="item in items"
                            :key="item.name"
                            :item="item"
                        />
                    </div>
                </div>
                <div class="hidden sm:ml-6 sm:flex sm:items-center space-x-3">
                    <EnvIndicatorItem/>

                    <DarkModeMenuItem/>

                    <!-- Tools dropdown -->
                    <ToolsNavItem type="desktop" />

                    <!-- Profile dropdown -->
                    <UserNavItem type="desktop" />
                </div>
            </div>
        </div>

    </nav>
</template>

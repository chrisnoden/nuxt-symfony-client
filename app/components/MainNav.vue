<script setup lang="ts">
import DesktopNav from '~/components/nav/DesktopNav.vue';
import MobileNav from '~/components/nav/MobileNav.vue';

const navigation = [
    { name: 'Dashboard', href: '/' },
]
</script>

<template>
    <DesktopNav
        class="hidden sm:block"
        :items="navigation"
    />

    <MobileNav
        class="sm:hidden"
        :items="navigation"
    />
</template>

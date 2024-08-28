<script setup lang="ts">
import Logo from '~/components/branding/Logo.vue';

definePageMeta({
    layout: 'minimal'
})
</script>

<template>
    <div
        class="flex flex-1 flex-col justify-center items-center sm:px-6 py-12 lg:px-8"
    >
        <div
            class="border rounded-lg w-full max-w-2xl mx-auto mb-12 bg-body-bg"
        >
            <div class="px-6 sm:px-16 py-8">
                <div class="sm:mx-auto">
                    <Logo />
                </div>

                <div
                    class="sm:mx-auto sm:w-full sm:max-w-sm lg:max-w-lg text-center py-6"
                >
                    <h2 class="uppercase !text-core-light-800">
                        Your login has been activated
                    </h2>
                </div>
            </div>
        </div>

        <div>
            <NuxtLink
                to="/"
                class="text-center text-base leading-6 border rounded-lg px-8 py-2 hover:bg-highlight-200 uppercase cursor-pointer text-highlight-600 font-semibold"
            >Login</NuxtLink>
        </div>
    </div>
</template>

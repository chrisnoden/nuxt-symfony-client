<script setup lang="ts">
import SecurityLogo from '~/components/security/SecurityLogo.vue';

definePageMeta({
    layout: 'minimal'
})
</script>

<template>
    <div
        class="flex flex-1 flex-col justify-center sm:px-6 py-12 lg:px-8"
    >
        <div
            class="border rounded-lg w-full max-w-2xl mx-auto mb-12 bg-body-bg"
        >
            <div class="px-6 sm:px-16 py-8">
                <SecurityLogo />

                <div
                    class="sm:mx-auto sm:w-full sm:max-w-sm lg:max-w-lg text-center"
                >
                    <h2 class="uppercase !text-core-light-800">If you have entered a valid email address you will shortly receive an email with further instructions</h2>
                </div>
            </div>
        </div>

        <div class="w-full text-center text-sm leading-6">
            <NuxtLink
                to="/security/login"
                class="font-semibold text-highlight-600 hover:text-highlight-500"
            >Back To Login</NuxtLink>
        </div>
    </div>
</template>

<script setup lang="ts">
definePageMeta({
    layout: 'minimal'
})
</script>

<template>
    <div
        class="flex flex-1 flex-col items-center justify-center px-6 py-12 lg:px-8"
    >
        <div class="flex flex-col items-center justify-center border rounded-xl shadow-lg px-6 py-8 bg-red-200">
            <h1 class="uppercase pb-8 sm:pb-16 text-center">UNEXPECTED PROBLEM</h1>

            <p class="font-bold text-center">
                Sorry, but we seem to be having some unexpected problems.
                <br>Please try again in a few minutes.
            </p>
            <p>
                If this problem persists, please raise a support ticket.
            </p>
        </div>
    </div>
</template>

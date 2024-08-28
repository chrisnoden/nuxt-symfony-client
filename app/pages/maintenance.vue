<script setup lang="ts">
definePageMeta({
    layout: 'minimal'
})

onMounted(() => {
    setTimeout(() => {
        window.location.reload()
    }, 20000);
})
</script>

<template>
    <div
        class="flex flex-1 flex-col items-center justify-center px-6 py-12 lg:px-8"
    >
        <h1 class="uppercase pb-8">MAINTENANCE</h1>

        <p>
            Sorry, but we're undergoing some essential maintenance. Won't be long...
        </p>
    </div>
</template>

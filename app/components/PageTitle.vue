<template>
    <header class="relative isolate mb-4 overflow-hidden py-2 bg-core-light-200 dark:bg-core-dark-900 md:py-4">
        <div class="hidden md:absolute md:-top-10 md:right-1/2 md:-z-10 md:mr-10 md:block md:transform-gpu md:blur-3xl" aria-hidden="true">
            <div
                class="aspect-[1097/845] w-[68.5625rem] bg-gradient-to-tr from-[#ff4694] to-[#776fff] opacity-20"
                style="clip-path: polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)"
            />
        </div>
        <div
            class="absolute -top-52 left-1/2 -z-10 -translate-x-1/2 transform-gpu blur-3xl md:top-[-28rem] md:ml-16 md:translate-x-0 md:transform-gpu"
            aria-hidden="true"
        >
            <div class="aspect-[1097/845] w-[68.5625rem] bg-gradient-to-tr from-[#ff4694] to-[#776fff] opacity-20" style="clip-path: polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)" />
        </div>

        <div class="mx-auto max-w-7xl px-6 lg:px-8">
            <Breadcrumbs />

            <div>
                <div class="text-3xl font-bold uppercase tracking-tight text-core-light-800 dark:text-core-dark-100 md:text-5xl">
                    <slot/>
                </div>
                <p
                    v-if="$slots.text"
                    class="mt-2 text-xs leading-4 text-core-light-700 dark:text-core-dark-300 lg:text-sm"
                >
                    <slot name="text" />
                </p>
            </div>
        </div>
    </header>
</template>
<script setup lang="ts">
</script>

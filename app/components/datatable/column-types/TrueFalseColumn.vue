<script setup lang="ts" generic="T">
const { activeClass, inactiveClass, value } = defineProps<{
    value: boolean,
    activeClass?: string,
    inactiveClass?: string,
    activeValue?: string,
    inactiveValue?: string,
}>();
</script>

<template>
    <div
        class="uppercase text-center not-italic font-bold rounded-md px-1 py-0.5"
        :class="[
            value
                ? (activeClass ?? 'text-green-800 bg-green-200')
                : (inactiveClass ?? 'text-red-800 bg-red-200'),
        ]"
    >
        {{
            value
                ? (activeValue ?? 'yes')
                : (inactiveValue ?? 'no')
        }}
    </div>
</template>

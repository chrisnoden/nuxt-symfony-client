<script setup lang="ts">
import SecurityRepository from '~~/repositories/security-repository';

definePageMeta({
    layout: 'minimal'
})
const sr = new SecurityRepository();
const session = useSessionStore();

const doLogout = async() => {
    await sr.logout();
    session.$reset();
}

onMounted(() => {
    doLogout();

    setTimeout(() => {
        navigateTo('/security/login')
    }, 2000);
})
</script>

<template>
    <div
        class="flex flex-1 flex-col items-center justify-center px-6 py-12 lg:px-8"
    >
        <h1 class="uppercase">You have been logged out</h1>
    </div>
</template>

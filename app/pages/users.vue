<script setup lang="ts">
import pageNeedsRole from '~/composables/page-needs-role';

// bounce users that don't have this role
pageNeedsRole('ROLE_USER_ADMINISTRATION');
</script>

<template>
    <div class="w-full">
        <NuxtPage />
    </div>
</template>

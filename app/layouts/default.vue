<script setup lang="ts">
import { useEventBus } from '@vueuse/core';
import { onMounted } from 'vue';
import ApiErrorModal from '~/components/modal/ApiErrorModal.vue';
import { useConfigStore } from '~/stores/config-store';
import ConfigRepository from '~~/repositories/config-repository';
import Notifications from '~/components/Notifications.vue';

const bus = useEventBus<boolean>('rate-limited-exceeded');
const apiRateLimitExceeded = ref<boolean>(false);
const config = useConfigStore();

const fetchConfig = async() => {
    const configRepository = new ConfigRepository();

    config.setConfig(await configRepository.fetch());
}

onMounted(() => {
    fetchConfig();

    bus.on(() => {
        apiRateLimitExceeded.value = true;
    })
})

</script>

<template>
    <div class="flex-1 flex flex-col outer-container">
        <MainNav/>
        <Notifications/>

        <div class="w-full">
            <slot/>
        </div>
    </div>

    <ApiErrorModal
        v-model="apiRateLimitExceeded"
        title="API Rate Limit Exceeded"
        :timeout="60"
    >
        Our platform is protected against too many requests in a short space of time.
        You have managed to exceed this limit. This may be a bug in our code, so please
        let us know if you keep experiencing this problem - provide us with what you were trying to
        do when this error appeared
    </ApiErrorModal>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useEventBus } from '@vueuse/core';
import { Notification, NotificationGroup, notify } from 'notiwind';
import {
    BellIcon,
    CheckCircleIcon,
    InformationCircleIcon,
    ExclamationCircleIcon,
    ExclamationTriangleIcon,
} from '@heroicons/vue/20/solid';
import { Str } from '~~/utils/str';

const bus = useEventBus<string>('notifications');

onMounted(() => {
    bus.on((type, props) => {
        const { life, message } = props;
        let title = Str.title(type);

        switch (type) {
            case 'success':
                break;
            case 'warn':
            case 'notice':
            case 'warning':
                title = 'Notice';
                break;
            case 'info':
                break;
            case 'error':
                break;

            default:
                // do nothing
                return;
        }

        notify({
            group: 'notifications',
            title,
            text: message,
            type,
        }, typeof life === 'undefined' ? 5000 : life,)
    })
})

const titleClass = (type: string) => {
    switch (type) {
        case 'success':
            return 'text-green-500';
        case 'warn':
        case 'notice':
        case 'warning':
            return 'text-amber-500';
        case 'info':
            return 'text-gray-500';
        case 'error':
            return 'text-red-500';

        default:
            // do nothing
            return 'text-green-500';
    }
}

const iconClass = (type: string) => {
    switch (type) {
        case 'success':
            return 'bg-green-500';
        case 'warn':
        case 'notice':
        case 'warning':
            return 'bg-amber-500';
        case 'info':
            return 'bg-gray-500';
        case 'error':
            return 'bg-red-500';

        default:
            // do nothing
            return 'bg-green-500';
    }
}

const icon = (type: string) => {
    switch (type) {
        case 'success':
            return CheckCircleIcon;
        case 'warn':
        case 'notice':
        case 'warning':
            return ExclamationTriangleIcon;
        case 'info':
            return InformationCircleIcon;
        case 'error':
            return ExclamationCircleIcon;

        default:
            // do nothing
            return BellIcon;
    }
}

const textClass = (type: string) => {
    switch (type) {
        case 'success':
            return 'text-gray-600';
        case 'warn':
        case 'notice':
        case 'warning':
            return 'text-gray-600';
        case 'info':
            return 'text-gray-600';
        case 'error':
            return 'text-gray-700 font-medium';

        default:
            // do nothing
            return 'text-gray-600';
    }
}
</script>

<template>
    <ClientOnly>
        <NotificationGroup group="notifications">
            <div
                aria-live="assertive"
                class="fixed inset-0 flex items-start justify-end px-4 py-2 pointer-events-none z-40"
            >
                <div class="w-full max-w-sm">
                    <Notification
                        v-slot="{ notifications }"
                        enter="transform ease-out duration-300 transition"
                        enter-from="translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-4"
                        enter-to="translate-y-0 opacity-100 sm:translate-x-0"
                        leave="transition ease-in duration-500"
                        leave-from="opacity-100"
                        leave-to="opacity-0"
                        move="transition duration-500"
                        move-delay="delay-300"
                    >
                        <div
                            v-for="notification in notifications"
                            :key="notification.id"
                            class="flex w-full max-w-sm mx-auto mt-2 overflow-hidden bg-white rounded-lg shadow-md ring-1 ring-black ring-opacity-5"
                        >
                            <div
                                class="flex items-center justify-center w-12"
                                :class="iconClass(`${notification.type}`)"
                            >
                                <component
                                    :is="icon(`${notification.type}`)"
                                    class="text-white w-6 h-6"
                                />
                            </div>

                            <div class="px-4 py-2 -mx-3">
                                <div class="mx-3">
                                    <span
                                        class="font-semibold"
                                        :class="titleClass(`${notification.type}`)"
                                    >{{ notification.title }}</span>
                                    <p
                                        class="text-sm text-core-light-800"
                                        :class="textClass(`${notification.type}`)"
                                    >
                                        {{ notification.text }}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </Notification>
                </div>
            </div>
        </NotificationGroup>
    </ClientOnly>
</template>

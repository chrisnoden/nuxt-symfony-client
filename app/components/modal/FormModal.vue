<script setup lang="ts">
import { computed } from 'vue'
import { Dialog, DialogPanel, DialogTitle, TransitionChild, TransitionRoot } from '@headlessui/vue'
import { XMarkIcon } from '@heroicons/vue/24/outline'

const props = defineProps<{
    modelValue: boolean,
    title: string,
}>();
const emit = defineEmits(['update:modelValue']);

const onClose = () => {
    emit('update:modelValue', false);
}
const isOpen = computed(() => {
    return props.modelValue;
})
</script>

<template>
    <TransitionRoot
        as="template"
        :show="isOpen"
    >
        <Dialog
            as="div"
            class="relative z-10"
        >
            <TransitionChild
                as="template"
                enter="ease-out duration-300"
                enter-from="opacity-0"
                enter-to="opacity-100"
                leave="ease-in duration-200"
                leave-from="opacity-100"
                leave-to="opacity-0"
            >
                <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
            </TransitionChild>

            <div class="fixed inset-0 z-50 overflow-y-auto">
                <div class="flex min-h-full md:items-center md:justify-center md:p-0">
                    <TransitionChild
                        as="template"
                        enter="ease-out duration-300"
                        enter-from="opacity-0 translate-y-4 md:translate-y-0 md:scale-95"
                        enter-to="opacity-100 translate-y-0 md:scale-100"
                        leave="ease-in duration-200"
                        leave-from="opacity-100 translate-y-0 md:scale-100"
                        leave-to="opacity-0 translate-y-4 md:translate-y-0 md:scale-95"
                    >
                        <DialogPanel class="relative w-full transform overflow-hidden bg-body-bg dark:bg-body-bg-dark text-left transition-all md:my-8 md:max-w-xl lg:max-w-2xl md:rounded-lg md:shadow-xl">
                            <div class="absolute right-0 top-0 pr-4 pt-4">
                                <button
                                    type="button"
                                    class="rounded-md bg-body-bg dark:bg-body-bg-dark text-core-light-400 dark:text-core-dark-600 hover:text-core-light-500 dark:hover:text-core-dark-500 focus:outline-none focus:ring-2 focus:ring-highlight-500 focus:ring-offset-2"
                                    @click="open = false"
                                >
                                    <span class="sr-only">Close</span>
                                    <XMarkIcon
                                        class="h-8 w-8"
                                        aria-hidden="true"
                                        @click="onClose"
                                    />
                                </button>
                            </div>

                            <div class="bg-body-bg dark:bg-body-bg-dark px-4 pt-5 pb-4 md:p-6 md:pb-4">
                                <div class="mt-12 md:mt-3 md:ml-4 md:text-left">
                                    <DialogTitle
                                        as="h3"
                                        class="text-base font-semibold leading-6 text-gray-900"
                                    >
                                        {{ title }}
                                    </DialogTitle>
                                    <div class="my-6">
                                        <slot />
                                    </div>
                                </div>
                            </div>
                            <div
                                v-if="$slots.actions"
                                class="bg-core-light-50 dark:bg-core-dark-950 px-4 pt-3 pb-12 md:flex md:flex-row-reverse md:px-6 md:pb-3"
                            >
                                <slot name="actions"/>
                            </div>
                        </DialogPanel>
                    </TransitionChild>
                </div>
            </div>
        </Dialog>
    </TransitionRoot>
</template>

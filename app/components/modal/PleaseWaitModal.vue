<script setup lang="ts">
import { Dialog, DialogPanel, TransitionChild, TransitionRoot } from '@headlessui/vue'

const props = defineProps<{
    modelValue: boolean,
}>();

const isVisible = ref<boolean>(props.modelValue);
let timeoutID: NodeJS.Timeout | undefined = undefined;

const setVisibility = (v: boolean) => {
    if (v) {
        timeoutID = setTimeout(() => {
            isVisible.value = true;
        }, 150)
    } else {
        clearTimeout(timeoutID);
        isVisible.value = false;
    }
}

watch(() => props.modelValue,
    (modelValue) => {
        setVisibility(modelValue);
    }
)
</script>

<template>
    <TransitionRoot
        as="template"
        :show="isVisible"
    >
        <Dialog
            as="div"
            class="relative z-50"
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
                <div class="fixed inset-0 bg-gray-500/75 transition-opacity" />
            </TransitionChild>

            <div class="fixed inset-0 z-50 overflow-y-auto">
                <div class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                    <TransitionChild
                        as="template"
                        enter="ease-out duration-300"
                        enter-from="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                        enter-to="opacity-100 translate-y-0 sm:scale-100"
                        leave="ease-in duration-200"
                        leave-from="opacity-100 translate-y-0 sm:scale-100"
                        leave-to="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                    >
                        <DialogPanel
                            class="relative transform transition-all"
                        >
                            <div class="sm:flex sm:items-start">
                                <span class="h-24 w-24 block rounded-full border-8 border-t-blue-300 animate-spin" />
                            </div>
                            <div class="w-0 h-0 overflow-hidden">
                                <input
                                    type="text"
                                    name="hidden"
                                    value=""
                                >
                            </div>
                        </DialogPanel>
                    </TransitionChild>
                </div>
            </div>
        </Dialog>
    </TransitionRoot>
</template>

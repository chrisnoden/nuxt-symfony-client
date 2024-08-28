<script setup lang="ts">
import { Dialog, DialogPanel, DialogTitle, TransitionChild, TransitionRoot } from '@headlessui/vue'

const isVisible = defineModel<boolean>();
const props = defineProps<{
    timeout: number,
    title: string,
}>();

const countDown = ref<number>(props.timeout);
let timeoutID: NodeJS.Timeout | undefined = undefined;

const decrementCountDown = () => {
    timeoutID = setTimeout(() => {
        countDown.value -= 1
        if (countDown.value <= 0) {
            clearTimeout(timeoutID);
            isVisible.value = false;
        } else {
            decrementCountDown();
        }
    }, 1000)

}

onMounted(() => {
    decrementCountDown();
})

watch(() => isVisible.value,
    (modelValue) => {
        clearTimeout(timeoutID);
        if (modelValue === true) {
            countDown.value = props.timeout;
            isVisible.value = true;
            decrementCountDown();
        } else {
            isVisible.value = false;
        }
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
                <div class="fixed inset-0 bg-red-500 bg-opacity-75 transition-opacity" />
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
                        <DialogPanel class="relative w-full transform overflow-hidden bg-white text-left transition-all sm:my-8 sm:max-w-lg sm:rounded-lg sm:shadow-xl">
                            <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                                <div class="sm:flex sm:items-start">
                                    <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                                        <DialogTitle
                                            as="h3"
                                            class="text-base font-semibold leading-6 text-gray-900"
                                        >
                                            {{ title }}
                                        </DialogTitle>
                                        <div class="mt-2">
                                            <p class="text-sm text-gray-500">
                                                <slot />
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="bg-gray-50 px-4 pt-3 pb-12 sm:flex sm:flex-row-reverse sm:px-6 sm:pb-3">
                                Please wait... {{ countDown }} seconds
                            </div>
                        </DialogPanel>
                    </TransitionChild>
                </div>
            </div>
        </Dialog>
    </TransitionRoot>
</template>

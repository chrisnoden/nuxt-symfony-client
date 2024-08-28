<script setup lang="ts">
import { defineAsyncComponent } from 'vue';
import SecurityRepository from '~~/repositories/security-repository';
import ProfileItemLabel from '~/components/profile/ProfileItemLabel.vue';

const session = useSessionStore();

const UpdateNameForm = defineAsyncComponent(() => import('~/components/profile/UpdateNameForm.vue'));

const key = ref<number>(0);
const showUpdateModalHasBeenLoaded = ref<boolean>(false);
const showUpdateNameForm = ref<boolean>(false);
const user = ref(session.user);

const onDataChanged = async() => {
    showUpdateNameForm.value = false;
    const security = new SecurityRepository();
    const me = await security.session();

    session.setSession(me);
    user.value = session.user;
    key.value += 1;
}

const onClickShowNameForm = () => {
    showUpdateModalHasBeenLoaded.value = true;
    showUpdateNameForm.value = true;
}
</script>

<template>
    <div>
        <h2 class="text-base font-semibold leading-7 text-core-light-900 py-0">General</h2>

        <dl class="mt-6 space-y-6 divide-y divide-core-light-100 dark:divide-core-dark-700 border-t border-core-light-200 dark:border-core-dark-400 text-sm leading-6">
            <div class="pt-6 sm:flex">
                <ProfileItemLabel>Full name</ProfileItemLabel>
                <dd class="mt-1 flex justify-between gap-x-6 sm:mt-0 sm:flex-auto">
                    <ProfileItemValue>{{ session.name }}</ProfileItemValue>
                    <button
                        type="button"
                        class="font-semibold text-highlight-600 hover:text-highlight-500"
                        @click="onClickShowNameForm"
                    >Update</button>
                </dd>
            </div>
        </dl>
    </div>

    <UpdateNameForm
        v-if="showUpdateModalHasBeenLoaded"
        :key="key"
        v-model="showUpdateNameForm"
        :user="user"
        @change="onDataChanged"
    />
</template>

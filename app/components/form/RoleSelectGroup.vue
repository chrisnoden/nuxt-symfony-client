<script setup lang="ts">
import { filter, find } from 'lodash-es';
import FieldLabel from '~/components/form/FieldLabel.vue';
import RoleItem from '~/components/form/elements/RoleItem.vue';

const session = useSessionStore();
const userRoles = defineModel<Roles[]>({ required: true});
const props = withDefaults(defineProps<{
    disabled?: boolean,
    errors?: ValidationErrorType[],
    name?: string,
}>(), {
    disabled: false,
    errors: undefined,
    name: 'roles',
})

const availableRoles:RoleType[] = [
    {
        name: 'User Admin',
        description: 'Able to create and edit users.',
        role: 'ROLE_USER_ADMINISTRATION',
    },
]

if (session.hasRole('ROLE_CLIENT_ADMINISTRATION') && session.user?.client.id === 1) {
    availableRoles.push(
        {
            name: 'Client Admin',
            description: 'Able to create and edit clients.',
            role: 'ROLE_CLIENT_ADMINISTRATION',
        },
    )
}

const toggleRole = (role: RoleType) => {
    if (!props.disabled) {
        userRoles.value = [];

        let newRoles = unref(userRoles);

        if (userHasRole(role.role)) {
            newRoles = filter(userRoles.value, (r: Roles) => r !== role.role);
        } else {
            newRoles.push(role.role);
        }

        userRoles.value = newRoles;
    }
}

const userHasRole = (role: Roles): boolean => userRoles.value.includes(role);

const hasError = computed((): boolean => undefined !== find(props.errors, (e) => e?.field === props.name));
const error = computed(
    (): string|undefined => find(props.errors, (e) => e?.field === props.name)?.message ?? undefined
)
</script>

<template>
    <div class="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:py-6">
        <div class="flex flex-col">
            <FieldLabel>Additional Permissions</FieldLabel>

            <div
                v-if="hasError"
                class="text-red-600 text-xs"
            >{{ error }}</div>
        </div>

        <div class="relative mt-2 sm:col-span-2 sm:mt-0 w-full">
            <div
                v-if="disabled && userRoles.length <= 1 && userRoles[0] === 'ROLE_USER'"
                class="text-core-light-600 dark:text-core-dark-400"
            >NONE (Standard User)</div>

            <div
                v-else
                class="space-y-4"
            >
                <div
                    v-for="role in availableRoles"
                    :key="role.name"
                    :class="[
                        (disabled && !userHasRole(role.role)) ? 'h-0' : 'h-fit',
                        'overflow-hidden transition-height duration-700',
                    ]"
                >
                    <RoleItem
                        :checked="userHasRole(role.role)"
                        :disabled="disabled"
                        :description="role.description"
                        :name="role.name"
                        @click="toggleRole(role)"
                    />
                </div>
            </div>
        </div>
    </div>
</template>

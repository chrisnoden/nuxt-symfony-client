import { FetchError } from 'ofetch';
import { useEventBus } from '@vueuse/core';

export const handleApiError = (error: unknown): void => {
    if (error instanceof FetchError) {
        const rateLimitBus = useEventBus<boolean>('rate-limited-exceeded');
        const notifications = useNotifications();

        switch (error.statusCode) {
            case 400:
                notifications.error(error.data?.message ?? 'Unknown error - please inform tech support');
                break;

            case 401:
                if (window) {
                    window.document.location.reload();
                }
                break;

            case 404:
                notifications.warning(error.data?.message ?? '404 Not Found');
                break;

            case 403:
                if (error.statusMessage === 'CSRF Token Mismatch') {
                    notifications.error('Please refresh your browser window to continue');
                } else {
                    notifications.error(error.data?.message ?? 'You do not have suitable permissions');
                }
                break;

            case 409:
                notifications.warning(error.data?.message ?? 'Data edit conflict - check not open by another user');
                break;

            case 429:
                rateLimitBus.emit(true);
                break;

            case 500:
                notifications.error(error.data?.message ?? 'Code error - please inform tech support');
                break;

            default:
                notifications.error('Unsupported error - please inform tech support');
        }

    }
}

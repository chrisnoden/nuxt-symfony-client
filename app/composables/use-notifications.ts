import { useEventBus } from '@vueuse/core';

export default function useNotifications() {
    const bus = useEventBus<string>('notifications');

    function error(message: string, life?: number): void {
        bus.emit(
            'error',
            {
                message,
                life: life,
            }
        )
    }

    function info(message: string, life?: number): void {
        bus.emit(
            'info',
            {
                message,
                life: life,
            }
        )
    }

    function notice(message: string, life?: number): void {
        bus.emit(
            'notice',
            {
                message,
                life: life,
            }
        )
    }

    function success(message: string, life?: number): void {
        bus.emit(
            'success',
            {
                message,
                life: life,
            }
        )
    }

    function warning(message: string, life?: number): void {
        bus.emit(
            'warning',
            {
                message,
                life: life,
            }
        )
    }

    return { error, info, notice, success, warning };
}

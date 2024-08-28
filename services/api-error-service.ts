import type { IFetchError } from 'ofetch';
import { useEventBus } from '@vueuse/core';
import { each } from 'lodash-es';

type IError = {
    data: Record<string, string|number|null>,
    message: string,
    statusCode: number,
    statusMessage: string,
}

export class ApiErrorService {
    private _response: IFetchError | undefined;
    public validationErrors = ref<ValidationErrorType[]>([]);

    private _hasValidationErrors(): boolean {
        return (
            undefined !== this._response?.data
            && undefined !== this._response.data?.message
            && undefined !== this._response.data?.errors
            && this._response.data.message === 'The request data failed the validation rules'
        );
    }

    public getErrorMessage(): string {
        return this._response?.data?.error ?? this._response?.data?.message ?? this._response?.message ?? 'Unexpected error';
    }

    public getError(): IError {
        return {
            data: this._response?.data ?? {},
            message: this.getErrorMessage(),
            statusCode: this._response?.statusCode ?? 400,
            statusMessage: this._response?.statusMessage ?? 'Unexpected error',
        }
    }

    public getFirstValidationError(): string | undefined {
        if (this._hasValidationErrors()) {
            const firstError = <{ [key: string]: string }><unknown>Object.values(this._response?.data.errors)[0];

            return Object.values(firstError)[0]
        }

        return undefined;
    }

    private _parseValidationErrors(): void {
        this.validationErrors.value = [];

        each(this._response?.data.errors, (err, field) => {
            const errorSpecifics = Object.values(err);
            if (errorSpecifics.length > 0) {
                this.validationErrors.value.push({
                    field,
                    message: `${errorSpecifics[0]}`,
                })
            }
        })
    }

    // deal with server errors and other non-specific error types
    public handle(response: IFetchError): void {
        this._response = response;
        this.validationErrors.value = [];

        if (this._hasValidationErrors()) {
            this._parseValidationErrors();
        }

        const bus = useEventBus<string>('server-error');
        if (undefined !== this.getError()) {
            const data = this.getError()

            switch (data.statusCode) {
                case 502:
                    bus.emit();
                    break;
            }
        }
    }

    public clear(): void {
        this.validationErrors.value = [];
    }
}

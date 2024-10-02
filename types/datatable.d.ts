import type { Component } from 'vue'
import type { ApiMetaType } from '~~/types/core';

export {

};

declare global {
    interface DataTableAwareApiClientContract<T> {
        entity(): string,

        search(
            query?: unknown,
            page?: number,
            perPage?: number,
            order?: string
        ): Promise<{ data: T[], meta: ApiMetaType }>,
    }

    // Used to define the column in a table
    type DataTableColumnType = {
        component?: Component,
        dataKey?: boolean, // is this the primary field for the data
        defaultSort?: 'asc'|'desc', // only set on one column, which will be the default sort
        hideFromChooser?: boolean,
        id: number,
        props: DataTableColumnPropsType,
        sortable?: boolean,
        visible: boolean,
        width?: number,
    }
}

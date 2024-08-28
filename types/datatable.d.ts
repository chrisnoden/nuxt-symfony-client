import type { Component } from 'vue'

export {

};

declare global {
    type DataAnyType = {
        [key:string]: string|number|boolean|string[]|null,
    }

    // Passed to the column component in a table
    type DataTableColumnPropsType<T> = {
        bodyClass?: string, // classes applied to a cell in the table body
        class?: string, // classes applied to thead and tbody
        field?: string,
        header: string,
        headerClass?: string, // classes applied to thead
        // eslint-disable-next-line no-unused-vars
        value?: (data: T) => string|number|boolean|null, // derive a value
        [key: string]: string|boolean|number|null,
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

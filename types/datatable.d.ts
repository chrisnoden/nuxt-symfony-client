import type { Component } from 'vue'

export {

};

declare global {
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

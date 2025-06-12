import type { RouteLocation } from 'vue-router';
import { type ColumnDef, getCoreRowModel, useVueTable, type VisibilityState } from '@tanstack/vue-table';
import { useStorage } from '@vueuse/core';
import {
    cloneDeep,
    filter,
    find,
    forEach,
    forOwn,
    has,
    isEmpty,
    isObject,
    merge,
    omit,
    sortBy,
    unset
} from 'lodash-es';
import queryString from 'query-string';
import scrollToId from '~/utils/scroll-to-id';

export class DatatableService<TData, TValue> {
    private _apiService: DataTableAwareApiClientContract<TData>;
    private _data = ref<TData[]>([]);
    private _filterBus;
    private _pendingFilters: Record<string, unknown> = {};
    private _meta = ref<ApiMetaType>();
    private _selectedItems: SelectedRowType<TData>[] = ([]);
    private _state;
    private _vueTable;
    private _options: DataTableOptionsType = {
        filters: undefined,
        order: undefined,
        page: 1,
        perPage: 24,
    }
    private _queryProps: Record<string, string|number|boolean|undefined> = {};
    public columns = ref();
    public isLoading = ref<boolean>(true);
    public isReady = ref<boolean>(false);
    public viewType = ref<ViewTypeType>();

    public data = computed((): Ref<TData[]> => {
        if (undefined === this._data.value) {
            return toRef([]);
        }

        return <Ref<TData[]>>this._data;
    })
    public meta = computed((): ApiMetaType|undefined => this._meta.value);

    constructor(
        apiService: DataTableAwareApiClientContract<TData>,
        columns: ColumnDef<TData, TValue>[],
        options: {
            defaultSortField?: string,
        }
    ) {
        this._apiService = apiService;
        this._state = useStorage(`dt-${apiService.entity()}`, {
            visibleColumns: this._setDefaultColumnVisibility(columns),
        });
        this._filterBus = useEventBus(`dt-${apiService.entity()}-filters`);
        const route = useRoute();

        this._options.perPage = this._defaultPerPage();

        // set the tanstack / vue table properties
        this._vueTable = useVueTable({
            data: this.data.value,
            enableSorting: true,
            manualSorting: true,
            get columns() { return columns },
            getCoreRowModel: getCoreRowModel(),
            initialState: {
                columnVisibility: this._state.value.visibleColumns,
            },
            onColumnVisibilityChange: updaterOrValue => this._setColumnVisibility(updaterOrValue),
            onSortingChange: updaterOrValue => this._setSorting(updaterOrValue),
        })

        // set sort defaults
        if (undefined !== options.defaultSortField) {
            this._options.order = options.defaultSortField;
        }

        // set any values from the URL
        this._setFiltersFromQuery(route);
        this.columns.value = this._vueTable.getAllColumns();

        this.isReady.value = true;

        this._filterBus.on(async (type, props) => {
            switch (type) {
                case 'setFilter':
                    forEach(props, (v, k) => this._pendingFilters[k] = v);
                    break;

                case 'applyFilters':
                    await this._setQueryFromPendingFilters();
                    this._filterBus.emit('filtersApplied');
            }
        })

        watch(route, async (to) => {
            await this.routeChange(to);
            scrollToId('top-of-section', -110);
        })
    }

    private _defaultPerPage(): number {
        return 24;
    }

    private async _fetchData() {
        this.isLoading.value = true;
        const options = this._getOptions();

        try {
            const response = await this._apiService.search(
                options.filters,
                options.page,
                options.perPage,
                options.order
            );

            this._data.value = response.data;
            this._meta.value = response.meta;
            // eslint-disable-next-line no-unused-vars,@typescript-eslint/no-unused-vars
        } catch (e) { /* empty */ }

        this.isLoading.value = false;
    }

    private _getOptions(): DataTableOptionsType {
        if (isEmpty(this._options.filters) || !this._options.filters) {
            this._options.filters = undefined;
        }

        return this._options;
    }

    private _resetOptions(): void {
        this._options.order = undefined;
        this._options.page = 1;
        this._options.perPage = this._defaultPerPage();
        this._options.filters = undefined;
        this._selectedItems = [];
        this._filterBus.emit('selectionChange', this._selectedItems);
    }

    private _setColumnVisibility(v: unknown) {
        if (typeof v === 'function') {
            this._state.value.visibleColumns = merge(this._state.value.visibleColumns, v());
            this.columns.value = this._vueTable.getAllColumns();
        }
    }

    private _setDefaultColumnVisibility(columns: ColumnDef<TData, TValue>[]): VisibilityState {
        const v: VisibilityState = {};
        forEach(columns, (col) => {
            if (has(col.meta, 'defaultVisible')) {
                const value = col.meta.defaultVisible;
                if (has(col, 'id')) {
                    v[`${col.id}`] = value;
                } else if (has(col, 'accessorKey')) {
                    v[`${col.accessorKey}`] = value;
                }
            }
        })

        return  v;
    }

    private _setFiltersFromQuery(route: RouteLocation): void {
        this._resetOptions();

        const [ , query ] = route.fullPath.split('?', 2);

        if (undefined === query || `${query}`.length <= 1) {
            return;
        }

        const qry = queryString.parse(query as string);

        this._options.filters = omit(qry, ['filters', 'order', 'page', 'perPage', 'viewType']) as object;

        if (undefined !== qry.order) {
            this._options.order = qry.order as string;
        }
        if (undefined !== qry.page) {
            this._options.page = parseInt(`${qry.page as string}`, 10);
        }
        if (undefined !== qry.perPage) {
            this._options.perPage = parseInt(`${qry.perPage as string}`, 10);
        }
        if (undefined !== qry.viewType) {
            this.viewType.value = qry.viewType === 'grid' ? 'grid' : undefined;
        }
    }

    private async _setQueryFromPendingFilters(): Promise<void> {
        const router = useRouter();
        if (isEmpty(this._pendingFilters)) {
            return;
        }

        const newFilters: Record<string, unknown> = {}
        forEach(this._pendingFilters, (v, k) => {
            if (isObject(v)) {
                forOwn(v, (i, j) => {
                    newFilters[j] = i;
                })
            } else {
                newFilters[k] = v
            }
        });
        this._options.filters = newFilters;
        this._options.page = 1;

        const route = useRoute();
        const query = omit(cloneDeep(route?.query ?? {}), ['page']);
        forEach(this._options.filters, (v, k) => query[k] = v);

        const q = queryString.stringify(query, { skipNull: true, skipEmptyString: true });
        await router.push(`?${q}`);

        this._pendingFilters = {};
    }

    private async _setSorting(v: unknown) {
        if (typeof v === 'function' && v().length > 0) {
            if (!has(v()[0], 'id')) {
                return;
            }
            const { id } = v()[0];
            if (this.getSortField() === id && this.getSortOrder() === 'asc') {
                this._options.order = `-${id}`;
            } else if (this.getSortField() === id && this.getSortOrder() === 'desc') {
                this._options.order = undefined;
            } else {
                this._options.order = `${id}`;
            }
            this._options.page = 1;
            await this._fetchData();
            await this._updateBrowserUrl(false);
        }
    }

    private async _updateBrowserUrl(skipHistory?: boolean) {
        const router = useRouter();
        const options = this._getOptions();

        const query: Record<string, string|boolean|number|undefined> & {
            perPage?: number,
            page?: number,
            order?: string,
        } = {
            perPage: options.perPage,
            page: options.page,
        };
        if (options.filters) {
            merge(query, options.filters);
        }
        if (options.order) {
            query.order = options.order;
        }

        // merge in any additional props
        merge(query, this._queryProps);

        const qs = queryString.stringify(query, { skipNull: true, skipEmptyString: true });
        const url = `?${qs}`;

        if (true === skipHistory) {
            await router.replace(url);
        } else {
            await router.push(url);
        }
    }

    public async initialise(): Promise<void> {
        await this._fetchData();
    }

    public async applyFilters(): Promise<void> {
        await this._setQueryFromPendingFilters();
    }

    public getHeaderGroups = () => this._vueTable.getHeaderGroups();

    public getRowModel = () => this._vueTable.getRowModel();

    public getSelectedRows = (): SelectedRowType<TData>[] => this._selectedItems;

    public getSortField(): string|undefined {
        if (undefined === this._options.order) {
            return undefined;
        }

        return this._options.order.substring(0, 1) === '-' ? this._options.order.substring(1) : this._options.order;
    }

    public getSortOrder(): 'asc'|'desc'|undefined {
        if (undefined === this._options.order) {
            return undefined;
        }

        return this._options.order.substring(0, 1) === '-' ? 'desc' : 'asc';
    };

    public isSelected = (rowIdx: number): boolean => undefined !== find(this._selectedItems, (row: SelectedRowType<TData>) => row._idx === rowIdx);
    public isAllRowsSelected = (): boolean => this._selectedItems.length >= this._data.value.length;

    public async onPaginationChange(pagination: ApiPaginationType): Promise<void> {
        this._options.page = pagination.current_page;
        this._options.perPage = pagination.per_page;
        this._selectedItems = [];
        this._filterBus.emit('selectionChange', this._selectedItems);

        await this._updateBrowserUrl(false);
    }

    public async reload(): Promise<void> {
        this.isLoading.value = true;
        this._data.value = [];
        this._meta.value = undefined;
        this._selectedItems = [];
        this._filterBus.emit('selectionChange', this._selectedItems);

        setTimeout(async () => {
            await this._fetchData();
        }, 200);
    }

    public async routeChange(route: RouteLocation): Promise<void> {
        this._setFiltersFromQuery(route);

        await this._fetchData();
    }

    public selectAllRows(selected: boolean): void
    {
        this._selectedItems = [];
        if (selected) {
            forEach(this._data.value, (row, idx) => {
                const rowValue: SelectedRowType<TData> = cloneDeep(row) as SelectedRowType<TData>;
                rowValue._idx = idx;
                this._selectedItems.push(rowValue);
            })
        }

        this._filterBus.emit('selectionChange', this._selectedItems);
    }

    public selectRow(rowIdx: number): void
    {
        const rowValue: SelectedRowType<TData> = cloneDeep(this._data.value[rowIdx]) as SelectedRowType<TData>;
        if (undefined === rowValue || null === rowValue) {
            return;
        }

        rowValue._idx = rowIdx;
        const isSelected = undefined !== find(this._selectedItems, (row) => row._idx === rowIdx);

        if (isSelected) {
            this._selectedItems = filter(this._selectedItems, (row) => row._idx !== rowIdx);
        } else {
            // add the row
            this._selectedItems.push(rowValue);
            // sort the rows
            this._selectedItems = sortBy(this._selectedItems, '_idx');
        }

        this._filterBus.emit('selectionChange', this._selectedItems);
    }

    public async setQueryProp(name: string, value: string|number|boolean|undefined): Promise<void>
    {
        unset(this._queryProps, name);

        if (value) {
            this._queryProps[name] = value;
        }

        await this._updateBrowserUrl();
    }

    public async viewTypeChange(newViewType?: string): Promise<void>
    {
        if (newViewType === 'grid') {
            this.viewType.value = 'grid';
        } else {
            this.viewType.value = undefined;
        }

        await this.setQueryProp('viewType', this.viewType.value);
    }
}

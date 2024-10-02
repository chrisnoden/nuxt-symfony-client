import { cloneDeep, forEach, has, isInteger, isNaN, merge, mergeWith } from 'lodash-es';
import { useStorage } from '@vueuse/core';
import { type ColumnDef, getCoreRowModel, useVueTable, type VisibilityState } from '@tanstack/vue-table';
import queryString from 'query-string';

export class DatatableService<TData, TValue> {
    private _apiService: DataTableAwareApiClientContract<TData>;
    private _data = ref<TData[]>([]);
    private _meta = ref<ApiMetaType>();
    private _state;
    private _vueTable;
    private _options: {
        query?: {
            [key: string]: string | number | null,
        },
        order?: string,
        page: number,
        perPage: number,
    } = {
            query: undefined,
            order: undefined,
            page: 1,
            perPage: 25,
        }
    public columns = ref();
    public isLoading = ref<boolean>(true);
    public isReady = ref<boolean>(false);
    public renderKey = ref<number>(0);

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
        this._setFiltersFromQuery();
        this.columns.value = this._vueTable.getAllColumns();

        this.isReady.value = true;
    }

    private _setColumnVisibility(v: unknown) {
        if (typeof v === 'function') {
            this._state.value.visibleColumns = merge(this._state.value.visibleColumns, v());
            this.columns.value = this._vueTable.getAllColumns();
        }
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
            this.renderKey.value += 1;
        }
    }

    public async initialise(): Promise<void> {
        await this._fetchData();
    }

    async _fetchData() {
        this.isLoading.value = true;

        const response = await this._apiService.search(
            this._options.query,
            this._options.page,
            this._options.perPage,
            this._options.order
        );
        this._data.value = response.data;
        this._meta.value = response.meta;

        this.isLoading.value = false;
    }

    public getHeaderGroups = () => this._vueTable.getHeaderGroups();

    public getRowModel = () => this._vueTable.getRowModel();

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

    public async reload(): Promise<void> {
        await this._fetchData();
    }

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

    public async onPaginationChange(pagination: ApiPaginationType): Promise<void> {
        this._options.page = pagination.current_page;
        this._options.perPage = pagination.per_page;

        await this._fetchData();
        await this._updateBrowserUrl(false);
        this.renderKey.value += 1;
    }

    public async onSort({ sortField, sortOrder }: { sortField: string, sortOrder: number }): Promise<void> {
        if (sortOrder < 0) {
            this._options.order = `-${sortField}`;
        } else {
            this._options.order = sortField;
        }

        this._options.page = 1;
        await this._fetchData();
        await this._updateBrowserUrl(false);
        this.renderKey.value += 1;
    }

    private _setFiltersFromQuery(): void {
        const route = useRoute();

        this._options = mergeWith(cloneDeep(this._options), route.query, (objValue, srcValue) => {
            if (isInteger(objValue) || /^[0-9]+$/.test(srcValue)) {
                if (isNaN(parseInt(srcValue, 10))) {
                    return null;
                }

                return parseInt(srcValue, 10);
            }

            return srcValue;
        })

    }

    private async _updateBrowserUrl(skipHistory?: boolean) {
        const router = useRouter();

        // update the browser URL
        const qs = queryString.stringify(this._options, { skipNull: true, skipEmptyString: true });
        const url = `?${qs}`;
        if (true === skipHistory) {
            await router.replace(url);
        } else {
            await router.push(url);
        }
    }
}

import type { RouteLocation } from 'vue-router';
import { type ColumnDef, getCoreRowModel, useVueTable, type VisibilityState } from '@tanstack/vue-table';
import { useStorage } from '@vueuse/core';
import { cloneDeep, forEach, has, isEmpty, merge, omit } from 'lodash-es';
import queryString from 'query-string';

export class DatatableService<TData, TValue> {
    private _apiService: DataTableAwareApiClientContract<TData>;
    private _data = ref<TData[]>([]);
    private _pendingFilters: Record<string, unknown> = {};
    private _meta = ref<ApiMetaType>();
    private _state;
    private _vueTable;
    private _options: {
        filters?: object,
        order?: string,
        page: number,
        perPage: number,
    } = {
            filters: undefined,
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
        const filterBus = useEventBus(`dt-${apiService.entity()}-filters`);
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

        filterBus.on(async (type, props) => {
            switch (type) {
                case 'setFilter':
                    forEach(props, (v, k) => this._pendingFilters[k] = v);
                    break;

                case 'applyFilters':
                    await this._setQueryFromPendingFilters();
                    filterBus.emit('filtersApplied');
            }
        })

        watch(route, async (to) => {
            await this.routeChange(to);
        })
    }

    private _defaultPerPage(): number {
        const env = useRuntimeConfig();

        return parseInt(`${env.public.TABLE_PER_PAGE_DEFAULT ?? 25}`, 10);
    }

    private async _fetchData() {
        this.isLoading.value = true;

        try {
            const response = await this._apiService.search(
                this._options.filters,
                this._options.page,
                this._options.perPage,
                this._options.order
            );

            this._data.value = response.data;
            this._meta.value = response.meta;
            // eslint-disable-next-line no-unused-vars
        } catch (e) { /* empty */ }

        this.isLoading.value = false;
    }

    private _resetOptions(): void {
        this._options.order = undefined;
        this._options.page = 1;
        this._options.perPage = this._defaultPerPage();
        this._options.filters = undefined;
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

        // this._options.filters = filter(qry, (v, k) => !['order', 'page', 'perPage'].includes(k));
        this._options.filters = omit(qry, ['order', 'page', 'perPage']) as object;

        if (undefined !== qry.order) {
            this._options.order = qry.order as string;
        }
        if (undefined !== qry.page) {
            this._options.page = parseInt(`${qry.page as string}`, 10);
        }
        if (undefined !== qry.perPage) {
            this._options.perPage = parseInt(`${qry.perPage as string}`, 10);
        }
    }

    private async _setQueryFromPendingFilters(): Promise<void> {
        const router = useRouter();
        if (isEmpty(this._pendingFilters)) {
            return;
        }

        const newFilters: Record<string, unknown> = {}
        forEach(this._pendingFilters, (v, k) => {
            newFilters[k] = v
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
            this.renderKey.value += 1;
        }
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

    public async initialise(): Promise<void> {
        await this._fetchData();
    }

    public async applyFilters(): Promise<void> {
        await this._setQueryFromPendingFilters();
    }

    public getHeaderGroups = () => this._vueTable.getHeaderGroups();

    public getRowModel = () => this._vueTable.getRowModel();

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

    public async reload(): Promise<void> {
        this.isLoading.value = true;
        this._data.value = [];
        this._meta.value = undefined;
        setTimeout(async () => {
            await this._fetchData();
        }, 200);
    }

    public async routeChange(route: RouteLocation): Promise<void> {
        this._setFiltersFromQuery(route);

        await this._fetchData();
    }
}

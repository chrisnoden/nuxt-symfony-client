import { cloneDeep, first, has, isInteger, isNaN, mergeWith } from 'lodash-es';
import ColumnComponent from '~/components/datatable/ColumnComponent.vue';
import ColumnDataValue from '~/components/datatable/ColumnDataValue.vue';
import queryString from 'query-string';

export class DatatableService<T> {
    private _apiService: DataTableAwareApiClientContract<T>;
    private readonly _columns: DataTableColumnType[];
    private _meta = ref<ApiPaginationMeta>();
    private _options: {
        query: {
            [key: string]: string | number | null,
        },
        order: string,
        page: number,
        perPage: number,
    } = {
            query: {},
            order: '',
            page: 1,
            perPage: 25,
        }
    public isLoading = ref<boolean>(true);
    public renderKey = ref<number>(0);
    public rows = ref<T[]>();


    constructor(
        apiService: DataTableAwareApiClientContract<T>,
        columns: DataTableColumnType[],
        options: {
            defaultSortField?: string,
        }
    ) {
        this._apiService = apiService;
        this._columns = columns;

        // set sort defaults
        if (undefined !== options.defaultSortField) {
            this._options.order = options.defaultSortField;
        } else {
            this._options.order = first(this._columns)?.props.field ?? '';
        }

        // set any values from the URL
        this._setFiltersFromQuery();
    }

    public async initialise(): Promise<void> {
        await this._fetchData();
    }

    public columnTemplate(column: DataTableColumnType) {
        if (has(column, 'component')) {
            return ColumnComponent;
        }

        return ColumnDataValue;
    }

    public firstRow = computed(() => (this._meta.value?.pagination.per_page ?? 0) * ((this._meta.value?.pagination.current_page ?? 1) - 1));

    async _fetchData() {
        this.isLoading.value = true;

        const response = await this._apiService.search(
            this._options.query,
            this._options.page,
            this._options.perPage,
            this._options.order
        );
        this.rows.value = response.data;
        this._meta.value = response.meta;

        this.isLoading.value = false;
    }

    public getRows = computed((): number => this._meta.value?.pagination.per_page ?? 0);

    public getTotalRecords = computed(
        (): number => this._meta.value?.pagination.total ?? 0
    );

    public async reload(): Promise<void> {
        await this._fetchData();
    }

    public sortField(): string {
        return this._options.order.substring(0, 1) === '-' ? this._options.order.substring(1) : this._options.order;
    }

    public sortOrder(): number {
        return this._options.order.substring(0, 1) === '-' ? -1 : 1;
    };

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

    async _updateBrowserUrl(skipHistory?: boolean) {
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

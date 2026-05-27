import {
	ChangeDetectionStrategy,
	Component,
	computed,
	effect,
	inject,
	input,
	output,
	type Signal,
	signal,
	untracked,
} from "@angular/core";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { AgGridAngular } from "ag-grid-angular";
import {
	type ColDef,
	colorSchemeLightCold,
	type FirstDataRenderedEvent,
	type GridApi,
	type GridOptions,
	type GridReadyEvent,
	type RowClickedEvent,
	type RowSelectionOptions,
	themeAlpine,
} from "ag-grid-community";
import type { Criteria, MenuItemModel, Row, SelectInput, SelectOutput } from "../menu/menuItem.model";
import { AgGridRegistry } from "../services/ag-grid-registry";
import { Data } from "../services/data";
import { FaIconRegistry } from "../services/fa-icon-registry";
import { TabContentDrawer } from "../tab-content-drawer/tab-content-drawer";
import type { TabContentDrawerColumn, TabContentDrawerFormModel } from "../tab-content-drawer/tab-content-drawer.model";
import { createDrawerScenarios } from "./drawer.utils";
import { runHandler } from "./query.utils";
import { createColumnDefs } from "./table.utils";

@Component({
	selector: "app-tab-content-table",
	imports: [AgGridAngular, FontAwesomeModule, TabContentDrawer],
	changeDetection: ChangeDetectionStrategy.OnPush,
	templateUrl: "./tab-content-table.html",
})
export class TabContentTable<T extends object> {
	private gridApi: GridApi<T> | undefined;
	private columnsAutoSized = false;

	drawerData = signal<Record<string, unknown>>({});

	agGridRegistry = inject(AgGridRegistry);
	data = inject(Data);
	faIconRegistry = inject(FaIconRegistry);
	themeAlpine = themeAlpine.withPart(colorSchemeLightCold);

	drawerOpen = signal(false);
	loading = signal(false);
	rowData = signal<T[]>([]);
	criteria = signal<Criteria>({});

	active = input(false);
	menuItem = input.required<MenuItemModel>();
	rowClicked = output<T>();

	criteriaColumns = signal<TabContentDrawerColumn[]>([]);
	drawerTitle = signal("");

	columnDefs: Signal<ColDef<T>[]> = computed(() => {
		const table = this.menuItem().params?.table;

		if (!table) {
			return [];
		}

		return createColumnDefs<T>(table.columns);
	});

	activeTabEffect = effect(() => {
		if (this.active()) {
			untracked(() => {
				this.autoSizeColumnsOnceAfterDataLoaded();
				void this.loadRows();
			});
		}
	});

	rowSelection: RowSelectionOptions = {
		mode: "singleRow",
		enableClickSelection: true,
		checkboxes: false,
	};

	gridOptions: GridOptions<T> = {
		theme: this.themeAlpine,
		suppressCellFocus: true,
		pagination: true,
		paginationPageSize: 50,
		paginationPageSizeSelector: [50, 100, 250, 1000],
		autoSizeStrategy: { type: "fitCellContents" },
		rowSelection: this.rowSelection,
	};

	protected onGridReady(event: GridReadyEvent<T>): void {
		this.gridApi = event.api;
		this.autoSizeColumnsOnceAfterDataLoaded();
	}

	protected onFirstDataRendered(_: FirstDataRenderedEvent<T>): void {
		this.autoSizeColumnsOnceAfterDataLoaded();
	}

	protected onRowClicked(event: RowClickedEvent<T>): void {
		if (!event.data) {
			return;
		}

		this.rowClicked.emit(event.data);
	}

	protected editClicked(): void {
		const scenario = createDrawerScenarios(this.menuItem()).criteria;

		this.drawerTitle.set(scenario.title);
		this.criteriaColumns.set(scenario.columns);
		this.drawerOpen.set(true);
	}

	protected async criteriaSubmitted(criteria: TabContentDrawerFormModel): Promise<void> {
		this.criteria.set(criteria);
		this.closeDrawer();
		await this.loadRows();
	}

	protected closeDrawer(): void {
		this.criteriaColumns.set([]);
		this.drawerTitle.set("");
		this.drawerOpen.set(false);
	}

	protected async refreshClicked(): Promise<void> {
		await this.loadRows();
	}

	private async loadRows(): Promise<void> {
		const select = this.menuItem().params?.table?.handlers?.select;

		if (!select) {
			this.rowData.set([]);
			return;
		}

		this.loading.set(true);

		try {
			const rows = await runHandler<SelectInput, SelectOutput>(
				select,
				{ criteria: this.criteria() },
				this.data.execQuery.bind(this.data),
			);

			this.rowData.set(rows as T[]);
			this.columnsAutoSized = false;
			this.autoSizeColumnsOnceAfterDataLoaded();
		} catch (error: unknown) {
			console.error(error);
			this.rowData.set([]);
		} finally {
			this.loading.set(false);
		}
	}

	private autoSizeColumnsOnceAfterDataLoaded(): void {
		if (this.columnsAutoSized || !this.active() || !this.gridApi) {
			return;
		}

		this.gridApi.autoSizeAllColumns(false);
		this.columnsAutoSized = true;
	}
}

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
	type RowClickedEvent,
	type RowSelectionOptions,
	themeAlpine,
} from "ag-grid-community";
import type { MenuItemModel } from "../menu/menuItem.model";
import { tabContentDrawerTestData } from "../mock-data/tabContentDrawerTest";
import { tableData } from "../mock-data/tableData";
import { AgGridRegistry } from "../services/ag-grid-registry";
import { FaIconRegistry } from "../services/fa-icon-registry";
import { TabContentDrawer } from "../tab-content-drawer/tab-content-drawer";
import type { TabContentDrawerColumn } from "../tab-content-drawer/tab-content-drawer.model";
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
	faIconRegistry = inject(FaIconRegistry);
	themeAlpine = themeAlpine.withPart(colorSchemeLightCold);

	drawerOpen = signal(false);
	loading = signal(false);
	rowData = signal<T[]>(tableData as T[]);

	active = input(false);
	menuItem = input.required<MenuItemModel>();
	rowClicked = output<T>();

	criteriaColumns = signal<TabContentDrawerColumn[]>([]);

	columnDefs: Signal<ColDef<T>[]> = computed(() => {
		const table = this.menuItem().params?.table;

		if (!table) {
			return [];
		}

		return createColumnDefs<T>(table.columns);
	});

	activeTabEffect = effect(() => {
		if (this.active()) {
			untracked(() => this.autoSizeColumnsOnceAfterDataLoaded());
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

	protected onFirstDataRendered(_: FirstDataRenderedEvent<T>): void {
		this.autoSizeColumnsOnceAfterDataLoaded();
	}

	protected onRowClicked(event: RowClickedEvent<T>): void {
		if (!event.data) {
			return;
		}

		this.rowClicked.emit(event.data);
	}

	createCriteriaColumns(): TabContentDrawerColumn[] {
		return tabContentDrawerTestData.criteria.columns;
	}

	protected editClicked(): void {
		this.criteriaColumns.set(this.createCriteriaColumns());
		this.drawerOpen.set(true);
	}

	protected closeDrawer(): void {
		this.criteriaColumns.set([]);
		this.drawerOpen.set(false);
	}

	protected refreshClicked(): void {}

	private autoSizeColumnsOnceAfterDataLoaded(): void {
		if (this.columnsAutoSized || !this.active() || !this.gridApi) {
			return;
		}

		this.gridApi.autoSizeAllColumns(false);
		this.columnsAutoSized = true;
	}
}

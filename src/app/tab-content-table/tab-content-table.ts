import {
	ChangeDetectionStrategy,
	Component,
	computed,
	effect,
	inject,
	input,
	output,
	type Signal,
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
import type { MenuItemModel, Row } from "../menu/models/menu-item-models/index";
import { MenuItemTableService } from "../menu/services/menuItemTable.service";
import { AgGridRegistry } from "../services/ag-grid-registry";
import { FaIconRegistry } from "../services/fa-icon-registry";
import { TabContentDrawer } from "../tab-content-drawer/tab-content-drawer";
import type { TabContentDrawerColumn, TabContentDrawerFormModel } from "../tab-content-drawer/tab-content-drawer.model";

@Component({
	selector: "app-tab-content-table",
	imports: [AgGridAngular, FontAwesomeModule, TabContentDrawer],
	changeDetection: ChangeDetectionStrategy.OnPush,
	templateUrl: "./tab-content-table.html",
	providers: [MenuItemTableService],
})
export class TabContentTable<T extends object> {
	private gridApi: GridApi<T> | undefined;
	private columnsAutoSized = false;
	private initialRetrieveStarted = false;

	agGridRegistry = inject(AgGridRegistry);
	faIconRegistry = inject(FaIconRegistry);
	menuItemTableService = inject(MenuItemTableService);
	themeAlpine = themeAlpine.withPart(colorSchemeLightCold);

	active = input(false);
	menuItem = input.required<MenuItemModel>();
	rowClicked = output<T>();

	loading = this.menuItemTableService.loading;
	drawerOpen = this.menuItemTableService.drawerOpen;
	drawerTitle = this.menuItemTableService.drawerTitle;
	drawerColumns = this.menuItemTableService.drawerColumns as Signal<TabContentDrawerColumn[]>;
	rowData = computed(() => this.menuItemTableService.rows() as unknown as T[]);
	columnDefs = this.menuItemTableService.columnDefs as Signal<ColDef<T>[]>;

	menuItemEffect = effect(() => {
		const menuItem = this.menuItem();
		const menuItemChanged = untracked(() => this.menuItemTableService.setMenuItem(menuItem));

		if (menuItemChanged) {
			this.initialRetrieveStarted = false;
		}
	});

	activeTabEffect = effect(() => {
		if (this.active()) {
			untracked(() => {
				this.autoSizeColumnsOnceAfterDataLoaded();

				if (this.initialRetrieveStarted) {
					return;
				}

				this.initialRetrieveStarted = true;
				void this.menuItemTableService.loadRows().then(() => {
					this.columnsAutoSized = false;
					this.autoSizeColumnsOnceAfterDataLoaded();
				});
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

		this.menuItemTableService.setSelectedRow(event.data as unknown as Row);
		this.rowClicked.emit(event.data);
	}

	protected insertClicked(): void {
		this.menuItemTableService.openInsertDrawer();
	}

	protected updateClicked(): void {
		this.menuItemTableService.openUpdateDrawer();
	}

	protected async deleteClicked(): Promise<void> {
		await this.menuItemTableService.deleteSelectedRow();
		this.columnsAutoSized = false;
		this.autoSizeColumnsOnceAfterDataLoaded();
		await this.menuItemTableService.loadRows();
	}

	protected filterClicked(): void {
		this.menuItemTableService.openCriteriaDrawer();
	}

	protected async drawerSubmitted(model: TabContentDrawerFormModel): Promise<void> {
		await this.menuItemTableService.submitDrawer(model);
		this.columnsAutoSized = false;
		this.autoSizeColumnsOnceAfterDataLoaded();
	}

	protected closeDrawer(): void {
		this.menuItemTableService.closeDrawer();
	}

	protected async refreshClicked(): Promise<void> {
		await this.menuItemTableService.loadRows();
		this.columnsAutoSized = false;
		this.autoSizeColumnsOnceAfterDataLoaded();
	}

	private autoSizeColumnsOnceAfterDataLoaded(): void {
		if (this.columnsAutoSized || !this.active() || !this.gridApi) {
			return;
		}

		this.gridApi.autoSizeAllColumns(false);
		this.columnsAutoSized = true;
	}
}

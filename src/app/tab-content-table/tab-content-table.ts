import {
	ChangeDetectionStrategy,
	Component,
	computed,
	inject,
	input,
	output,
	type Signal,
	signal,
} from "@angular/core";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { AgGridAngular } from "ag-grid-angular";
import {
	type ColDef,
	colorSchemeLightCold,
	type GridOptions,
	type RowClickedEvent,
	type RowSelectionOptions,
	themeAlpine,
} from "ag-grid-community";
import type { MenuItemModel } from "../menu/menuItem.model";
import { tableData } from "../mock-data/tableData";
import { AgGridRegistry } from "../services/ag-grid-registry";
import { FaIconRegistry } from "../services/fa-icon-registry";
import { TabContentDrawer } from "../tab-content-drawer/tab-content-drawer";

@Component({
	selector: "app-tab-content-table",
	imports: [AgGridAngular, FontAwesomeModule, TabContentDrawer],
	changeDetection: ChangeDetectionStrategy.OnPush,
	templateUrl: "./tab-content-table.html",
})
export class TabContentTable<T extends object> {
	protected readonly agGridRegistry = inject(AgGridRegistry);
	protected readonly faIconRegistry = inject(FaIconRegistry);
	protected readonly themeAlpine = themeAlpine.withPart(colorSchemeLightCold);

	protected readonly drawerOpen = signal(false);

	readonly rowData = input<T[]>(tableData as T[]);
	readonly menuItem = input.required<MenuItemModel>();
	readonly rowClicked = output<T>();

	protected readonly columnDefs: Signal<ColDef<T>[]> = computed(() => {
		const rows = this.rowData();

		if (rows.length === 0) {
			return [];
		}

		return Object.keys(rows[0]).map(
			(key): ColDef<T> => ({
				field: key as ColDef<T>["field"],
				filter: true,
				sortable: true,
				editable: false,
				minWidth: 100,
			}),
		);
	});

	protected readonly rowSelection: RowSelectionOptions = {
		mode: "singleRow",
		enableClickSelection: true,
		checkboxes: false,
	};

	protected readonly gridOptions: GridOptions<T> = {
		theme: this.themeAlpine,
		suppressCellFocus: true,
		pagination: true,
		paginationPageSize: 50,
		paginationPageSizeSelector: [50, 100, 250, 1000],
		autoSizeStrategy: { type: "fitCellContents" },
	};

	protected onRowClicked(event: RowClickedEvent<T>): void {
		if (!event.data) {
			return;
		}

		this.rowClicked.emit(event.data);
	}

	protected editClicked(): void {
		this.drawerOpen.set(true);
	}

	protected closeDrawer(): void {
		this.drawerOpen.set(false);
	}
}

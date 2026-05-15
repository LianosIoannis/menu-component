import { ChangeDetectionStrategy, Component, computed, inject, input, output, type Signal } from "@angular/core";
import { AgGridAngular } from "ag-grid-angular";
import {
	type ColDef,
	colorSchemeLightCold,
	type GridOptions,
	type RowClickedEvent,
	type RowSelectionOptions,
	themeAlpine,
} from "ag-grid-community";
import { AgGridRegistry } from "../services/ag-grid-registry";

@Component({
	selector: "app-tab-content-table",
	imports: [AgGridAngular],
	changeDetection: ChangeDetectionStrategy.OnPush,
	templateUrl: "./tab-content-table.html",
})
export class TabContentTable<T extends object> {
	protected readonly agGridRegistry = inject(AgGridRegistry);

	readonly rowData = input<T[]>([]);

	readonly title = input<string>("");

	readonly columnDefsInput = input<ColDef<T>[] | null>(null);

	readonly rowClicked = output<T>();

	protected readonly themeAlpine = themeAlpine.withPart(colorSchemeLightCold);

	protected readonly columnDefs: Signal<ColDef<T>[]> = computed(() => {
		const providedColumnDefs = this.columnDefsInput();

		if (providedColumnDefs) {
			return providedColumnDefs;
		}

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
	};
}

import { ChangeDetectionStrategy, Component, computed, effect, input, output, signal } from "@angular/core";
import { FormField, FormRoot, form, readonly as readonlyField, required } from "@angular/forms/signals";
import type {
	TabContentDrawerColumn,
	TabContentDrawerFormModel,
	TabContentDrawerOrientation,
	TabContentDrawerValue,
} from "./tab-content-drawer.model";

@Component({
	selector: "app-tab-content-drawer",
	imports: [FormField, FormRoot],
	changeDetection: ChangeDetectionStrategy.OnPush,
	templateUrl: "./tab-content-drawer.html",
})
export class TabContentDrawer {
	readonly open = input(false);
	readonly columns = input<readonly TabContentDrawerColumn[]>([]);
	readonly title = input("Drawer");
	readonly orientation = input<TabContentDrawerOrientation>("rtl");

	readonly closed = output<void>();
	readonly submitted = output<TabContentDrawerFormModel>();

	protected readonly drawerModel = signal<TabContentDrawerFormModel>({});
	protected readonly drawerForm = form(this.drawerModel, (path) => {
		for (const column of this.columns()) {
			const fieldPath = path[column.name];

			if (column.required) {
				required(fieldPath, { message: `${column.label} is required` });
			}

			if (column.readonly) {
				readonlyField(fieldPath);
			}
		}
	});

	protected readonly drawerTitle = computed(() => this.title());
	protected readonly isRtl = computed(() => this.orientation() === "rtl");

	protected readonly modelEffect = effect(() => {
		this.drawerModel.set(this.createFormModel(this.columns()));
	});

	protected inputType(column: TabContentDrawerColumn): string {
		switch (column.type) {
			case "number":
				return "number";

			case "date":
				return "date";

			case "datetime":
				return "datetime-local";

			case "time":
				return "time";

			default:
				return "text";
		}
	}

	protected close(): void {
		this.closed.emit();
	}

	protected submit(): void {
		this.submitted.emit(this.drawerModel());
	}

	private createFormModel(columns: readonly TabContentDrawerColumn[]): TabContentDrawerFormModel {
		return Object.fromEntries(columns.map((column) => [column.name, column.defaultValue ?? this.defaultValue(column)]));
	}

	private defaultValue(column: TabContentDrawerColumn): TabContentDrawerValue {
		return column.type === "boolean" ? false : null;
	}
}

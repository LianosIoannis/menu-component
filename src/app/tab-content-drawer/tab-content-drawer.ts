import { ChangeDetectionStrategy, Component, computed, effect, inject, input, output, signal } from "@angular/core";
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { FaIconRegistry } from "../services/fa-icon-registry";
import type {
	TabContentDrawerColumn,
	TabContentDrawerFormModel,
	TabContentDrawerOrientation,
	TabContentDrawerValue,
} from "./tab-content-drawer.model";

@Component({
	selector: "app-tab-content-drawer",
	imports: [ReactiveFormsModule, FontAwesomeModule],
	changeDetection: ChangeDetectionStrategy.OnPush,
	templateUrl: "./tab-content-drawer.html",
})
export class TabContentDrawer {
	protected readonly faIconRegistry = inject(FaIconRegistry);

	readonly columns = input<TabContentDrawerColumn[]>([]);
	readonly title = input("");
	readonly open = input(false);
	readonly orientation = input<TabContentDrawerOrientation>("rtl");

	readonly closed = output<void>();
	readonly submitted = output<TabContentDrawerFormModel>();

	protected readonly drawerForm = signal(this.createFormGroup([]));

	protected readonly drawerTitle = computed(() => this.title());
	protected readonly isRtl = computed(() => this.orientation() === "rtl");

	protected readonly modelEffect = effect(() => {
		this.drawerForm.set(this.createFormGroup(this.columns()));
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

			case "boolean":
				return "checkbox";

			default:
				return "text";
		}
	}

	protected fieldError(column: TabContentDrawerColumn): string {
		const control = this.drawerForm().controls[column.name];

		if (control?.hasError("required")) {
			return `${column.label} is required`;
		}

		return "";
	}

	protected close(): void {
		this.closed.emit();
	}

	protected submit(): void {
		this.drawerForm().markAllAsTouched();

		if (this.drawerForm().invalid) {
			return;
		}

		this.submitted.emit(this.drawerForm().getRawValue());
	}

	private createFormGroup(columns: readonly TabContentDrawerColumn[]): FormGroup<
		Record<string, FormControl<TabContentDrawerValue>>
	> {
		const controls = Object.fromEntries(
			columns.map((column) => {
				const value = column.defaultValue ?? this.defaultValue(column);

				return [
					column.name,
					new FormControl(
						{ value, disabled: column.readonly === true },
						{
							nonNullable: false,
							validators: column.required ? [Validators.required] : [],
						},
					),
				];
			}),
		);

		return new FormGroup(controls);
	}

	private defaultValue(column: TabContentDrawerColumn): TabContentDrawerValue {
		return column.type === "boolean" ? false : null;
	}
}

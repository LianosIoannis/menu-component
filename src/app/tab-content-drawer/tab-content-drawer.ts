import { ChangeDetectionStrategy, Component, computed, effect, inject, input, output, signal } from "@angular/core";
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatSelectModule } from "@angular/material/select";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { FaIconRegistry } from "../services/fa-icon-registry";
import type {
	CriteriaOperator,
	TabContentDrawerColumn,
	TabContentDrawerFormModel,
	TabContentDrawerOrientation,
	TabContentDrawerValue,
} from "./tab-content-drawer.model";

type TabContentDrawerControlValue = CriteriaOperator | TabContentDrawerValue;

@Component({
	selector: "app-tab-content-drawer",
	imports: [
		ReactiveFormsModule,
		MatCheckboxModule,
		MatFormFieldModule,
		MatInputModule,
		MatSelectModule,
		FontAwesomeModule,
	],
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

	protected hasAvailableValues(column: TabContentDrawerColumn): boolean {
		return (column.availableValues?.length ?? 0) > 0;
	}

	protected allowedOperators(column: TabContentDrawerColumn): readonly CriteriaOperator[] {
		return column.allowedOperators ?? [];
	}

	protected hasAllowedOperators(column: TabContentDrawerColumn): boolean {
		return this.allowedOperators(column).length > 0;
	}

	protected showsOperator(column: TabContentDrawerColumn): boolean {
		return column.type !== "boolean" && this.hasAllowedOperators(column);
	}

	protected operatorControlName(column: TabContentDrawerColumn): string {
		return `${column.name}Operator`;
	}

	protected operatorLabel(operator: CriteriaOperator): string {
		return operator.replace(/[A-Z]/g, (letter) => ` ${letter.toLowerCase()}`);
	}

	protected close(): void {
		this.closed.emit();
	}

	protected submit(): void {
		this.drawerForm().markAllAsTouched();

		if (this.drawerForm().invalid) {
			return;
		}

		this.submitted.emit(this.createFormModel());
	}

	private createFormGroup(
		columns: readonly TabContentDrawerColumn[],
	): FormGroup<Record<string, FormControl<TabContentDrawerControlValue>>> {
		const controls = Object.fromEntries(
			columns.flatMap((column) => {
				const value = column.defaultValue ?? this.defaultValue(column);
				const fieldControl = new FormControl(
					{ value, disabled: column.readonly === true },
					{
						nonNullable: false,
						validators: column.required ? [Validators.required] : [],
					},
				);
				const controlEntries: [string, FormControl<TabContentDrawerControlValue>][] = [[column.name, fieldControl]];
				const [operator] = this.allowedOperators(column);

				if (this.showsOperator(column) && operator) {
					controlEntries.unshift([
						this.operatorControlName(column),
						new FormControl(
							{ value: operator, disabled: this.allowedOperators(column).length === 1 || column.readonly === true },
							{ nonNullable: true, validators: [Validators.required] },
						),
					]);
				}

				return controlEntries;
			}),
		);

		return new FormGroup(controls);
	}

	private defaultValue(column: TabContentDrawerColumn): TabContentDrawerValue {
		if (column.multiple) {
			return [];
		}

		return column.type === "boolean" ? false : null;
	}

	private createFormModel(): TabContentDrawerFormModel {
		const formValue = this.drawerForm().getRawValue();

		return Object.fromEntries(
			this.columns().map((column) => {
				const value = formValue[column.name];
				const operator = formValue[this.operatorControlName(column)];

				if (this.showsOperator(column) && typeof operator === "string") {
					return [column.name, { operator, value }];
				}

				return [column.name, value];
			}),
		);
	}
}

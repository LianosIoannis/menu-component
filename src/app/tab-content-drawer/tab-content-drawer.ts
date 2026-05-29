import { ChangeDetectionStrategy, Component, DestroyRef, computed, effect, inject, input, output, signal } from "@angular/core";
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { DateAdapter, MAT_DATE_FORMATS, MatNativeDateModule } from "@angular/material/core";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatSelectModule } from "@angular/material/select";
import { MatTimepickerModule } from "@angular/material/timepicker";
import { MatTooltipModule } from "@angular/material/tooltip";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import type { Subscription } from "rxjs";
import { FaIconRegistry } from "../services/fa-icon-registry";
import { DMY_DATE_FORMATS, DmyDateAdapter } from "./dmy-date-adapter";
import type {
	CriteriaOperator,
	TabContentDrawerColumn,
	TabContentDrawerFormModel,
	TabContentDrawerOrientation,
	TabContentDrawerValue,
} from "./tab-content-drawer.model";

type TabContentDrawerControlValue = CriteriaOperator | Date | TabContentDrawerValue;

@Component({
	selector: "app-tab-content-drawer",
	imports: [
		ReactiveFormsModule,
		MatCheckboxModule,
		MatDatepickerModule,
		MatFormFieldModule,
		MatInputModule,
		MatNativeDateModule,
		MatSelectModule,
		MatTimepickerModule,
		MatTooltipModule,
		FontAwesomeModule,
	],
	changeDetection: ChangeDetectionStrategy.OnPush,
	templateUrl: "./tab-content-drawer.html",
	styleUrl: "./tab-content-drawer.css",
	providers: [
		{ provide: DateAdapter, useClass: DmyDateAdapter },
		{ provide: MAT_DATE_FORMATS, useValue: DMY_DATE_FORMATS },
	],
})
export class TabContentDrawer {
	protected readonly faIconRegistry = inject(FaIconRegistry);
	private readonly destroyRef = inject(DestroyRef);

	readonly columns = input<TabContentDrawerColumn[]>([]);
	readonly title = input("");
	readonly open = input(false);
	readonly orientation = input<TabContentDrawerOrientation>("rtl");

	readonly closed = output<void>();
	readonly submitted = output<TabContentDrawerFormModel>();
	readonly valueChanged = output<TabContentDrawerFormModel>();

	protected readonly drawerForm = signal(this.createFormGroup([]));
	private drawerFormKey = "";
	private formSubscription: Subscription | undefined;

	protected readonly drawerTitle = computed(() => this.title());
	protected readonly isRtl = computed(() => this.orientation() === "rtl");

	protected readonly modelEffect = effect(() => {
		const columns = this.columns();
		const formKey = this.createFormKey(columns);

		if (formKey === this.drawerFormKey) {
			return;
		}

		this.drawerFormKey = formKey;

		const form = this.createFormGroup(columns);
		this.drawerForm.set(form);

		this.formSubscription?.unsubscribe();
		this.formSubscription = form.valueChanges.subscribe(() => {
			this.valueChanged.emit(this.createFormModel(form, columns));
		});
	});

	constructor() {
		this.destroyRef.onDestroy(() => {
			this.formSubscription?.unsubscribe();
		});
	}

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

	protected timeControlName(column: TabContentDrawerColumn): string {
		return `${column.name}Time`;
	}

	protected operatorLabel(operator: CriteriaOperator): string {
		return operator.replace(/[A-Z]/g, (letter) => ` ${letter.toLowerCase()}`);
	}

	protected operatorTooltip(column: TabContentDrawerColumn): string {
		const operator = this.drawerForm().controls[this.operatorControlName(column)]?.value;

		return typeof operator === "string" ? this.operatorLabel(operator as CriteriaOperator) : "";
	}

	protected close(): void {
		this.closed.emit();
	}

	protected submit(): void {
		const form = this.drawerForm();
		const columns = this.columns();

		form.markAllAsTouched();

		if (form.invalid) {
			return;
		}

		this.submitted.emit(this.createFormModel(form, columns));
	}

	private createFormGroup(
		columns: readonly TabContentDrawerColumn[],
	): FormGroup<Record<string, FormControl<TabContentDrawerControlValue>>> {
		const controls = Object.fromEntries(
			columns.flatMap((column) => {
				const value = this.controlValue(column);
				const fieldControl = new FormControl(
					{ value, disabled: column.readonly === true },
					{
						nonNullable: false,
						validators: column.required ? [Validators.required] : [],
					},
				);
				const controlEntries: [string, FormControl<TabContentDrawerControlValue>][] = [[column.name, fieldControl]];

				if (column.type === "datetime") {
					controlEntries.push([
						this.timeControlName(column),
						new FormControl(
							{ value: this.timeControlValue(column), disabled: column.readonly === true },
							{
								nonNullable: false,
								validators: column.required ? [Validators.required] : [],
							},
						),
					]);
				}

				const operator = this.defaultOperator(column);

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

	private createFormKey(columns: readonly TabContentDrawerColumn[]): string {
		return JSON.stringify(
			columns.map((column) => ({
				name: column.name,
				type: column.type,
				readonly: column.readonly === true,
				required: column.required === true,
				multiple: column.multiple === true,
				defaultValue: column.defaultValue,
				defaultOperator: column.defaultOperator,
				allowedOperators: column.allowedOperators ?? [],
			})),
		);
	}

	private defaultOperator(column: TabContentDrawerColumn): CriteriaOperator | undefined {
		const operators = this.allowedOperators(column);

		if (column.defaultOperator && operators.includes(column.defaultOperator)) {
			return column.defaultOperator;
		}

		return operators[0];
	}

	private defaultValue(column: TabContentDrawerColumn): TabContentDrawerValue {
		if (column.multiple) {
			return [];
		}

		return column.type === "boolean" ? false : null;
	}

	private controlValue(column: TabContentDrawerColumn): TabContentDrawerControlValue {
		const value = column.defaultValue ?? this.defaultValue(column);

		if (column.type === "date" && typeof value === "string") {
			return new Date(`${value}T00:00:00`);
		}

		if (column.type === "datetime" && typeof value === "string") {
			return new Date(value);
		}

		return value;
	}

	private timeControlValue(column: TabContentDrawerColumn): TabContentDrawerControlValue {
		const value = column.defaultValue ?? this.defaultValue(column);

		return typeof value === "string" ? new Date(value) : value;
	}

	private createFormModel(
		form: FormGroup<Record<string, FormControl<TabContentDrawerControlValue>>>,
		columns: readonly TabContentDrawerColumn[],
	): TabContentDrawerFormModel {
		const formValue = form.getRawValue();

		return Object.fromEntries(
			columns.map((column) => {
				const value = this.submittedValue(column, formValue);
				const operator = formValue[this.operatorControlName(column)];

				if (this.showsOperator(column) && typeof operator === "string") {
					return [column.name, { operator, value }];
				}

				return [column.name, value];
			}),
		);
	}

	private submittedValue(
		column: TabContentDrawerColumn,
		formValue: Record<string, TabContentDrawerControlValue>,
	): TabContentDrawerValue {
		const value = formValue[column.name];

		if (column.type === "date" && value instanceof Date) {
			return this.dateValue(value);
		}

		if (column.type === "datetime") {
			return this.submittedDateTimeValue(value, formValue[this.timeControlName(column)]);
		}

		return value === undefined ? null : (value as TabContentDrawerValue);
	}

	private submittedDateTimeValue(
		dateValue: TabContentDrawerControlValue | undefined,
		timeValue: TabContentDrawerControlValue | undefined,
	): TabContentDrawerValue {
		if (!(dateValue instanceof Date)) {
			return null;
		}

		const dateTime = new Date(dateValue);

		if (timeValue instanceof Date) {
			dateTime.setHours(timeValue.getHours(), timeValue.getMinutes(), 0, 0);
		} else {
			dateTime.setHours(0, 0, 0, 0);
		}

		const year = dateTime.getFullYear();
		const month = this.padDatePart(dateTime.getMonth() + 1);
		const day = this.padDatePart(dateTime.getDate());
		const hours = this.padDatePart(dateTime.getHours());
		const minutes = this.padDatePart(dateTime.getMinutes());

		return `${year}-${month}-${day} ${hours}:${minutes}`;
	}

	private dateValue(date: Date): string {
		const year = date.getFullYear();
		const month = this.padDatePart(date.getMonth() + 1);
		const day = this.padDatePart(date.getDate());

		return `${year}-${month}-${day}`;
	}

	private padDatePart(value: number): string {
		return value.toString().padStart(2, "0");
	}
}

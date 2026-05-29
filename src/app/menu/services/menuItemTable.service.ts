import { computed, Injectable, inject, signal } from "@angular/core";
import type { ColDef } from "ag-grid-community";
import { Data, type QueryResult } from "../../services/data";
import type { CriteriaOperator, MenuItemModel, Row, Scalar, SelectOutput } from "../models/menu-item-models/index";
import {
	createMenuItemFields,
	type MenuItemCriteriaField,
	type MenuItemMutationField,
} from "../utils/menuItem.fields";
import { buildMenuItemQuery } from "../utils/menuItem.queryBuilder";
import type { SubmittedFields, SubmittedFieldValue } from "../utils/menuItem.queryBuilder.types";
import { createColumnDefs, formatTableFieldValue } from "../utils/table.utils";

type MenuItemTableDrawerMode = "criteria" | "insert" | "update";
type MenuItemTableDrawerColumn = MenuItemCriteriaField | MenuItemMutationField;
type MenuItemTableQueryValues = SubmittedFields | { key: SubmittedFields } | { key: SubmittedFields; values: SubmittedFields };

export type MenuItemTableQueryHistoryEntry = {
	id: number;
	action: "select" | "insert" | "update" | "delete";
	values: MenuItemTableQueryValues;
	query?: string;
	status: "success" | "error";
	error?: string;
	createdAt: Date;
};

@Injectable()
export class MenuItemTableService {
	private readonly data = inject(Data);
	private nextHistoryId = 1;

	readonly menuItem = signal<MenuItemModel | null>(null);
	readonly currentCriteria = signal<SubmittedFields>({});
	readonly rows = signal<SelectOutput>([]);
	readonly selectedRow = signal<Row | null>(null);
	readonly drawerMode = signal<MenuItemTableDrawerMode | null>(null);
	readonly loading = signal(false);
	readonly rowsLoaded = signal(false);
	readonly queryHistory = signal<MenuItemTableQueryHistoryEntry[]>([]);

	readonly fields = computed(() => {
		const menuItem = this.menuItem();

		return menuItem ? createMenuItemFields(menuItem) : {};
	});

	readonly criteriaFields = computed(
		() =>
			this.fields().criteria ?? {
				title: `Filter ${this.menuItem()?.text ?? ""}`,
				columns: [],
			},
	);

	readonly insertFields = computed(
		() =>
			this.fields().insert ?? {
				title: `Add ${this.menuItem()?.text ?? ""}`,
				columns: [],
			},
	);

	readonly updateFields = computed(
		() =>
			this.fields().update ?? {
				title: `Update ${this.menuItem()?.text ?? ""}`,
				columns: [],
			},
	);

	readonly drawerOpen = computed(() => this.drawerMode() !== null);

	readonly drawerTitle = computed(() => {
		switch (this.drawerMode()) {
			case "criteria":
				return this.criteriaFields().title;
			case "insert":
				return this.insertFields().title;
			case "update":
				return this.updateFields().title;
			default:
				return "";
		}
	});

	readonly drawerColumns = computed<MenuItemTableDrawerColumn[]>(() => {
		switch (this.drawerMode()) {
			case "criteria":
				return this.createCriteriaColumns();
			case "insert":
				return this.insertFields().columns;
			case "update":
				return this.createUpdateColumns();
			default:
				return [];
		}
	});

	readonly columnDefs = computed<ColDef[]>(() => {
		const tableParams = this.menuItem()?.params?.tableParams;

		return tableParams ? createColumnDefs(tableParams.columns) : [];
	});

	readonly primaryKeyColumns = computed(
		() => this.menuItem()?.params?.tableParams?.columns.filter((column) => column.primaryKey === true).map((column) => column.name) ?? [],
	);

	readonly canInsert = computed(() => {
		const tableParams = this.menuItem()?.params?.tableParams;

		return Boolean(tableParams && tableParams.permissions?.insert !== false && this.insertFields().columns.length);
	});

	readonly canUpdate = computed(() => {
		const tableParams = this.menuItem()?.params?.tableParams;

		return Boolean(
			tableParams &&
				tableParams.permissions?.update !== false &&
				this.primaryKeyColumns().length &&
				this.updateFields().columns.length &&
				this.selectedRow(),
		);
	});

	readonly canDelete = computed(() => {
		const tableParams = this.menuItem()?.params?.tableParams;

		return Boolean(
			tableParams &&
				tableParams.permissions?.delete !== false &&
				this.primaryKeyColumns().length &&
				this.selectedRow(),
		);
	});

	readonly hasRequiredCriteria = computed(() =>
		this.criteriaFields().columns.some((column) => column.required === true),
	);

	readonly missingRequiredCriteria = computed(() =>
		this.criteriaFields().columns.some((column) => {
			const field = this.currentCriteria()[column.name];

			return column.required === true && (!field || !this.hasValue(field.value));
		}),
	);

	setMenuItem(menuItem: MenuItemModel): boolean {
		if (this.menuItem()?.id === menuItem.id) {
			return false;
		}

		this.menuItem.set(menuItem);
		this.currentCriteria.set({});
		this.rows.set([]);
		this.selectedRow.set(null);
		this.drawerMode.set(null);
		this.rowsLoaded.set(false);
		this.queryHistory.set([]);

		return true;
	}

	setSelectedRow(row: Row | null): void {
		this.selectedRow.set(row);
	}

	openCriteriaDrawer(): void {
		this.drawerMode.set("criteria");
	}

	openInsertDrawer(): void {
		if (this.canInsert()) {
			this.drawerMode.set("insert");
		}
	}

	openUpdateDrawer(): void {
		if (this.canUpdate()) {
			this.drawerMode.set("update");
		}
	}

	closeDrawer(): void {
		this.drawerMode.set(null);
	}

	toSubmittedFields(model: Record<string, unknown>, options: { includeEmptyValues?: boolean } = {}): SubmittedFields {
		return Object.fromEntries(
			Object.entries(model).flatMap(([name, value]) => {
				const field = this.toSubmittedFieldValue(value, options);

				return field ? [[name, field]] : [];
			}),
		);
	}

	setCriteria(model: Record<string, unknown>): void {
		this.currentCriteria.set(this.toSubmittedFields(model));
	}

	async submitDrawer(model: Record<string, unknown>): Promise<void> {
		switch (this.drawerMode()) {
			case "criteria":
				this.setCriteria(model);
				this.closeDrawer();
				await this.loadRows();
				return;

			case "insert":
				await this.insertRow(model);
				this.closeDrawer();
				await this.loadRows();
				return;

			case "update":
				await this.updateRow(model);
				this.closeDrawer();
				await this.loadRows();
				return;
		}
	}

	async loadRows(): Promise<void> {
		if (!this.rowsLoaded() && this.hasRequiredCriteria() && this.missingRequiredCriteria()) {
			this.openCriteriaDrawer();
			return;
		}

		const menuItem = this.menuItem();

		if (!menuItem) {
			this.rows.set([]);
			return;
		}

		this.loading.set(true);

		try {
			this.rows.set(await this.selectRows(menuItem, this.currentCriteria()));
			this.selectedRow.set(null);
			this.rowsLoaded.set(true);
		} catch (error: unknown) {
			console.error(error);
			this.rows.set([]);
		} finally {
			this.loading.set(false);
		}
	}

	async deleteSelectedRow(): Promise<void> {
		const menuItem = this.requireMenuItem();
		const selectedRow = this.selectedRow();

		if (!selectedRow) {
			return;
		}

		const key = this.createPrimaryKeyFields(selectedRow);
		const historyValues = { key };
		let query: string | undefined;

		this.loading.set(true);

		try {
			const result = await buildMenuItemQuery({
				action: "delete",
				menuItem,
				values: historyValues,
			});

			if (typeof result === "string") {
				query = result;
				await this.executeQuery<unknown>(result);
			}

			this.addQueryHistory({ action: "delete", values: historyValues, query, status: "success" });
		} catch (error: unknown) {
			this.addQueryHistory({
				action: "delete",
				values: historyValues,
				query,
				status: "error",
				error: error instanceof Error ? error.message : "Delete failed",
			});
			throw error;
		} finally {
			this.loading.set(false);
		}
	}

	private async insertRow(model: Record<string, unknown>): Promise<void> {
		const menuItem = this.requireMenuItem();
		const values = this.toSubmittedFields(model, { includeEmptyValues: true });
		let query: string | undefined;

		this.loading.set(true);

		try {
			const result = await buildMenuItemQuery({
				action: "insert",
				menuItem,
				values,
			});

			if (typeof result === "string") {
				query = result;
				await this.executeQuery<unknown>(result);
			}

			this.addQueryHistory({ action: "insert", values, query, status: "success" });
		} catch (error: unknown) {
			this.addQueryHistory({
				action: "insert",
				values,
				query,
				status: "error",
				error: error instanceof Error ? error.message : "Insert failed",
			});
			throw error;
		} finally {
			this.loading.set(false);
		}
	}

	private async updateRow(model: Record<string, unknown>): Promise<void> {
		const menuItem = this.requireMenuItem();
		const selectedRow = this.selectedRow();

		if (!selectedRow) {
			return;
		}

		const submittedFields = this.toSubmittedFields(model, { includeEmptyValues: true });
		const key = this.createPrimaryKeyFields(selectedRow);
		const values = this.changedFields(this.omitFields(submittedFields, this.primaryKeyColumns()), selectedRow, menuItem);
		const historyValues = { key, values };
		let query: string | undefined;

		if (!Object.keys(values).length) {
			throw new Error("No update values were submitted");
		}

		this.loading.set(true);

		try {
			const result = await buildMenuItemQuery({
				action: "update",
				menuItem,
				values: historyValues,
			});

			if (typeof result === "string") {
				query = result;
				await this.executeQuery<unknown>(result);
			}

			this.addQueryHistory({ action: "update", values: historyValues, query, status: "success" });
		} catch (error: unknown) {
			this.addQueryHistory({
				action: "update",
				values: historyValues,
				query,
				status: "error",
				error: error instanceof Error ? error.message : "Update failed",
			});
			throw error;
		} finally {
			this.loading.set(false);
		}
	}

	private async selectRows(menuItem: MenuItemModel, values: SubmittedFields): Promise<SelectOutput> {
		let query: string | undefined;

		const result = await buildMenuItemQuery({
			action: "select",
			menuItem,
			values,
		});

		try {
			if (typeof result === "string") {
				query = result;

				const rows = await this.executeQuery<SelectOutput>(result);
				this.addQueryHistory({ action: "select", values, query, status: "success" });

				return rows;
			}

			const rows = Array.isArray(result) ? (result as SelectOutput) : [];
			this.addQueryHistory({ action: "select", values, status: "success" });

			return rows;
		} catch (error: unknown) {
			this.addQueryHistory({
				action: "select",
				values,
				query,
				status: "error",
				error: error instanceof Error ? error.message : "Query execution failed",
			});
			throw error;
		}
	}

	private toSubmittedFieldValue(
		value: unknown,
		options: { includeEmptyValues?: boolean } = {},
	): SubmittedFieldValue | null {
		if (this.isSubmittedFieldValue(value)) {
			return options.includeEmptyValues || this.hasValue(value.value) ? value : null;
		}

		if (!options.includeEmptyValues && !this.hasValue(value)) {
			return null;
		}

		if (!this.isScalarOrScalarArray(value)) {
			return null;
		}

		return {
			operator: "equals",
			value,
		};
	}

	private isSubmittedFieldValue(value: unknown): value is SubmittedFieldValue {
		if (!this.isRecord(value)) {
			return false;
		}

		const operator = value["operator"];
		const submittedValue = value["value"];

		return this.isCriteriaOperator(operator) && this.isScalarOrScalarArray(submittedValue);
	}

	private isCriteriaOperator(value: unknown): value is CriteriaOperator {
		return (
			typeof value === "string" &&
			[
				"equals",
				"notEquals",
				"greaterThan",
				"lessThan",
				"greaterThanOrEqual",
				"lessThanOrEqual",
				"contains",
				"notContains",
				"startsWith",
				"endsWith",
				"between",
				"in",
				"notIn",
			].includes(value)
		);
	}

	private isScalarOrScalarArray(value: unknown): value is Scalar | Scalar[] {
		return Array.isArray(value) ? value.every((item) => this.isScalar(item)) : this.isScalar(value);
	}

	private isScalar(value: unknown): value is Scalar {
		return value === null || ["string", "number", "boolean"].includes(typeof value);
	}

	private hasValue(value: unknown): value is Scalar | Scalar[] {
		if (Array.isArray(value)) {
			return value.length > 0;
		}

		return value !== null && value !== undefined && value !== "";
	}

	private isRecord(value: unknown): value is Record<string, unknown> {
		return typeof value === "object" && value !== null && !Array.isArray(value);
	}

	private createUpdateColumns(): MenuItemMutationField[] {
		const row = this.selectedRow();

		return this.updateFields().columns.map((column) => ({
			...column,
			...(row && row[column.name] !== undefined
				? { defaultValue: formatTableFieldValue(row[column.name] ?? null, column.type) || undefined }
				: {}),
		}));
	}

	private createCriteriaColumns(): MenuItemCriteriaField[] {
		const criteria = this.currentCriteria();

		return this.criteriaFields().columns.map((column) => {
			const field = criteria[column.name];

			return {
				...column,
				...(field ? { defaultValue: field.value, defaultOperator: field.operator } : {}),
			};
		});
	}

	private createPrimaryKeyFields(row: Row): SubmittedFields {
		return Object.fromEntries(
			this.primaryKeyColumns().map((name) => [
				name,
				{
					operator: "equals",
					value: row[name] ?? null,
				},
			]),
		);
	}

	private omitFields(fields: SubmittedFields, names: readonly string[]): SubmittedFields {
		const excludedNames = new Set(names);

		return Object.fromEntries(Object.entries(fields).filter(([name]) => !excludedNames.has(name)));
	}

	private changedFields(fields: SubmittedFields, row: Row, menuItem: MenuItemModel): SubmittedFields {
		const columns = menuItem.params?.tableParams?.columns ?? [];

		return Object.fromEntries(
			Object.entries(fields).filter(([name, field]) => {
				const column = columns.find((tableColumn) => tableColumn.name === name);
				const rowValue =
					column && this.isScalar(row[name])
						? formatTableFieldValue(row[name] ?? null, column.type)
						: (row[name] ?? null);

				return !this.sameScalarValue(field.value, rowValue);
			}),
		);
	}

	private sameScalarValue(first: Scalar | Scalar[], second: unknown): boolean {
		if (Array.isArray(first) || Array.isArray(second)) {
			return JSON.stringify(first) === JSON.stringify(second);
		}

		return first === second || String(first ?? "") === String(second ?? "");
	}

	private requireMenuItem(): MenuItemModel {
		const menuItem = this.menuItem();

		if (!menuItem) {
			throw new Error("No menu item is selected");
		}

		return menuItem;
	}

	private addQueryHistory(entry: Omit<MenuItemTableQueryHistoryEntry, "id" | "createdAt">): void {
		const nextEntry: MenuItemTableQueryHistoryEntry = {
			...entry,
			id: this.nextHistoryId,
			createdAt: new Date(),
		};

		this.queryHistory.update((history) => [nextEntry, ...history]);
		this.nextHistoryId += 1;

		console.table(this.queryHistory());
	}

	private async executeQuery<Output>(query: string): Promise<Output> {
		return this.unwrapQueryResult(await this.data.execQuery(query));
	}

	private unwrapQueryResult<Output>(result: QueryResult): Output {
		if (!result.success) {
			throw new Error(result.error ?? "Query execution failed");
		}

		return (result.data ?? true) as Output;
	}
}

import type { MenuItemModel, TableScreenParams } from "../models/menu-item-models/index";
import type { MenuItemModelRaw } from "../models/menu-item-raw-models/index";
import { createMenuItemFields, type MenuItemFields } from "../utils/menuItem.fields";
import { buildMenuItemQuery } from "../utils/menuItem.queryBuilder";
import type { SubmittedFields } from "../utils/menuItem.queryBuilder.types";
import { replaceMenuItemModel } from "../utils/menuItem.replacer";
import { transformMenuItemModel } from "../utils/menuItem.reviver";

export class MenuItemRuntime {
	private readonly fields: MenuItemFields;

	constructor(private readonly menuItem: MenuItemModel) {
		this.fields = createMenuItemFields(menuItem);
	}

	static fromRaw(raw: MenuItemModelRaw): MenuItemRuntime {
		return new MenuItemRuntime(transformMenuItemModel(raw));
	}

	get isTable(): boolean {
		return this.menuItem.params?.screenType === "table" && this.tableParams !== undefined;
	}

	get model(): MenuItemModel {
		return this.menuItem;
	}

	get tableParams(): TableScreenParams | undefined {
		return this.menuItem.params?.tableParams;
	}

	get primaryKeyColumns(): string[] {
		return this.tableParams?.columns.filter((column) => column.primaryKey === true).map((column) => column.name) ?? [];
	}

	get hasPrimaryKey(): boolean {
		return this.primaryKeyColumns.length > 0;
	}

	get hasCriteriaFields(): boolean {
		return Boolean(this.fields.criteria?.columns.length);
	}

	get hasInsertFields(): boolean {
		return Boolean(this.fields.insert?.columns.length);
	}

	get hasUpdateFields(): boolean {
		return Boolean(this.fields.update?.columns.length);
	}

	get canInsert(): boolean {
		return this.isTable && this.tableParams?.permissions?.insert !== false && this.hasInsertFields;
	}

	get canUpdate(): boolean {
		return (
			this.isTable && this.tableParams?.permissions?.update !== false && this.hasPrimaryKey && this.hasUpdateFields
		);
	}

	get canDelete(): boolean {
		return this.isTable && this.tableParams?.permissions?.delete !== false && this.hasPrimaryKey;
	}

	getFields(): MenuItemFields {
		return this.fields;
	}

	toRaw(): MenuItemModelRaw {
		return replaceMenuItemModel(this.menuItem);
	}

	buildSelect(values: SubmittedFields): Promise<unknown> {
		return buildMenuItemQuery({
			action: "select",
			menuItem: this.menuItem,
			values,
		});
	}

	buildInsert(values: SubmittedFields): Promise<unknown> {
		return buildMenuItemQuery({
			action: "insert",
			menuItem: this.menuItem,
			values,
		});
	}

	buildUpdate(values: { key: SubmittedFields; values: SubmittedFields }): Promise<unknown> {
		return buildMenuItemQuery({
			action: "update",
			menuItem: this.menuItem,
			values,
		});
	}

	buildDelete(values: { key: SubmittedFields }): Promise<unknown> {
		return buildMenuItemQuery({
			action: "delete",
			menuItem: this.menuItem,
			values,
		});
	}
}

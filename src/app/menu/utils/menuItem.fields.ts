import type {
	CriteriaOperator,
	MenuItemModel,
	TableColumnParams,
	TableColumnType,
} from "../models/menu-item-models/index";

type FieldValue = string | number | boolean | null | Array<string | number | boolean | null>;

export type MenuItemAvailableValue = {
	value: string | number | boolean;
	text: string;
};

export type MenuItemBaseField = {
	name: string;
	label: string;
	type: TableColumnType;
	multiple?: boolean;
	availableValues?: MenuItemAvailableValue[];
	defaultValue?: FieldValue;
};

export type MenuItemCriteriaField = MenuItemBaseField & {
	allowedOperators?: CriteriaOperator[];
	defaultOperator?: CriteriaOperator;
	required?: boolean;
};

export type MenuItemMutationField = MenuItemBaseField & {
	required?: boolean;
	readonly?: boolean;
};

export type MenuItemFieldSection<TColumn> = {
	title: string;
	columns: TColumn[];
};

export type MenuItemFields = {
	criteria?: MenuItemFieldSection<MenuItemCriteriaField>;
	insert?: MenuItemFieldSection<MenuItemMutationField>;
	update?: MenuItemFieldSection<MenuItemMutationField>;
};

export const createMenuItemFields = (menuItem: MenuItemModel): MenuItemFields => {
	const tableParams = menuItem.params?.tableParams;

	if (!tableParams) {
		return {};
	}

	const criteriaColumns = tableParams.columns.filter(isCriteriaColumn).map(createCriteriaField);
	const insertColumns = tableParams.columns.filter(isInsertColumn).map(createInsertField);
	const updateColumns = tableParams.columns.filter(isUpdateColumn).map(createUpdateField);

	return {
		...(criteriaColumns.length
			? {
					criteria: {
						title: `Filter ${menuItem.text}`,
						columns: criteriaColumns,
					},
				}
			: {}),
		...(insertColumns.length
			? {
					insert: {
						title: `Add ${menuItem.text}`,
						columns: insertColumns,
					},
				}
			: {}),
		...(updateColumns.length
			? {
					update: {
						title: `Update ${menuItem.text}`,
						columns: updateColumns,
					},
				}
			: {}),
	};
};

const isCriteriaColumn = (column: TableColumnParams): boolean => {
	if (!column.retrieve?.criteria || column.retrieve.enabled === false || column.retrieve.criteria.enabled === false) {
		return false;
	}

	return true;
};

const isInsertColumn = (column: TableColumnParams): boolean => column.insert?.enabled === true;

const isUpdateColumn = (column: TableColumnParams): boolean =>
	column.primaryKey === true || column.update?.enabled === true;

const createCriteriaField = (column: TableColumnParams): MenuItemCriteriaField => {
	const criteria = column.retrieve?.criteria;

	return {
		...createBaseField(column),
		...(criteria?.allowedFilters ? { allowedOperators: criteria.allowedFilters } : {}),
		...(criteria?.required !== undefined ? { required: criteria.required } : {}),
	};
};

const createInsertField = (column: TableColumnParams): MenuItemMutationField => {
	return {
		...createBaseField(column),
		...(column.insert?.required !== undefined ? { required: column.insert.required } : {}),
	};
};

const createUpdateField = (column: TableColumnParams): MenuItemMutationField => {
	return {
		...createBaseField(column),
		...(column.update?.required !== undefined ? { required: column.update.required } : {}),
		...(column.primaryKey === true ? { readonly: true } : {}),
	};
};

const createBaseField = (column: TableColumnParams): MenuItemBaseField => {
	return {
		name: column.name,
		label: column.label ?? createLabelFromName(column.name),
		type: column.type,
	};
};

const createLabelFromName = (name: string): string => {
	return name
		.split("_")
		.filter(Boolean)
		.map((part) => `${part.charAt(0).toUpperCase()}${part.slice(1)}`)
		.join(" ");
};

import type { MenuItemModel, TableColumnParams } from "../menu/menuItem.model";
import type { TabContentDrawerColumn } from "../tab-content-drawer/tab-content-drawer.model";

export type TabContentDrawerScenario = {
	title: string;
	columns: TabContentDrawerColumn[];
};

export type TabContentDrawerScenarios = Record<"criteria" | "insert" | "update", TabContentDrawerScenario>;

export function createDrawerScenarios(menuItem: MenuItemModel): TabContentDrawerScenarios {
	const table = menuItem.params?.table;

	if (!table) {
		return createEmptyDrawerScenarios(menuItem.text);
	}

	return {
		criteria: {
			title: `Filter ${menuItem.text}`,
			columns: table.columns
				.filter((column) => column.retrieve?.criteria?.enabled === true)
				.map(createCriteriaDrawerColumn),
		},
		insert: {
			title: `Add ${menuItem.text}`,
			columns: table.columns.filter((column) => column.insert?.enabled === true).map(createInsertDrawerColumn),
		},
		update: {
			title: `Update ${menuItem.text}`,
			columns: table.columns
				.filter((column) => column.update?.enabled === true || column.primaryKey === true)
				.map(createUpdateDrawerColumn),
		},
	};
}

function createEmptyDrawerScenarios(title: string): TabContentDrawerScenarios {
	return {
		criteria: { title: `Filter ${title}`, columns: [] },
		insert: { title: `Add ${title}`, columns: [] },
		update: { title: `Update ${title}`, columns: [] },
	};
}

function createCriteriaDrawerColumn(column: TableColumnParams): TabContentDrawerColumn {
	return {
		...createBaseDrawerColumn(column),
		allowedOperators: column.retrieve?.criteria?.allowedFilters,
		required: column.retrieve?.criteria?.required,
		multiple: column.retrieve?.criteria?.allowedFilters?.some((operator) => operator === "in" || operator === "notIn"),
	};
}

function createInsertDrawerColumn(column: TableColumnParams): TabContentDrawerColumn {
	return {
		...createBaseDrawerColumn(column),
		required: column.insert?.required,
	};
}

function createUpdateDrawerColumn(column: TableColumnParams): TabContentDrawerColumn {
	return {
		...createBaseDrawerColumn(column),
		required: column.update?.required,
		readonly: column.primaryKey === true,
	};
}

function createBaseDrawerColumn(column: TableColumnParams): TabContentDrawerColumn {
	return {
		name: column.name,
		label: column.label ?? column.name,
		type: column.type,
	};
}

import type { ColDef, ValueFormatterParams } from "ag-grid-community";
import dayjs from "dayjs";
import type { TableColumnParams, TableColumnType } from "../menu/menuItem.model";

export function createColumnDefs<T extends object>(columns: readonly TableColumnParams[]): ColDef<T>[] {
	return columns
		.filter((column) => column.visible !== false)
		.map(
			(column): ColDef<T> => ({
				field: column.name as ColDef<T>["field"],
				headerName: column.label ?? column.name,
				sortable: column.sortable ?? true,
				filter: column.filterable ?? true,
				cellDataType: createCellDataType(column.type),
				valueFormatter: createValueFormatter(column),
			}),
		);
}

function createCellDataType(type: TableColumnType): ColDef["cellDataType"] {
	switch (type) {
		case "number":
			return "number";

		case "boolean":
			return "boolean";

		case "date":
			return "dateString";

		case "datetime":
		case "time":
			return "dateTimeString";

		default:
			return "text";
	}
}

function createValueFormatter<T extends object>(column: TableColumnParams): ColDef<T>["valueFormatter"] {
	switch (column.type) {
		case "date":
			return (params) => formatDateValue(params, "DD/MM/YYYY");

		case "datetime":
			return (params) => formatDateValue(params, "DD/MM/YYYY HH:mm");

		case "time":
			return (params) => formatDateValue(params, "HH:mm");

		default:
			return undefined;
	}
}

function formatDateValue<TData, TValue>(params: ValueFormatterParams<TData, TValue>, format: string): string {
	if (params.value === null || params.value === undefined || params.value === "") {
		return "";
	}

	const value = dayjs(params.value as string);

	return value.isValid() ? value.format(format) : String(params.value);
}


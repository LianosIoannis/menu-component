import type { ColDef } from "ag-grid-community";
import dayjs from "dayjs";
import type { Scalar, TableColumnParams, TableColumnType } from "../models/menu-item-models/index";

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
			return (params) => formatTableDateValue(params.value as Scalar, "DD/MM/YYYY");

		case "datetime":
			return (params) => formatTableDateValue(params.value as Scalar, "DD/MM/YYYY HH:mm");

		case "time":
			return (params) => formatTableDateValue(params.value as Scalar, "HH:mm");

		default:
			return undefined;
	}
}

export function formatTableFieldValue(value: Scalar, type: TableColumnType): Scalar {
	switch (type) {
		case "date":
			return formatTableDateValue(value, "YYYY-MM-DD");

		case "datetime":
			return formatTableDateValue(value, "YYYY-MM-DD HH:mm");

		case "time":
			return formatTableDateValue(value, "HH:mm");

		default:
			return value;
	}
}

function formatTableDateValue(value: Scalar, format: string): string {
	if (value === null || value === "") {
		return "";
	}

	if (typeof value === "boolean") {
		return String(value);
	}

	const date = dayjs(value);

	return date.isValid() ? date.format(format) : String(value);
}


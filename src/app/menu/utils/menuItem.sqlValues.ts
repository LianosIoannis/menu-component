import type { PrimaryKey, Row, Scalar, SelectInput } from "../models/menu-item-models/index";
import type { SubmittedFields } from "./menuItem.queryBuilder.types";

export const unwrapSubmittedFields = (fields: SubmittedFields): SelectInput["criteria"] => {
	return Object.fromEntries(Object.entries(fields).map(([name, field]) => [name, field.value]));
};

export const unwrapSubmittedScalarFields = (fields: SubmittedFields): Row & PrimaryKey => {
	return Object.fromEntries(
		Object.entries(fields).map(([name, field]) => [name, assertSingleValue(field.value)]),
	) as Row & PrimaryKey;
};

export const replaceSqlPlaceholders = (sql: string, values: SubmittedFields): string => {
	return sql.replace(/\$\{([A-Za-z_][A-Za-z0-9_]*)\}/g, (placeholder, name: string) => {
		const field = values[name];

		if (!field) {
			return placeholder;
		}

		if (field.operator === "between" || field.operator === "notBetween") {
			return formatBetweenValue(field.value);
		}

		return Array.isArray(field.value) ? formatSqlValueList(field.value) : formatSqlValue(field.value);
	});
};

export const formatBetweenValue = (value: Scalar | Scalar[]): string => {
	if (!Array.isArray(value) || value.length !== 2) {
		throw new Error("Between operators require exactly two values");
	}

	return `${formatSqlValue(value[0] ?? null)} and ${formatSqlValue(value[1] ?? null)}`;
};

export const formatSqlValueList = (value: Scalar | Scalar[]): string => {
	const values = Array.isArray(value) ? value : [value];

	return values.map(formatSqlValue).join(", ");
};

export const formatSqlValue = (value: Scalar | Scalar[]): string => {
	if (Array.isArray(value)) {
		return formatSqlValueList(value);
	}

	if (value === null) {
		return "null";
	}

	if (typeof value === "number") {
		return `${value}`;
	}

	if (typeof value === "boolean") {
		return value ? "true" : "false";
	}

	return `'${value.replaceAll("'", "''")}'`;
};

export const assertSingleValue = (value: Scalar | Scalar[]): Scalar => {
	if (Array.isArray(value)) {
		throw new Error("Operator requires a single value");
	}

	return value;
};

import type { SubmittedFields, SubmittedFieldValue } from "./menuItem.queryBuilder.types";
import { assertSingleValue, formatBetweenValue, formatSqlValue, formatSqlValueList } from "./menuItem.sqlValues";

export const buildWhereClause = (criteria: SubmittedFields): string => {
	const clauses = Object.entries(criteria).map(([name, field]) => buildWhereCondition(name, field));

	return clauses.length ? `where ${clauses.join(" and ")}` : "";
};

const buildWhereCondition = (name: string, field: SubmittedFieldValue): string => {
	switch (field.operator) {
		case "equals":
			return `${name} = ${formatSqlValue(field.value)}`;
		case "notEquals":
			return `${name} <> ${formatSqlValue(field.value)}`;
		case "greaterThan":
			return `${name} > ${formatSqlValue(field.value)}`;
		case "lessThan":
			return `${name} < ${formatSqlValue(field.value)}`;
		case "greaterThanOrEqual":
			return `${name} >= ${formatSqlValue(field.value)}`;
		case "lessThanOrEqual":
			return `${name} <= ${formatSqlValue(field.value)}`;
		case "contains":
			return `${name} like ${formatSqlValue(`%${assertSingleValue(field.value)}%`)}`;
		case "notContains":
			return `${name} not like ${formatSqlValue(`%${assertSingleValue(field.value)}%`)}`;
		case "startsWith":
			return `${name} like ${formatSqlValue(`${assertSingleValue(field.value)}%`)}`;
		case "endsWith":
			return `${name} like ${formatSqlValue(`%${assertSingleValue(field.value)}`)}`;
		case "between":
			return `${name} between ${formatBetweenValue(field.value)}`;
		case "notBetween":
			return `${name} not between ${formatBetweenValue(field.value)}`;
		case "in":
			return `${name} in (${formatSqlValueList(field.value)})`;
		case "notIn":
			return `${name} not in (${formatSqlValueList(field.value)})`;
	}
};

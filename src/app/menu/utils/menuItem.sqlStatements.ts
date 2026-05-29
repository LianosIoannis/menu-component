import type { TableScreenParams } from "../models/menu-item-models/index";
import type { SubmittedFields } from "./menuItem.queryBuilder.types";
import { buildWhereClause } from "./menuItem.sqlConditions";
import { formatSqlValue } from "./menuItem.sqlValues";

export const buildSelectSql = (tableParams: TableScreenParams, criteria: SubmittedFields): string => {
	const columnNames = tableParams.columns
		.filter((column) => column.visible !== false)
		.map((column) => column.name)
		.join(", ");
	const whereClause = buildWhereClause(criteria);

	return [`select ${columnNames || "*"} from ${tableParams.name}`, whereClause].filter(Boolean).join(" ");
};

export const appendSelectCriteriaSql = (sql: string, criteria: SubmittedFields): string => {
	const whereClause = buildWhereClause(criteria);

	if (!whereClause) {
		return sql;
	}

	const criteriaClause = whereClause.replace(/^where\s+/i, "");
	const trailingClauseMatch = sql.match(/\s+(group\s+by|order\s+by|limit|offset)\s+/i);

	if (!trailingClauseMatch?.index) {
		return `${sql} ${sqlHasWhereClause(sql) ? "and" : "where"} ${criteriaClause}`;
	}

	const sqlBeforeTrailingClause = sql.slice(0, trailingClauseMatch.index);
	const trailingClause = sql.slice(trailingClauseMatch.index);

	return `${sqlBeforeTrailingClause} ${sqlHasWhereClause(sqlBeforeTrailingClause) ? "and" : "where"} ${criteriaClause}${trailingClause}`;
};

export const buildInsertSql = (tableParams: TableScreenParams, values: SubmittedFields): string => {
	const entries = Object.entries(values);
	const columns = entries.map(([name]) => name).join(", ");
	const sqlValues = entries.map(([, field]) => formatSqlValue(field.value)).join(", ");

	return `insert into ${tableParams.name} (${columns}) values (${sqlValues})`;
};

export const buildUpdateSql = (
	tableParams: TableScreenParams,
	key: SubmittedFields,
	values: SubmittedFields,
): string => {
	const setClause = Object.entries(values)
		.map(([name, field]) => `${name} = ${formatSqlValue(field.value)}`)
		.join(", ");
	const whereClause = buildWhereClause(key);

	if (!whereClause) {
		throw new Error(`Cannot build update query for "${tableParams.name}" without key values`);
	}

	return `update ${tableParams.name} set ${setClause} ${whereClause}`;
};

export const buildDeleteSql = (tableParams: TableScreenParams, key: SubmittedFields): string => {
	const whereClause = buildWhereClause(key);

	if (!whereClause) {
		throw new Error(`Cannot build delete query for "${tableParams.name}" without key values`);
	}

	return `delete from ${tableParams.name} ${whereClause}`;
};

const sqlHasWhereClause = (sql: string): boolean => /\bwhere\b/i.test(sql);

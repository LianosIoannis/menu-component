import type { TableScreenParams } from "../menu/menuItem.model";

export type RetrieveCriteria = Record<string, unknown>;

export function createRetrieveQuery(table: TableScreenParams, criteria: RetrieveCriteria = {}): string {
	const columns = table.columns.filter((column) => column.retrieve !== false);
	const selectList = columns.length > 0 ? columns.map((column) => quoteIdentifier(column.name)).join(", ") : "*";
	const whereClause = createWhereClause(table, criteria);

	return `SELECT ${selectList} FROM ${quoteMultipartIdentifier(table.name)}${whereClause}`;
}

function quoteMultipartIdentifier(identifier: string): string {
	return identifier.split(".").map(quoteIdentifier).join(".");
}

function quoteIdentifier(identifier: string): string {
	const trimmedIdentifier = identifier.trim();

	if (!trimmedIdentifier) {
		throw new Error("SQL identifier cannot be empty.");
	}

	return `[${trimmedIdentifier.replaceAll("]", "]]")}]`;
}

function createWhereClause(table: TableScreenParams, criteria: RetrieveCriteria): string {
	const predicates = table.columns
		.filter((column) => column.retrieveCriteria)
		.flatMap((column) => {
			const value = criteria[column.name];

			if (value === null || value === undefined || value === "") {
				return [];
			}

			return `${quoteIdentifier(column.name)} = ${formatSqlValue(value)}`;
		});

	return predicates.length > 0 ? ` WHERE ${predicates.join(" AND ")}` : "";
}

function formatSqlValue(value: unknown): string {
	if (typeof value === "number") {
		return Number.isFinite(value) ? String(value) : "NULL";
	}

	if (typeof value === "boolean") {
		return value ? "1" : "0";
	}

	return `'${String(value).replaceAll("'", "''")}'`;
}

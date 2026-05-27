import type { Handler, SqlQuery } from "../menu/menuItem.model";
import type { QueryResult } from "../services/data";

export type QueryExecutor = (query: SqlQuery, useLoading?: boolean) => Promise<QueryResult>;

export async function runHandler<Input, Output>(
	handler: Handler<Input, Output>,
	input: Input,
	execQuery: QueryExecutor,
	useLoading = false,
): Promise<Output> {
	switch (handler.type) {
		case "query":
			return executeQueryHandler<Output>(handler.sql, execQuery, useLoading);

		case "queryFactory":
			return executeQueryHandler<Output>(await handler.resolve(input), execQuery, useLoading);

		case "dataFactory":
			return handler.resolve(input);
	}
}

export async function resolveHandlerQuery<Input>(
	handler: Extract<Handler<Input, unknown>, { type: "query" | "queryFactory" }>,
	input: Input,
): Promise<SqlQuery> {
	switch (handler.type) {
		case "query":
			return handler.sql;

		case "queryFactory":
			return handler.resolve(input);
	}
}

async function executeQueryHandler<Output>(
	query: SqlQuery,
	execQuery: QueryExecutor,
	useLoading: boolean,
): Promise<Output> {
	return unwrapQueryResult(await execQuery(query, useLoading));
}

function unwrapQueryResult<Output>(result: QueryResult): Output {
	if (!result.success) {
		throw new Error(result.error ?? "Query execution failed");
	}

	return (result.data ?? true) as Output;
}

import type { HandlerKind } from "./handlerKind.model";
import type { SqlQuery } from "./sqlQuery.model";

export type QueryHandler = {
	type: Extract<HandlerKind, "query">;
	sql: SqlQuery;
};

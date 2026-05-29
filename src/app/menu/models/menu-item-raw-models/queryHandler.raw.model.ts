import type { HandlerKind } from "./handlerKind.raw.model";
import type { SqlQuery } from "./sqlQuery.raw.model";

export type QueryHandlerRaw = {
	type: Extract<HandlerKind, "query">;
	sql: SqlQuery;
};

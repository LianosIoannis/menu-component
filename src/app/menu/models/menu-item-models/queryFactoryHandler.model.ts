import type { HandlerKind } from "./handlerKind.model";
import type { MaybePromise } from "./maybePromise.model";
import type { SqlQuery } from "./sqlQuery.model";

export type QueryFactoryHandler<Input> = {
	type: Extract<HandlerKind, "queryFactory">;
	resolve: (input: Input) => MaybePromise<SqlQuery>;
};

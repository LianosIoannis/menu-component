import type { HandlerKind } from "./handlerKind.raw.model";

export type QueryFactoryHandlerRaw = {
	type: Extract<HandlerKind, "queryFactory">;
	resolve: string;
};

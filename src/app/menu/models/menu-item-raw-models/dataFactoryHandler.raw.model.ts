import type { HandlerKind } from "./handlerKind.raw.model";

export type DataFactoryHandlerRaw = {
	type: Extract<HandlerKind, "dataFactory">;
	resolve: string;
};

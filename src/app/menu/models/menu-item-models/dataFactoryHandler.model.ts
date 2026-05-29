import type { HandlerKind } from "./handlerKind.model";
import type { MaybePromise } from "./maybePromise.model";

export type DataFactoryHandler<Input, Output> = {
	type: Extract<HandlerKind, "dataFactory">;
	resolve: (input: Input) => MaybePromise<Output>;
};

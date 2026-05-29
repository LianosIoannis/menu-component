import type { DataFactoryHandler } from "./dataFactoryHandler.model";
import type { QueryFactoryHandler } from "./queryFactoryHandler.model";
import type { QueryHandler } from "./queryHandler.model";

export type Handler<Input, Output> = QueryHandler | QueryFactoryHandler<Input> | DataFactoryHandler<Input, Output>;

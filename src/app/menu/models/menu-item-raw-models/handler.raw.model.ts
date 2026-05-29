import type { DataFactoryHandlerRaw } from "./dataFactoryHandler.raw.model";
import type { QueryFactoryHandlerRaw } from "./queryFactoryHandler.raw.model";
import type { QueryHandlerRaw } from "./queryHandler.raw.model";

export type HandlerRaw = QueryHandlerRaw | QueryFactoryHandlerRaw | DataFactoryHandlerRaw;

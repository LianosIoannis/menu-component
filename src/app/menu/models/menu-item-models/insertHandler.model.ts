import type { Handler } from "./handler.model";
import type { InsertInput } from "./insertInput.model";
import type { MutationOutput } from "./mutationOutput.model";

export type InsertHandler = Handler<InsertInput, MutationOutput>;

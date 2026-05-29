import type { Handler } from "./handler.model";
import type { MutationOutput } from "./mutationOutput.model";
import type { UpdateInput } from "./updateInput.model";

export type UpdateHandler = Handler<UpdateInput, MutationOutput>;

import type { DeleteInput } from "./deleteInput.model";
import type { Handler } from "./handler.model";
import type { MutationOutput } from "./mutationOutput.model";

export type DeleteHandler = Handler<DeleteInput, MutationOutput>;

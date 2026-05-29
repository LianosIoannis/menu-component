import type { Handler } from "./handler.model";
import type { SelectInput } from "./selectInput.model";
import type { SelectOutput } from "./selectOutput.model";

export type SelectHandler = Handler<SelectInput, SelectOutput>;

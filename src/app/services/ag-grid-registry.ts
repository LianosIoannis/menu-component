import { Injectable } from "@angular/core";
import { AllCommunityModule, ModuleRegistry } from "ag-grid-community";

@Injectable({ providedIn: "root" })
export class AgGridRegistry {
	constructor() {
		ModuleRegistry.registerModules([AllCommunityModule]);
	}
}

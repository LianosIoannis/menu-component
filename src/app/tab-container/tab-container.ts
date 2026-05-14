import { ChangeDetectionStrategy, Component, computed, inject, input, output } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatTabsModule } from "@angular/material/tabs";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { tableData } from "../mock-data/tableData";
import { FaIconRegistry } from "../services/fa-icon-registry";
import { TabContentTable } from "../tab-content-table/tab-content-table";
import type { TabModel } from "./tab.model";

@Component({
	selector: "app-tab-container",
	imports: [MatTabsModule, MatButtonModule, MatIconModule, FontAwesomeModule, TabContentTable],
	changeDetection: ChangeDetectionStrategy.OnPush,
	templateUrl: "./tab-container.html",
})
export class TabContainer {
	faIconRegistry = inject(FaIconRegistry);
	tableData = tableData;
	readonly tabs = input.required<readonly TabModel[]>();
	readonly activeTabId = input<string | null>(null);

	readonly tabSelected = output<string>();
	readonly tabClosed = output<string>();

	protected readonly selectedIndex = computed(() => {
		const activeId = this.activeTabId();
		const index = this.tabs().findIndex((tab) => tab.id === activeId);

		return index >= 0 ? index : 0;
	});

	protected selectTab(index: number): void {
		const tab = this.tabs()[index];

		if (!tab) {
			return;
		}

		this.tabSelected.emit(tab.id);
	}

	protected closeTab(event: MouseEvent, tabId: string): void {
		event.stopPropagation();
		this.tabClosed.emit(tabId);
	}
}

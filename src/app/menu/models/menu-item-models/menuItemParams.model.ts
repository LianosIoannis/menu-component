import type { ScreenType } from "./screenType.model";
import type { TableScreenParams } from "./tableScreenParams.model";

export type MenuItemParams = {
	screenType: ScreenType;
	tableParams?: TableScreenParams;
};

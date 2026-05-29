import type { ScreenType } from "./screenType.raw.model";
import type { TableScreenParamsRaw } from "./tableScreenParams.raw.model";

export type MenuItemParamsRaw = {
	screenType: ScreenType;
	tableParams?: TableScreenParamsRaw;
};

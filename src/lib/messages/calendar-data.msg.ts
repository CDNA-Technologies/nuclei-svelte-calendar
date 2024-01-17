export interface Data {
	left?: CellExtraData;
	right?: CellExtraData;
	top?: CellExtraData;
	bottom?: CellExtraData;
	color?: string;
}

export interface CellExtraData {
	props?: any;
	component: any;
}

import { DataToMap } from "./DataToMap";

export interface MapData {
    roadTripLinePath: DataToMap[];
    harvestingLinePath: DataToMap[];
    notHarvestingLinePath: DataToMap[];
    dischargeLinePath: DataToMap[];
    dischargeWithoutCircleLinePath: DataToMap[];

    roadTripLinePathColor: string;
    harvestingLinePathColor: string;
    notHarvestingLinePathColor: string;
    dischargeLinePathColor: string;
    dischargeWithoutCircleLinePathColor: string;

    timelyGapLinePath: any[],
    roadTripPolygonPath: any[],
    harvestingPolygonPath: any[],
    notHarvestingPolygonPath: any[],
    dischargePolygonPath: any[],
    dataType: number,
}
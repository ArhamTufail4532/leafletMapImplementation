import { Coordinate } from "./Coordinate";

export interface DataToMap {
    coordinates: Coordinate[];
    orderNumber: number;
    identifier: number;
    isIdentifierEnd: boolean;
    machine: string | null;
}
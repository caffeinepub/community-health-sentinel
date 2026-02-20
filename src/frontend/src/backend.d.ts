import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface WardReference {
    fullName: string;
    riskColor: string;
    mapCellDescription: string;
    wardNumber: WardKey;
}
export interface WardData {
    turbidity: number;
    bacteriaIndex: number;
    humidity: number;
    rainfall: number;
    riskPrediction: RiskPrediction;
}
export type Time = bigint;
export interface RiskPrediction {
    riskCategory: string;
    riskPercentage: number;
    message: string;
    timestamp: Time;
}
export type WardKey = bigint;
export interface backendInterface {
    calculateAndPersistRisk(wardKey: WardKey, rainfall: number, humidity: number, turbidity: number, bacteriaIndex: number): Promise<RiskPrediction | null>;
    getAllPersistedWardData(): Promise<Array<[WardKey, WardData]>>;
    getAllWardColors(): Promise<Array<[WardKey, string]>>;
    getExistingRiskPrediction(wardKey: WardKey): Promise<RiskPrediction | null>;
    getWardReferences(): Promise<Array<WardReference>>;
    resetHistoricalData(): Promise<void>;
}

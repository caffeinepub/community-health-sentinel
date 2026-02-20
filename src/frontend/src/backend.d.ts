import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface RiskPrediction {
    riskCategory: string;
    riskPercentage: number;
    message: string;
    timestamp: Time;
}
export type Time = bigint;
export interface backendInterface {
    predictOutbreakRisk(rainfall: number, humidity: number, turbidity: number, bacteriaIndex: number): Promise<RiskPrediction>;
    resetHistoricalData(): Promise<void>;
}


import { debugSettings } from "./debugSettings";
import { getDeleteRequestInit, getPutRequestInit, getRequestInit } from "./helper";

export interface TableReloadInformation {
    reloadRequired: boolean;

    /**
     * Gets or sets a value indicating whether table was reloaded.
     */
    tableReloaded: boolean;

    seat1Reloaded: boolean;

    seat2Reloaded: boolean;

    seat3Reloaded: boolean;

    seat4Reloaded: boolean;

    seat5Reloaded: boolean;

    seat6Reloaded: boolean;

    seat7Reloaded: boolean;

    seat8Reloaded: boolean;

    seat9Reloaded: boolean;

    seat10Reloaded: boolean;

    emergencyReload: boolean;
}

const defaultHeaders = new Headers();
defaultHeaders.append("Content-Type", "application/json");
defaultHeaders.append("pragma", "no-cache");
defaultHeaders.append("cache-control", "no-cache");
const get: RequestInit = {
    headers: defaultHeaders,
};

const put = {
    headers: defaultHeaders,
    method: "PUT",
};

const del = {
    headers: defaultHeaders,
    method: "DELETE",
};

export interface ITableReload {
    getTableReload(tableId: number): Promise<TableReloadInformation>;
    confirmEmergencyReload(tableId: number): Promise<void>;
    confirmTableReload(tableId: number): Promise<void>;
    confirmSeatReload(tableId: number, seatId: number): Promise<void>;
}

export class TableReload implements ITableReload {
    constructor(public host: string) {
    }

    public async getTableReload(tableId: number) {
        const event = `Get table ${tableId} reload`;
        this.logStartReloadEvent(event);
        const response = await fetch(this.host + `/server/api/reload/${tableId}`, get);
        this.log(`Finish ${event} with status ${response.status}`);
        const jsonData = await response.json() as TableReloadInformation;
        this.log(`Event ${event} returned ${JSON.stringify(jsonData)}`);
        return jsonData;
    }

    public async confirmEmergencyReload(tableId: number) {
        const event = "Confirm emergency reload";
        this.logStartReloadEvent(event);
        const response = await fetch(this.host + `/server/api/reload/${tableId}/table/emergency`, del);
        this.logFinishReloadEvent(event, response.status);
    }

    public async confirmTableReload(tableId: number) {
        const event = "Confirm table " + tableId + " reload";
        this.logStartReloadEvent(event);
        const response = await fetch(this.host + `/server/api/reload/${tableId}/table`, put);
        this.logFinishReloadEvent(event, response.status);
    }

    public async confirmSeatReload(tableId: number, seatId: number) {
        const event = `Confirm seat ${seatId} on table ${tableId} reload`;
        this.logStartReloadEvent(event);
        const response = await fetch(this.host + `/server/api/reload/${tableId}/seats/${seatId}`, put);
        this.logFinishReloadEvent(event, response.status);
    }

    private logStartReloadEvent(event: string) {
        this.log(`Starting ${event}`);
    }

    private logFinishReloadEvent(event: string, status: any) {
        this.log(`Finish ${event} with status ${status}`);
    }

    private log(event: string) {
        if (!debugSettings.traceReload) {
            return;
        }

        // tslint:disable-next-line no-console
        console.log(event);
    }
}

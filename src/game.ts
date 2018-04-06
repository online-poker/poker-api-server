import { getDeleteRequestInit, getPostRequestInit, getPutRequestInit, getQueryString, getRequestInit } from "./helper";
import { ApiResult, StatusResponse } from "./response";

export interface AddBalanceResponse extends StatusResponse {
    Amount: number;
}

/**
 * Table information in the lobby.
 */
export interface LobbyTableItem {
    /**
     * Unique id of the table.
     */
    TableId: number;

    /**
     * Name of the table
     */
    TableName: string;

    SmallBlind: number;
    BigBlind: number;
    JoinedPlayers: number;
    MaxPlayers: number;
    PotLimitType: number;
    AveragePotSize: number;
    HandsPerHour: number;
    CurrencyId: number;
    SeatMask: number;
}

export interface SitResponse extends StatusResponse {
    MinimalAmount: number;
}

export interface GameTableModel {
    TableId: number;
    TableName: string;
    SmallBlind: number;
    BigBlind: number;
    AveragePotSize: number;
    CurrencyId: number;
    HandsPerHour: number;
    JoinedPlayers: number;
    MaxPlayers: number;
    PotLimitType: number;
    TournamentId?: number;
}

export interface IGame {
    getTables(
        fullTables: boolean | null,
        privateTables: number | null,
        maxPlayers: number,
        betLevels: number,
        moneyType: number,
        limitType: number,
        showTournamentTables: boolean): Promise<ApiResult<LobbyTableItem[]>>;
    getTableById(tableId: number): Promise<ApiResult<GameTableModel>>;
    getSitingTables(): Promise<ApiResult<number[]>>;
    sit(tableId: number, seat: number, amount: number, ticketCode: string): Promise<SitResponse>;
    sitAnywhere(tableId: number, amount: number): Promise<SitResponse>;
    standup(tableId: number): Promise<StatusResponse>;
    fold(tableId: number): Promise<StatusResponse>;
    checkOrCall(tableId: number): Promise<StatusResponse>;
    betOrRaise(tableId: number, amount: number): Promise<StatusResponse>;
    changeWaitQueueSettings(tableId: number, waitBigBlind: boolean): Promise<StatusResponse>;
    addBalance(tableId: number, amount: number, ticketCode: string): Promise<AddBalanceResponse>;
    sitOut(tableId: number): Promise<StatusResponse>;
    comeBack(tableId: number): Promise<StatusResponse>;
    muck(tableId: number): Promise<StatusResponse>;
    showCards(tableId: number): Promise<StatusResponse>;
    showHoleCard(tableId: number, cardPosition: number): Promise<StatusResponse>;
    setTableParameters(tableId: number, openCardsAutomatically: boolean): Promise<StatusResponse>;
}

export class Game implements IGame {
    constructor(public host: string) {
    }

    public async getTables(
        fullTables: boolean | null,
        privateTables: number | null,
        maxPlayers: number,
        betLevels: number,
        moneyType: number,
        limitType: number,
        showTournamentTables: boolean) {
        const data = {
            betLevels,
            fullTables,
            limitType,
            maxPlayers,
            moneyType,
            privateTables,
            showTournamentTables,
        };
        const response = await fetch(this.host + "/api/tables?" + getQueryString(data));
        const jsonData = await response.json() as ApiResult<LobbyTableItem[]>;
        return jsonData;
    }
    public async getTableById(tableId: number) {
        const data = {};
        const response = await fetch(this.host + `/api/tables/${tableId}`);
        const jsonData = await response.json() as ApiResult<GameTableModel>;
        return jsonData;
    }
    public async getSitingTables() {
        const url = this.host + `/api/account/my/tables`;
        const response = await fetch(url, getRequestInit());
        const jsonData = await response.json() as ApiResult<number[]>;
        return jsonData;
    }
    public async sit(tableId: number, seat: number, amount: number, ticketCode: string) {
        const data = { Amount: amount, TicketCode: ticketCode };
        const url = this.host + `/api/tables/${tableId}/seats/${seat}/queue`;
        const response = await fetch(url, getPostRequestInit(data));
        const jsonData = await response.json() as SitResponse;
        return jsonData;
    }
    public async sitAnywhere(tableId: number, amount: number) {
        const data = { Amount: amount };
        const response = await fetch(this.host + `/api/tables/${tableId}/seats/queue`, getPostRequestInit(data));
        const jsonData = await response.json() as SitResponse;
        return jsonData;
    }
    public async standup(tableId: number) {
        const response = await fetch(this.host + `/api/tables/${tableId}/seats/me`, getDeleteRequestInit());
        const jsonData = await response.json() as StatusResponse;
        return jsonData;
    }
    public async fold(tableId: number) {
        const url = this.host + `/api/tables/${tableId}/game/current/actions/fold`;
        const response = await fetch(url, getPostRequestInit());
        const jsonData = await response.json() as StatusResponse;
        return jsonData;
    }
    public async checkOrCall(tableId: number) {
        const url = this.host + `/api/tables/${tableId}/game/current/actions/check-call`;
        const response = await fetch(url, getPostRequestInit());
        const jsonData = await response.json() as StatusResponse;
        return jsonData;
    }
    public async betOrRaise(tableId: number, amount: number) {
        const data = { Amount: amount };
        const url = this.host + `/api/tables/${tableId}/game/current/actions/bet-raise`;
        const response = await fetch(url, getPostRequestInit(data));
        const jsonData = await response.json() as StatusResponse;
        return jsonData;
    }
    public async changeWaitQueueSettings(tableId: number, waitBigBlind: boolean) {
        const data = { WaitBigBlind: waitBigBlind };
        const response = await fetch(this.host + `/api/tables/${tableId}/queue/settings`, getPostRequestInit(data));
        const jsonData = await response.json() as StatusResponse;
        return jsonData;
    }
    public async addBalance(tableId: number, amount: number, ticketCode: string) {
        const data = { Amount: amount, TicketCode: ticketCode };
        const response = await fetch(this.host + `/api/tables/${tableId}/balance`, getPostRequestInit(data));
        const jsonData = await response.json() as AddBalanceResponse;
        return jsonData;
    }
    public async sitOut(tableId: number) {
        const response = await fetch(this.host + `/api/tables/${tableId}/status/sit-out`, getPutRequestInit());
        const jsonData = await response.json() as StatusResponse;
        return jsonData;
    }
    public async comeBack(tableId: number) {
        const response = await fetch(this.host + `/api/tables/${tableId}/status/sit-out`, getDeleteRequestInit());
        const jsonData = await response.json() as StatusResponse;
        return jsonData;
    }
    public async muck(tableId: number) {
        const url = this.host + `/api/tables/${tableId}/game/current/hole-cards/both/visibility`;
        const response = await fetch(url, getDeleteRequestInit());
        const jsonData = await response.json() as StatusResponse;
        return jsonData;
    }
    public async showCards(tableId: number) {
        const url = this.host + `/api/tables/${tableId}/game/current/hole-cards/both/visibility`;
        const response = await fetch(url, getPutRequestInit());
        const jsonData = await response.json() as StatusResponse;
        return jsonData;
    }
    public async showHoleCard(tableId: number, cardPosition: number) {
        const url = this.host + `/api/tables/${tableId}/game/current/hole-cards/${cardPosition}/visibility`;
        const response = await fetch(url, getPutRequestInit());
        const jsonData = await response.json() as StatusResponse;
        return jsonData;
    }
    public async setTableParameters(tableId: number, openCardsAutomatically: boolean) {
        const data = { OpenCardsAutomatically: openCardsAutomatically };
        const response = await fetch(this.host + `/api/tables/${tableId}/settings`, getPutRequestInit(data));
        const jsonData = await response.json() as StatusResponse;
        return jsonData;
    }
}

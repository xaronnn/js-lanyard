export default class Lanyard {
    #private;
    id: string;
    constructor(id: string, compress?: boolean);
    on(type: "INIT_STATE" | "PRESENCE_UPDATE" | "ALL", callback: (data: unknown) => unknown): void;
    fetch(id?: string): Promise<any>;
}

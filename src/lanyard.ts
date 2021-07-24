// webpack is setup so that node-fetch module is expected to be installed on the server-side. Otherwise browser.js will use the native fetch.
const fetchUrl = require("node-fetch") || require("node-fetch/browser.js")
// webpack is setup so that node.js file expected to be installed on the server-side. Otherwise the broswer.js file will use the native WebSocket.
const ws = require("isomorphic-ws/node.js") || require("isomorphic-ws/browser.js")
import { author, version } from '../package.json'
import { Response } from 'node-fetch'; // Typings for Line 114

export default class Lanyard {
    id: string;
    #version = version;
    #author = author;
    #socket: WebSocket;
    #socketUrl = "wss://api.lanyard.rest/socket";
    #api = "https://api.lanyard.rest/v1/users/"
    #opCodes = {
        INFO: 0,
        HELLO: 1,
        INIT: 2,
        HEARTBEAT: 3,
    }

    constructor(id: string, compress = false) {
        if (id === undefined) throw new Error("No ID supplied");
        this.id = id;
        this.#socketUrl = (compress ? this.#socketUrl + "?compression=zlib_json" : this.#socketUrl);
        this.#socket = new ws(this.#socketUrl);
        console.log("[Lanyard] Construct success. (JS-Lanyard/" + this.#version + " by " + this.#author + ")");
    }

    on(type: "INIT_STATE" | "PRESENCE_UPDATE" | "ALL", callback: (data: unknown) => unknown) {
        this.#socket.onmessage = (message: MessageEvent<string>) => {
            const data = message.data
            const parsedData = JSON.parse(data);
            switch (type) {
                case "INIT_STATE":
                    switch (parsedData.op) {
                        case this.#opCodes.HELLO:
                            this.#socket.send(JSON.stringify({
                                op: this.#opCodes.INIT,
                                d: {
                                    subscribe_to_id: this.id
                                }
                            }));
                            setInterval(() => {
                                this.#socket.send(JSON.stringify({
                                    op: this.#opCodes.HEARTBEAT
                                }))
                            }, parsedData.d.heartbeat_interval);
                            break;
                        case this.#opCodes.INFO:
                            callback({
                                "id": parsedData.d.discord_user.id,
                                "username": parsedData.d.discord_user.username + "#" + parsedData.d.discord_user.discriminator,
                                "avatar": parsedData.d.discord_user.avatar,
                                "status": parsedData.d.discord_status,
                                "activities": (parsedData.d.activities.length <= 0 ? null : parsedData.d.activities),
                                "listening": parsedData.d.spotify
                            })
                            break;
                    }
                    break;
                case "PRESENCE_UPDATE":
                    switch (parsedData.op) {
                        case this.#opCodes.HELLO:
                            this.#socket.send(JSON.stringify({
                                op: this.#opCodes.INIT,
                                d: {
                                    subscribe_to_id: this.id
                                }
                            }));
                            setInterval(() => {
                                this.#socket.send(JSON.stringify({
                                    op: this.#opCodes.HEARTBEAT
                                }))
                            }, parsedData.d.heartbeat_interval);
                            break;
                        case this.#opCodes.INFO:
                            callback({
                                "status": parsedData.d.discord_status
                            })
                            break;
                    }
                    break;
                case "ALL":
                    switch (parsedData.op) {
                        case this.#opCodes.HELLO:
                            this.#socket.send(JSON.stringify({
                                op: this.#opCodes.INIT,
                                d: {
                                    subscribe_to_id: this.id
                                }
                            }));
                            setInterval(() => {
                                this.#socket.send(JSON.stringify({
                                    op: this.#opCodes.HEARTBEAT
                                }))
                            }, parsedData.d.heartbeat_interval);
                            break;
                        case this.#opCodes.INFO:
                            callback(parsedData.d);
                            break;
                    }
                    break;
                default:
                    throw new Error("Invalid event type. (Available events: [INIT_STATE, PRESENCE_UPDATE, ALL])");
            }

        }
    }

    async fetch(id?: string) {
        const url = (id ? this.#api + id : this.#api + this.id);
        let data: any = {};
        let errorMessage: unknown
        await fetchUrl(url).then((response: Response) => response.json()).then((response: unknown) => {
            data = response;
        }).catch((err: unknown) => {
            errorMessage = err;
        });
        return (data.success ? data.data : errorMessage);
    }

}

"use strict";

const CONSTANTS = {
    API_URL: "https://api.lanyard.rest/v1",
    WEBSOCKET_URL: "wss://api.lanyard.rest/socket",
    HEARTBEAT_PERIOD: 1000 * 30
}

async function lanyard(opts) {
    if (!opts) throw new Error("Specify an options object");
    if (!opts.userId) throw new Error("Specify a user ID");
    
    if (opts.socket) {
        if (!opts.onPresenceUpdate) throw new Error("Specify onPresenceUpdate callback");

        const supportsWebSocket = "WebSocket" in window || "MozWebSocket" in window;
        if (!supportsWebSocket) throw new Error( "Browser doesn't support WebSocket connections.",);
        
        const socket = new WebSocket(CONSTANTS.WEBSOCKET_URL);
        const subscription = typeof opts.userId == "string" ? "subscribe_to_id" : "subscribe_to_ids"

        socket.addEventListener("open", () => {
            socket.send(
                JSON.stringify({
                    op: 2,
                    d: {
                        [subscription]: opts.userId,
                    },
                }),
            );

            setInterval(() => {
                socket.send(
                    JSON.stringify({
                        op: 3,
                    }),
                );
            }, CONSTANTS.HEARTBEAT_PERIOD);
        });

        socket.addEventListener("message", ({ data }) => {
            const { t, d } = JSON.parse(data)

            if (t === "INIT_STATE" || t === "PRESENCE_UPDATE") {
                opts.onPresenceUpdate(d)
            }
        });

        return socket;
    } else {
        if (typeof opts.userId == "string") {
            const res = await fetch(`${CONSTANTS.API_URL}/users/${opts.userId}`);
            const body = await res.json();

            if (!body.success) throw new Error(body.error?.message || "An invalid error occured");

            return body.data;
        } else {
            const val = [];

            for (const userId of opts.userId) {
                const res = await fetch(`${CONSTANTS.API_URL}/users/${userId}`);
                const body = await res.json();

                if (!body.success) throw new Error(body.error?.message || "An invalid error occured");

                val.push(body.data)
            }

            return val;
        }
    }
}

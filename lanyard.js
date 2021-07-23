"use strict";

class Lanyard {
  
  constructor(id) {
    if(!id) return;
    this.id = id;
    this.lanyard = new WebSocket("wss://api.lanyard.rest/socket");
    this.opCodes = {
      INFO: 0,
      HELLO: 1,
      INIT: 2,
      HEARTBEAT: 3,
    };
  }
  
  listen(x) {
    this.lanyard.onmessage = ({data}) => {
      const parsedData = JSON.parse(data);
      
      switch(parsedData.op) {
        case this.opCodes.HELLO:
          this.lanyard.send(JSON.stringify({
            op: this.opCodes.INIT,
            d: {
              subscribe_to_id: this.id
            }
          }));
          setInterval(() => {
            lanyard.send(JSON.stringify({
              op: this.opCodes.HEARTBEAT
            }))
          }, parsedData.d.heartbeat_interval);
          break;
        case this.opCodes.INFO:
          x(parsedData.d);
          break;
      }
    }
  }
  
}

import peerConfig from "../config.json"
import { writable, get } from "svelte/store"
const debugMode = true;
let peerService;

const debugMsg = (text, obj) => {
  if (debugMode) {
    peerService.messages.update(messages => [...messages, { text, type: "admin" }]);
    console.log(text, obj);
  }
}

export function getPeerService() {

  if (peerService) {
    return peerService
  } else {
    peerService = {
      id: writable(),
      server: writable(),
      peerId: writable(),
      messages: writable([]),
      dataConnection: writable(),
      connectToServer: (id) => {
        debugMsg("peerId:", id);
        peerService.id.set(id);
        peerService.server.set(new Peer(id, peerConfig));
      },
      disconnectFromServer: () => peerService.server.set(),
      connectToPeer: (peerId) => {
        peerService.peerId.set(peerId);
        peerService.dataConnection.set(get(peerService.server).connect(peerId));
      },
      disconnectFromPeer: () => peerService.dataConnection.set(),
      sendMessage: (msg) => {
        if (peerService.dataConnection) {
          peerService.messages.update(messages => [...messages, { text: msg, type: "outgoing" }]);
          get(peerService.dataConnection).send(msg);
        }
      }
    }

    peerService.server.subscribe(peer => {
      if (peer) {
        peer.on("error", error => {
          debugMsg(error, "admin");
        });
        peer.on("open", newId => {
          debugMsg("connection to server opened, id is", newId);
          peerService.id.set(newId);
        });
        peer.on("connection", newConnection => {
          debugMsg("got connection from server", newConnection);
          peerService.dataConnection.set(newConnection);
        });
      }
    })


    peerService.dataConnection.subscribe(dataConnection => {
      if (dataConnection) {
        dataConnection.on('open', () => {
          debugMsg("setting up connection", dataConnection);
          dataConnection.on("data", text => {
            peerService.messages.update(messages => [...messages, { text, type: "incoming" }]);
          });
          dataConnection.on("close", () => {
            debugMsg("connection closed", "admin");
            peerService.dataConnection.set(null);
          });
          dataConnection.on("error", error => {
            debugMsg(error, "admin");
          });
        });
      }
    })
  }
  return peerService;
}
import peerConfig from "../config.json"
import { writable, get } from "svelte/store"
let peerService;

export function getPeerService() {

  if (peerService) {
    return peerService
  } else {
    peerService = {
      myId: writable(),
      server: writable(),
      peerId: writable(),
      messages: writable([]),
      dataConnection: writable(),
      connectToServer: (myId) => {
        peerService.debugMsg("myid:", myId);
        peerService.myId.set(myId);
        const server = new Peer(myId, peerConfig);
        peerService.server.set(server);

      },
      connectToPeer: (peerId) => {
        peerService.peerId.set(peerId);
        peerService.dataConnection.set(get(peerService.server).connect(peerId));
      },
      disconnectFromPeer: () => peerService.dataConnection.set(),
      sendMessage: (newMessage) => {
        if (peerService.dataConnection) {
          peerService.messages.update(messages => [...messages, { message: newMessage, type: 'outgoing'}]);
          get(peerService.dataConnection).send(newMessage);
        }
      },
      debugMsg: (text, obj) => {
        if (window.debugMode) {
          const timestamp = new Date().getTime()
          let message = {
            id: '',
            text,
            timestamp
          }
          peerService.messages.update(messages => [...messages, { message, type: 'admin'}]);
          console.log(text, obj);
        }
      }
    }

    peerService.server.subscribe(peer => {
      if (peer) {
        peer.on("error", error => {
          peerService.debugMsg(error, "admin");
        });
        peer.on("open", newId => {
          peerService.debugMsg("connection to server opened, id is", newId );
          peerService.myId.set(newId);
        });
        peer.on("connection", newConnection => {
          peerService.debugMsg("got peer connection from server", newConnection);
          peerService.dataConnection.set(newConnection);
          peerService.peerId.set(newConnection.peer);
        });
      }
    })


    peerService.dataConnection.subscribe(dataConnection => {
      if (dataConnection) {
        dataConnection.on('open', () => {
          peerService.debugMsg("setting up connection", dataConnection);
          dataConnection.on("data", newMessage => {
            peerService.messages.update(messages => [...messages, { message: newMessage, type: 'incoming'}]);
          });
          dataConnection.on("close", () => {
            peerService.debugMsg("connection closed", "admin");
            peerService.dataConnection.set(null);
          });
          dataConnection.on("error", error => {
            peerService.debugMsg(error, "admin");
          });
        });
      }
    })
  }
  return peerService;
}
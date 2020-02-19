<script>
  import SendMessage from "./SendMessage.svelte";
  import MessageList from "./MessageList.svelte";
  import SideMenu from "./SideMenu.svelte";
  import { onMount } from "svelte";

  let id = "";
  let partnerId = "";
  let peer;
  let connection;
  let messages = [];

  onMount(() => {
    peer = new Peer(Math.random() > 0.5 ? "juliusz" : "pawel", {
      host: "localhost",
      port: 80,
      path: '/api',
      config: {
        iceServers: [
          { url: "stun:stun.l.google.com:19302" },
          { url: "turn:juliusz@172.105.78.53:3478", username: 'juliusz', credential: "pawel" }
        ]
      }
    });
    peer.on("error", error => {
      addMessage(error, "admin");
    });
    peer.on("open", newId => {
      debugMsg("connection to peer opened, id is", newId);
      id = newId;
    });
    peer.on("connection", newConnection => {
      debugMsg("got connection from server", newConnection);

      newConnection.on("open", () => {
        debugMsg("incoming connection 'open'", newConnection);
        setConnection(newConnection);
        addMessage(`${partnerId} has joined`, "admin");
      });
    });
  });

  function debugMsg(msg, obj) {
    console.log(msg, obj);
    addMessage(msg, "admin");
  }

  const connect = () => {
    const connection = peer.connect(partnerId);
    debugMsg("requested connection", connection);
    connection.on("open", () => {
      debugMsg("outgoing connection open", connection);
      setConnection(connection);
    });
  };
  const closeConnection = () => {
    connection.close();
  };

  function addMessage(text, type) {
    messages = [...messages, { text, type }];
  }

  function setConnection(newConnection) {
    debugMsg("setting up connection", newConnection);
    partnerId = newConnection.peer;
    connection = newConnection;
    connection.on("data", text => {
      addMessage(text, "incoming");
    });
    connection.on("close", () => {
      addMessage("connection closed", "admin");
      connection = null;
    });
    connection.on("error", error => {
      addMessage(error, "admin");
    });
  }

  function handleNewMessage(event) {
    addMessage(event.detail.text, "outgoing");
    connection.send(event.detail.text);
  }
</script>

<style>
  .main-window {
    border: 1px solid #e2e2e2;
    padding: 8px;
  }
</style>

<div class="container">
  <div class="row">
    <div class="col-12 col-md-8 main-window">
      <MessageList {messages} />
      <SendMessage on:message={handleNewMessage} />
    </div>
    <div class="col-12 col-md-4">
      <SideMenu
        {id}
        bind:partnerId
        on:connect={connect}
        on:closeConnection={closeConnection}
        connected={!!connection} />
    </div>
  </div>
</div>

<script>
  import { createEventDispatcher } from "svelte";
  import { onMount } from "svelte";

  export let peerServer;
  export let peerId;

  const dispatch = createEventDispatcher();

  onMount(() => {
    setup();
  });

  const requestLocalVideo = async callbacks => {
    let stream = null;

    try {
      stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: true
      });
      window.localStream = stream;
      onReceiveStream(stream, "my-camera");
    } catch (err) {
      console.error(error);
    }
  };

  const onReceiveStream = (stream, element_id) => {
    let video = document.getElementById(element_id);
    video.srcObject = stream;
    window.peer_stream = stream;
  };

  const setup = () => {
    peerServer.on("call", async call => {
      let acceptsCall = confirm(
        "Videocall incoming, do you want to accept it ?"
      );

      if (acceptsCall) {
        await requestLocalVideo();
        call.answer(window.localStream);

        call.on("stream", stream => {
          window.peer_stream = stream;
          onReceiveStream(stream, "peer-camera");
        });

        call.on("close", () => {
          alert("The videocall has finished");
        });
      } else {
        console.log("Call denied !");
      }
    });
  };

  const startVideoChat = async () => {
    await requestLocalVideo();
    console.log("Calling to " + peerId);

    let call = peerServer.call(peerId, window.localStream);
    console.log(call);

    call.on("stream", function(stream) {
      window.peer_stream = stream;
      onReceiveStream(stream, "peer-camera");
    });
  };
</script>

<style>
  .video-chat {
    margin-top: 30px;
  }
</style>

<div class="video-chat">
  <button class="btn btn-primary d-block" on:click={startVideoChat}>
    Start video chat
  </button>
  <video
    id="my-camera"
    width="300"
    height="300"
    autoplay="autoplay"
    playsinline
    muted="true"
    class="mx-auto d-inline-block"
  />
  <video
    id="peer-camera"
    width="300"
    height="300"
    autoplay="autoplay"
    playsinline
    muted="true"
    class="mx-auto d-inline-block"
  />
</div>

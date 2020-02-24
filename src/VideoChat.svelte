<script>
  import { createEventDispatcher, onMount, afterUpdate } from "svelte";
  import { get } from "svelte/store";

  const setup = peerServer => {
    peerServer.on("call", async call => {
      let acceptsCall = confirm(
        "Videocall incoming, do you want to accept it ?"
      );

      if (acceptsCall) {
        const localStream = await requestLocalVideo();
        if (!localStream) {
          return;
        }
        call.answer(localStream);

        call.on("stream", stream => {
          onReceiveStream(stream, "peer-camera");
        });

        call.on("close", () => {
          alert("The videocall has finished");
        });
      } else {
        peerService.debugMsg("Your rejected the call.");
      }
    });
  };

  export let peerService;
  const dispatch = createEventDispatcher();
  let peerId;
  let videoCallOn = false;
  let myCamera;
  let peerCamera;
  $: {
    if (myCamera) {
      myCamera.isPlaying = function() {
        return isPlaying(myCamera);
      };
    }
  }
  const isPlaying = element => {
    console.log("checking if " + element + " is playing");
    if (!element) return false;
    const answer = Boolean(
      element.currentTime > 0 &&
        !element.paused &&
        !element.ended &&
        element.readyState > 2
    );
    console.log("answer is ", answer);
    return answer;
  };
  $: myCameraPlaying = isPlaying(myCamera);
  $: peerCameraPlaying = isPlaying(peerCamera);

  peerService.peerId.subscribe(id => (peerId = id));
  peerService.server.subscribe(server => {
    if (server) {
      setup(server);
    }
  });

  const requestLocalVideo = async callbacks => {
    let stream = null;
    try {
      stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: true
      });
      onReceiveStream(stream, "my-camera");
      return stream;
    } catch (err) {
      peerService.debugMsg("Pear chat could not access your camera..", err);
    }
  };

  const onReceiveStream = (stream, element_id) => {
    let video = document.getElementById(element_id);
    video.srcObject = stream;
  };

  const startVideoChat = async () => {
    videoCallOn = true;
    const localStream = await requestLocalVideo();
    if (!localStream) {
      videoCallOn = false;
      return;
    }
    let call = get(peerService.server).call(peerId, localStream);
    call.on("stream", function(stream) {
      onReceiveStream(stream, "peer-camera");
    });
  };
</script>

<style>
  .video-chat {
    margin-top: 30px;
  }
  video.my-camera {
    background-color: hsl(80, 93%, 29%);
  }
  video.peer-camera {
    background-color: hsl(193, 93%, 29%);
  }
</style>

<div class="video-chat">
  {#if myCamera}
    <div>{myCameraPlaying}</div>
  {/if}
  <button class="btn btn-primary d-block" on:click={startVideoChat}>
    Start video chat
  </button>
  {#if videoCallOn}
    <div class="videos">
      <video
        bind:this={myCamera}
        id="my-camera"
        width="300"
        height="300"
        autoplay="autoplay"
        playsinline
        muted="true"
        class="mx-auto d-inline-block my-camera" />
      <video
        id="peer-camera"
        width="300"
        height="300"
        autoplay="autoplay"
        playsinline
        class="mx-auto d-inline-block peer-camera" />
    </div>
  {/if}
</div>

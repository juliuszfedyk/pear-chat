<script>
  import { createEventDispatcher } from 'svelte';
  import { onMount } from 'svelte';
  
  export let peerServer;
  export let peerId;

  const dispatch = createEventDispatcher();

	onMount(() => {
    setup()
	});
  
  const requestLocalVideo = async (callbacks) => {
      let stream = null;

      try {
        stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: true });
        window.localStream = stream;
        onReceiveStream(stream, 'my-camera');
      } catch(err) {
        console.error(error)
      }
  }

  const onReceiveStream = (stream, element_id) => {
      // Retrieve the video element according to the desired
      let video = document.getElementById(element_id);
      // Set the given stream as the video source 
      video.srcObject = stream;

      // Store a global reference of the stream
      window.peer_stream = stream;
  }

  const setup = () => {
    peerServer.on('call', async (call) => {
      let acceptsCall = confirm("Videocall incoming, do you want to accept it ?");

      if(acceptsCall){
          await requestLocalVideo();
          // Answer the call with your own video/audio stream
          call.answer(window.localStream);

          // Receive data
          call.on('stream', (stream) => {
              // Store a global reference of the other user stream
              window.peer_stream = stream;
              // Display the stream of the other user in the peer-camera video element !
              onReceiveStream(stream, 'peer-camera');
          });

          // Handle when the call finishes
          call.on('close', () => {
              alert("The videocall has finished");
          });

          // use call.close() to finish a call
      } else {
          console.log("Call denied !");
      }
    });
  }

  const startVideoChat = async () => {
    await requestLocalVideo()
    console.log('Calling to ' + peerId);

    let call = peerServer.call(peerId, window.localStream);
    console.log(call)

    call.on('stream', function (stream) {
        window.peer_stream = stream;
        onReceiveStream(stream, 'peer-camera');
    });
  }
</script>

<div class="video-chat">
  <button
    class="btn btn-primary d-block"
    on:click={startVideoChat}>
    Start video chat
  </button>
  <video id="my-camera" width="300" height="300" autoplay="autoplay" playsinline muted="true" class="mx-auto d-inline-block"></video>
  <video id="peer-camera" width="300" height="300" autoplay="autoplay" playsinline muted="true" class="mx-auto d-inline-block"></video>
</div>


<style>
  .video-chat {
    margin-top: 30px;
  }
</style>
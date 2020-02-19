<script>
	import { createEventDispatcher } from 'svelte';

  const dispatch = createEventDispatcher();
  
  const requestLocalVideo = (callbacks) => {
      // Monkeypatch for crossbrowser geusermedia
      navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

      // Request audio an video
      navigator.getUserMedia({ audio: true, video: true }, callbacks.success , callbacks.error);
  }

  const onReceiveStream = (stream, element_id) => {
      // Retrieve the video element according to the desired
      let video = document.getElementById(element_id);
      // Set the given stream as the video source 
      video.srcObject = stream;

      // Store a global reference of the stream
      window.peer_stream = stream;
  }

  const startVideo = () => {
    requestLocalVideo({
      success: function(stream){
        window.localStream = stream;
        onReceiveStream(stream, 'my-camera');
      },
      error: function(err){
        alert("Cannot get access to your camera and video !");
        console.error(err);
      }
    });
  }
</script>


<button
  class="btn btn-primary"
  on:click={startVideo}>
  Start video
</button>
<video id="my-camera"  width="300" height="300" autoplay="autoplay" muted="true" class="mx-auto d-block"></video>

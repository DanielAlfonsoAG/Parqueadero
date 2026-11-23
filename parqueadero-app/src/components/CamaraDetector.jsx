import { useEffect, useRef } from "react";

function CamaraDetector() {

  const videoRef = useRef(null);

  useEffect(() => {

    iniciarCamara();

  }, []);

  const iniciarCamara = async () => {

    const stream = await navigator.mediaDevices.getUserMedia({
      video: true
    });

    videoRef.current.srcObject = stream;
  };

  return (
    <video
      ref={videoRef}
      autoPlay
      playsInline
      width="700"
    />
  );
}

export default CamaraDetector;
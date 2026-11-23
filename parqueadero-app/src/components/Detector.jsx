import { useState, useRef } from "react";

function Detector() {
  const [image, setImagen] = useState(null);
  const [preview, setPreview] = useState("");
  const [placa, setPlaca] = useState("");
  const [tipo, setTipo] = useState("carro");
  const [mensaje, setMensaje] = useState("");
  const [loading, setLoading] = useState(false);
  const API_URL = import.meta.env.VITE_API_URL;
  const videoRef = useRef(null);

  const iniciarCamara = async () => {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: true,
    });

    if (videoRef.current) {
      videoRef.current.srcObject = stream;
    }

  } catch (error) {
    console.error(error);
    setMensaje("No se pudo acceder a la cámara");
  }
};

  const capturarFrame = () => {
    const canvas = document.createElement("canvas");

    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;

    const ctx = canvas.getContext("2d");

    ctx.drawImage(
      videoRef.current,
      0,
      0,
      canvas.width,
      canvas.height
    );

    return new Promise((resolve) => {
      canvas.toBlob(resolve, "image/jpeg");
    });
  };

  const manejarImagen = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setImagen(file);
    setPreview(URL.createObjectURL(file));
  };
  const detectarTipo = (placa) => {
    const placaLimpia = placa.replace("-", "").toUpperCase();

    // Moto: ABC12A
    if (/^[A-Z]{3}\d{2}[A-Z]$/.test(placaLimpia)) {
      return "moto";
    }

    // Carro: ABC123
    if (/^[A-Z]{3}\d{3}$/.test(placaLimpia)) {
      return "carro";
    }

    return "desconocido";
  };
  const procesarDeteccion = async (formData) => {
    setLoading(true);
    setMensaje("Detectando placa...");

    try {
      const res = await fetch(`${API_URL}/detectar`, {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      console.log("RESPUESTA BACKEND:", data);

      if (!data.placa || data.placa === "No detectada") {
        setMensaje(data.error || "Error detectando placa");
        return;
      }

      setPlaca(data.placa);

      const tipoDetectado = detectarTipo(data.placa);
      setTipo(tipoDetectado);

      setMensaje(`Placa detectada correctamente (${tipoDetectado})`);

    } catch (error) {
      console.log(error);
      setMensaje("Error detectando placa");
    } finally {
      setLoading(false);
    }
  };

  const detectarImagen = async () => {
    if (!image) {
      setMensaje("Seleccione una imagen");
      return;
    }

    const formData = new FormData();
    formData.append("image", image);

    await procesarDeteccion(formData);
  };
  const detectarCamara = async () => {

    if (loading) return;
    
    if (!videoRef.current) {
      setMensaje("Inicie la cámara");
      return;
    }

    const frame = await capturarFrame();

    const formData = new FormData();
    formData.append("image", frame, "frame.jpg");

    await procesarDeteccion(formData);
  };

  const registrarVehiculo = async () => {
    if (!placa) {
      setMensaje("No hay placa detectada");
      return;
    }

    try {
      const res = await fetch(`${API_URL}/vehiculos`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          placa,
          tipo,
        }),
      });

      const data = await res.json();

      if (data.error) {
        setMensaje(data.error);
        return;
      }

      setMensaje("Vehículo registrado correctamente");

      setPlaca("");
      setImagen(null);
      setPreview("");

    } catch (error) {
      console.log(error);
      setMensaje("Error registrando vehículo");
    }
  };

  return {
    image,
    preview,
    placa,
    tipo,
    mensaje,
    loading,

    videoRef,
    iniciarCamara,

    manejarImagen,
    detectarImagen,
    detectarCamara,
    registrarVehiculo,
  };
}

export default Detector;
import Detector from "../components/Detector";
import "../components/styles/DetectorPlacas.css";
import { useEffect } from "react";

function CamaraPlacas() {

    const {
        placa,
        tipo,
        mensaje,
        loading,

        videoRef,
        iniciarCamara,

        detectarCamara,
        registrarVehiculo,
    } = Detector();

    useEffect(() => {
        iniciarCamara();

        const intervalo = setInterval(() => {
            detectarCamara();
        }, 20000); // cada 20 segundos

        return () => {
            clearInterval(intervalo);

            if (videoRef.current?.srcObject) {
                videoRef.current.srcObject
                    .getTracks()
                    .forEach(track => track.stop());
            }
        };
    }, []);

    return (
        <div className="placas-container">

            <h1 className="placas-title">
                Detector de Placas por Cámara
            </h1>

            <div className="placas-card camara-card">
                <div className="camera-wrapper">
                    <video
                        ref={videoRef}
                        autoPlay
                        playsInline
                        muted
                        className="camera-video"
                    />
                </div>

                <div
                    style={{
                        marginTop: "15px",
                        display: "flex",
                        gap: "10px",
                    }}
                >
                    <button
                        onClick={iniciarCamara}
                        className="btn btn-blue"
                    >
                        Iniciar cámara
                    </button>

                    <button
                        onClick={registrarVehiculo}
                        className="btn btn-green"
                    >
                        Registrar
                    </button>
                </div>

                {placa && (
                    <div className="resultado-card ok">
                        <span>Placa detectada</span>

                        <h1>{placa}</h1>

                        <h3>Tipo: {tipo}</h3>
                    </div>
                )}

                {mensaje && (
                    <div className="resultado-mensaje">
                        {mensaje}
                    </div>
                )}

            </div>

        </div>
    );
}

export default CamaraPlacas;
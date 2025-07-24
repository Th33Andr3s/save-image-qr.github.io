const video = document.getElementById("video");
const canvas = document.getElementById("canvas");
const captureBtn = document.getElementById("capture");
const preview = document.getElementById("preview");

// 1. Iniciar la cámara
navigator.mediaDevices.getUserMedia({ video: true })
  .then((stream) => {
    video.srcObject = stream;
  })
  .catch((err) => {
    alert("No se pudo acceder a la cámara: " + err.message);
  });

// 2. Capturar la imagen
captureBtn.addEventListener("click", () => {
  const context = canvas.getContext("2d");
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  context.drawImage(video, 0, 0, canvas.width, canvas.height);

  const imageData = canvas.toDataURL("image/jpeg");

  preview.src = imageData;
  preview.style.display = "block";

  // 3. Subir al backend local
  const BACKEND_URL = "http://192.168.2.12:3000";
  fetch(`${BACKEND_URL}/api/upload`, {
    method: "POST",
    body: JSON.stringify({ image: imageData }),
    headers: {
      "Content-Type": "application/json",
    },
  })
  .then(res => {
    if (!res.ok) throw new Error("Error al subir la foto");
    return res.json();
  })
  .then(data => {
    alert("📁 Foto guardada con éxito en Drive (ID: " + data.fileId + ")");
  })
  .catch(err => {
    console.error(err);
    alert("❌ Falló la subida: " + err.message);
  });
});

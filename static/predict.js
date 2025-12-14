const form = document.getElementById("predict-form");
const fileInput = document.getElementById("image-input");
const result = document.getElementById("resultado");
const dropZone = document.getElementById("drop-zone");
const previewImg = document.getElementById("preview-img");

/* ====== Drag & Drop ====== */
dropZone.addEventListener("click", () => fileInput.click());

dropZone.addEventListener("dragover", (e) => {
    e.preventDefault();
    dropZone.classList.add("dragover");
});

dropZone.addEventListener("dragleave", () => {
    dropZone.classList.remove("dragover");
});

dropZone.addEventListener("drop", (e) => {
    e.preventDefault();
    dropZone.classList.remove("dragover");

    if (e.dataTransfer.files.length > 0) {
        fileInput.files = e.dataTransfer.files;
        showPreview(e.dataTransfer.files[0]);
    }
});

/* ====== Preview ====== */
fileInput.addEventListener("change", () => {
    if (fileInput.files.length > 0) {
        showPreview(fileInput.files[0]);
    }
});

function showPreview(file) {
    previewImg.src = URL.createObjectURL(file);
    previewImg.style.display = "block";
}

/* ====== Submit ====== */
form.addEventListener("submit", async (event) => {
    event.preventDefault();

    if (fileInput.files.length === 0) {
        result.innerText = "Por favor seleccioná una imagen.";
        return;
    }

    const formData = new FormData();
    formData.append("file", fileInput.files[0]);

    result.innerText = "Procesando imagen...";

    try {
        const response = await fetch(
            "https://4g0s-lunarisprueba2.hf.space/predict",
            {
                method: "POST",
                body: formData
            }
        );

        const data = await response.json();

        if (data.error) {
            result.innerText = "Error: " + data.error;
        } else {
            const clase = data.prediction;
            const prob = data.probabilities[clase];

            result.innerText =
                `Predicción: ${clase} (${prob}%)`;
        }

    } catch (error) {
        result.innerText = "Error al conectar con el predictor.";
    }
});

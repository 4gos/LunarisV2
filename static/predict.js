document.addEventListener("DOMContentLoaded", () => {

    const form = document.getElementById("predict-form");
    const fileInput = document.getElementById("image-input");
    const dropZone = document.getElementById("drop-zone");
    const previewImg = document.getElementById("imagePreview");
    const classText = document.getElementById("predicted-class");
    const probsContainer = document.getElementById("probabilities");
    const resultBox = document.getElementById("result-box");

    /* ===== Drag & Drop ===== */

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

    fileInput.addEventListener("change", () => {
        if (fileInput.files.length > 0) {
            showPreview(fileInput.files[0]);
        }
    });

    function showPreview(file) {
        previewImg.src = URL.createObjectURL(file);
        previewImg.style.display = "block";
    }

    /* ===== Submit ===== */

    form.addEventListener("submit", async (event) => {
        event.preventDefault();

        if (fileInput.files.length === 0) {
            alert("Seleccioná una imagen");
            return;
        }

        classText.innerText = "Analizando...";
        probsContainer.innerHTML = "";
        resultBox.style.display = "block";

        const formData = new FormData();
        formData.append("file", fileInput.files[0]);

        try {
            const response = await fetch(
                "https://4g0s-lunarisprueba2.hf.space/predict",
                {
                    method: "POST",
                    body: formData
                }
            );

            const data = await response.json();

            const clase = data.prediction;
            const prob = data.probabilities[clase];

            classText.innerText = `Predicción: ${clase} (${prob}%)`;

            Object.entries(data.probabilities).forEach(([label, p]) => {
                const item = document.createElement("div");
                item.className = "prob-item";

                item.innerHTML = `
                    <span>${label}: ${p}%</span>
                    <div class="bar-container">
                        <div class="bar" style="width:${p}%"></div>
                    </div>
                `;

                probsContainer.appendChild(item);
            });

        } catch (err) {
            classText.innerText = "Error al conectar con el predictor.";
        }
    });

});

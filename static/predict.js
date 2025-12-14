document.getElementById("predict-form").addEventListener("submit", async (event) => {
    event.preventDefault();

    const fileInput = document.getElementById("image-input");
    const resultBox = document.getElementById("result-box");
    const classText = document.getElementById("predicted-class");
    const probsContainer = document.getElementById("probabilities");
    const previewImg = document.getElementById("imagePreview");

    if (fileInput.files.length === 0) {
        alert("Seleccioná una imagen");
        return;
    }

    // Preview de la imagen
    previewImg.src = URL.createObjectURL(fileInput.files[0]);
    previewImg.style.display = "block";

    // Limpiar resultados anteriores
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

        if (data.error) {
            classText.innerText = "Error: " + data.error;
            return;
        }

        // Clase principal
        
        const data = await response.json();
    
        const clase = data.prediction;
        const prob = data.probabilities[clase];
    
        document.getElementById("resultado").innerText =
            `Predicción: ${clase} (${prob}%)`;

        // Barras de probabilidad
        Object.entries(data.probabilities).forEach(([label, prob]) => {
            const item = document.createElement("div");
            item.className = "prob-item";

            item.innerHTML = `
                <span>${label}: ${prob}%</span>
                <div class="bar-container">
                    <div class="bar" style="width:${prob}%"></div>
                </div>
            `;

            probsContainer.appendChild(item);
        });

    } catch (error) {
        classText.innerText = "Error al conectar con el predictor.";
    }
});

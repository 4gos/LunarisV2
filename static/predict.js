document.addEventListener("DOMContentLoaded", () => {

    document.getElementById("predict-form").addEventListener("submit", async (event) => {
        event.preventDefault();

        const fileInput = document.getElementById("image-input");
        const resultBox = document.getElementById("result-box");
        const classText = document.getElementById("predicted-class");
        const probsContainer = document.getElementById("probabilities");
        const previewImg = document.getElementById("imagePreview");

        if (!fileInput || !resultBox || !classText || !probsContainer || !previewImg) {
            console.error("Faltan elementos en el HTML");
            return;
        }

        if (fileInput.files.length === 0) {
            alert("Seleccioná una imagen");
            return;
        }

        previewImg.src = URL.createObjectURL(fileInput.files[0]);
        previewImg.style.display = "block";

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

            const clase = data.class;
            const prob = data.probability;

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

        } catch (error) {
            classText.innerText = "Error al conectar con el predictor.";
        }
    });

});

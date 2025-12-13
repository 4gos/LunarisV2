document.getElementById("predict-form").addEventListener("submit", async (event) => {
    event.preventDefault(); 
    // Evita que el formulario recargue la página

    const result = document.getElementById("resultado");
    const fileInput = document.getElementById("image-input");

    if (fileInput.files.length === 0) {
        result.innerText = "Por favor seleccioná una imagen.";
        return;
    }

    // Creamos el paquete de datos que se envía al backend
    const formData = new FormData();
    formData.append("file", fileInput.files[0]);

    result.innerText = "Procesando imagen...";

    try {
        const response = await fetch(
            "https://4g0s-lunarisprueba2.hf.space/",
            {
                method: "POST",
                body: formData
            }
        );

        const data = await response.json();

        if (data.error) {
            result.innerText = "Error: " + data.error;
        } else {
            result.innerText = 
                `Predicción: ${data.class} (${data.probability}%)`;
        }

    } catch (error) {
        result.innerText = "Error al conectar con el predictor.";
    }
});

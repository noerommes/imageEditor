// Selecciona el input de tipo "file" con la clase "file-input"
const fileInput = document.querySelector(".file-input");

// Selecciona el botón con la clase "choose-img"
const chooseImgBtn = document.querySelector(".choose-img");

// Selecciona el botón para guardar la imagen
const saveImgBtn = document.querySelector(".save-img");

// Selecciona el botón para restablecer los filtros
const resetFilterBtn = document.querySelector(".reset-filter");

// Selecciona la etiqueta <img> que se utilizará para mostrar la vista previa de la imagen
const previewImg = document.querySelector(".preview-img img");

// Selecciona elementos relacionados con filtros de imagen
const filterOptions = document.querySelectorAll(".filter button"); // Botones de filtro
const rotateOptions = document.querySelectorAll(".rotate button"); // Botones de rotación y espejo
const filterName = document.querySelector(".filter-info .name"); // Nombre del filtro seleccionado
const filterValue = document.querySelector(".filter-info .value"); // Valor del filtro seleccionado
const filterSlider = document.querySelector(".slider input"); // Control deslizante para ajustar el valor del filtro

// Agrega un event listener al botón "chooseImgBtn" que se activa cuando se hace clic en el botón
chooseImgBtn.addEventListener("click", () => fileInput.click());

// Variables para ajustar los valores de los filtros y transformaciones
let brightness = 100, saturation = 100, inversion = 0, grayscale = 0;
let rotate = 0, flipHorizontal = 1, flipVertical = 1;

// Función para aplicar los filtros de imagen a la vista previa
const applyFilters = () => {
    
    // Aplica la rotación y la escala de la imagen
    previewImg.style.transform = `rotate(${rotate}deg) scale(${flipHorizontal}, ${flipVertical})`;
    // Aplica los filtros de brillo, saturación, inversión e escala de grises
    previewImg.style.filter = `brightness(${brightness}%) saturate(${saturation}%) invert(${inversion}%) grayscale(${grayscale}%)`;
};

// Función para cargar la imagen
const loadImage = () => {

    // Obtiene el archivo seleccionado por el usuario (la primera imagen si hay varias)
    let file = fileInput.files[0];

    // Si no se seleccionó ningún archivo, no hace nada y sale de la función
    if (!file) {
        return;
    }

    // Agrega un event listener a la imagen de vista previa que se activa cuando la imagen se carga
    previewImg.addEventListener("load", () => {
        // Habilita una sección en el documento con la clase "container"
        document.querySelector(".container").classList.remove("disable");
    });

    // Establece la fuente (src) de la etiqueta <img> en la vista previa
    // utilizando la URL creada a partir del archivo seleccionado
    previewImg.src = URL.createObjectURL(file);
}

// Agrega un event listener al input "fileInput" que se activa cuando el usuario selecciona una nueva imagen
fileInput.addEventListener("change", loadImage);

// Itera sobre las opciones de filtro de imagen
filterOptions.forEach(option => {

    // Agrega un event listener a cada opción que se activa cuando se hace clic en la opción
    option.addEventListener("click", () => {
        // Remueve la clase "active" de la opción previamente seleccionada
        document.querySelector(".filter .active").classList.remove("active");
        // Agrega la clase "active" a la opción actual
        option.classList.add("active");
        // Actualiza el nombre del filtro en la sección de información de filtro
        filterName.innerText = option.innerText;

        // Configura el valor máximo y actual del control deslizante basado en la opción seleccionada
        if (option.id === "brightness") {
            filterSlider.max = "200";
            filterSlider.value = brightness;
            filterValue.innerText = `${brightness}%`;
        } else if (option.id === "saturation") {
            filterSlider.max = "200";
            filterSlider.value = saturation;
            filterValue.innerText = `${saturation}%`;
        } else if (option.id === "inversion") {
            filterSlider.max = "100";
            filterSlider.value = inversion;
            filterValue.innerText = `${inversion}%`;
        } else {
            filterSlider.max = "100";
            filterSlider.value = grayscale;
            filterValue.innerText = `${grayscale}%`;
        }
    });
});

// Función para actualizar el valor del filtro
const updateFilter = () => {

    // Actualiza el valor del filtro en la sección de información de filtro
    filterValue.innerText = `${filterSlider.value}%`;
    const selectedFilter = document.querySelector(".filter .active");

    // Actualiza el valor del filtro seleccionado
    if (selectedFilter.id === "brightness") {
        brightness = filterSlider.value;
    } else if (selectedFilter.id === "saturation") {
        saturation = filterSlider.value;
    } else if (selectedFilter.id === "inversion") {
        inversion = filterSlider.value;
    } else {
        grayscale = filterSlider.value;
    }

    // Aplica los filtros a la vista previa
    applyFilters();
}

// Agrega un event listener al control deslizante del filtro que se activa cuando se cambia el valor del control
filterSlider.addEventListener("input", updateFilter);

// Itera sobre las opciones de rotación y espejo
rotateOptions.forEach(option => {
    option.addEventListener("click", () => {

       if (option.id === "left") {
        rotate -= 90;
       } else if (option.id === "right") {
        rotate += 90;
       } else if (option.id === "horizontal") {
        flipHorizontal = flipHorizontal === 1? -1 : 1;
       }else{
        flipVertical = flipVertical === 1? -1 : 1;
       }

       applyFilters();
    });
});

// Función para restablecer los filtros a los valores iniciales
const resetFilter = () => {

     brightness = 100;
     saturation = 100;
     inversion = 0;
     grayscale = 0;
     rotate = 0;
     flipHorizontal = 1;
     flipVertical = 1;
     // Hace clic en la primera opción de filtro para restablecer el estado de las opciones de filtro
     filterOptions[0].click();
     // Aplica los filtros a la vista previa
     applyFilters();
}

// Agrega un event listener al botón "resetFilterBtn" que se activa cuando se hace clic en el botón
resetFilterBtn.addEventListener("click", resetFilter);

// Función para guardar la imagen editada
const saveImage = () => {

    // Se crea un elemento <canvas> en la memoria
    const canvas = document.createElement("canvas");

    // Se obtiene el contexto 2D del canvas, que se utiliza para dibujar y manipular la imagen
    const ctx = canvas.getContext("2d");

    // Se establecen las dimensiones del canvas para que coincidan con las dimensiones naturales de la imagen de vista previa
    canvas.width = previewImg.naturalWidth;
    canvas.height = previewImg.naturalHeight;

    // Se aplican filtros de imagen (brillo, saturación, inversión, escala de grises) al contexto 2D
    ctx.filter = `brightness(${brightness}%) saturate(${saturation}%) invert(${inversion}%) grayscale(${grayscale}%)`;

    // Se aplica una escala horizontal y vertical a la imagen
    ctx.scale(flipHorizontal, flipVertical);

    // Se traslada el contexto para que el centro de la imagen esté en el centro del canvas
    ctx.translate(canvas.width / 2, canvas.height / 2);

    // Si hay una rotación, se aplica la rotación al contexto en radianes
    if (rotate !== 0) {
        ctx.rotate(rotate * Math.PI / 180);
    }

    // Se dibuja la imagen de vista previa en el canvas con todas las transformaciones y filtros aplicados
    ctx.drawImage(previewImg, -canvas.width / 2, -canvas.height / 2, canvas.width, canvas.height);

    // Se crea un elemento de anclaje <a> para la descarga del archivo
    const link = document.createElement("a");

    // Se establece el atributo 'download' del elemento de anclaje para definir el nombre del archivo descargable
    link.download = "image.jpg";

    // Se establece el atributo 'href' del elemento de anclaje para contener la representación de la imagen en el canvas como una URL de datos (data URL)
    link.href = canvas.toDataURL();

    // Se dispara el evento de clic en el elemento de anclaje, lo que provoca la descarga de la imagen editada con el nombre especificado
    link.click();
};


// Agrega un event listener al botón "saveImgBtn" que se activa cuando se hace clic en el botón
saveImgBtn.addEventListener("click", saveImage);

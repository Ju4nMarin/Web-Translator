/*  Traductor de Idiomas "TraduceMAX"
Juan Guillermo Marín Córdoba
Curso: Diseño de Interfaces - Noveno semestre
Universidad Cooperativa de Colombia
Ingeniería de Sistemas
Montería
2024  */



const inputLanguageDropdown = document.querySelector("#input-language");
const outputLanguageDropdown = document.querySelector("#output-language");
const inputTextElem = document.querySelector("#input-text");
const outputTextElem = document.querySelector("#output-text");
const favoriteBtn = document.querySelector("#favorite-btn");
const copyBtn = document.querySelector("#copy-btn");
const downloadBtn = document.querySelector("#download-btn");
const favoritesList = document.querySelector("#favorites-list");
const historyList = document.querySelector("#history-list");
const clearHistoryBtn = document.getElementById('clear-history');
const clearFavoritesBtn = document.getElementById('clear-favorites');
const swapBtn = document.querySelector(".swap-position");
const settingsDropdown = document.getElementById('settings-dropdown');
const darkModeToggle = document.getElementById('toggle-dark-mode');
const uploadDocument = document.getElementById('upload-document');
// Variables para almacenar favoritos e historial
let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
let history = JSON.parse(localStorage.getItem('history')) || [];



/// Elementos del DOM
const fontSizeDisplay = document.getElementById('font-size-display');
const fontSizeDecreaseBtn = document.getElementById('font-size-decrease');
const fontSizeIncreaseBtn = document.getElementById('font-size-increase');

const fontSizes = ['S', 'M', 'X', 'XL'];
const fontSizeValues = {
  'S': '12px',
  'M': '16px',
  'X': '20px',
  'XL': '24px'
};

function getCurrentFontSize() {
  return fontSizeDisplay.textContent;
}

function setCurrentFontSize(size) {
  fontSizeDisplay.textContent = size;
  document.documentElement.style.setProperty('--font-size', fontSizeValues[size]);
  localStorage.setItem('fontSize', size);
}


// Comprobar y aplicar el tamaño de fuente guardado al cargar la página
document.addEventListener('DOMContentLoaded', () => {
  const savedFontSize = localStorage.getItem('fontSize') || 'M';
  setCurrentFontSize(savedFontSize);
});

fontSizeDecreaseBtn.addEventListener('click', (event) => {
  event.stopPropagation();  // Evita que se cierre el menú
  let currentIndex = fontSizes.indexOf(getCurrentFontSize());
  if (currentIndex > 0) {
    setCurrentFontSize(fontSizes[currentIndex - 1]);
  }
});

fontSizeIncreaseBtn.addEventListener('click', (event) => {
  event.stopPropagation();  // Evita que se cierre el menú
  let currentIndex = fontSizes.indexOf(getCurrentFontSize());
  if (currentIndex < fontSizes.length - 1) {
    setCurrentFontSize(fontSizes[currentIndex + 1]);
  }
});



document.addEventListener('DOMContentLoaded', () => {
  if (localStorage.getItem('darkMode') === 'enabled') {
    document.body.classList.add('dark');
    document.getElementById('dark-mode-status').textContent = 'ON';
  }
});

const darkModeSwitch = document.getElementById('dark-mode-switch');


const darkModeToggleElement = document.getElementById('toggle-dark-mode')


const modeTextElement = darkModeToggleElement.querySelector('p');


darkModeSwitch.addEventListener('change', () => {

  document.body.classList.toggle('dark');

  if (darkModeSwitch.checked) {

    modeTextElement.textContent = 'Oscuro';

    localStorage.setItem('darkMode', 'enabled');
  } else {

    modeTextElement.textContent = 'Claro';

    localStorage.setItem('darkMode', 'disabled');
  }
});


// Comprobar el estado guardado del modo oscuro al cargar la página
document.addEventListener('DOMContentLoaded', () => {
  if (localStorage.getItem('darkMode') === 'enabled') {
    document.body.classList.add('dark');
    darkModeSwitch.checked = true;
  } else {
    darkModeSwitch.checked = false;
  }
});



function populateDropdown(dropdown, options, includeAuto = false, defaultCode = null) {
  const ulElement = dropdown.querySelector("ul");
  if (!ulElement) {
      console.error("The dropdown does not contain a <ul> element.");
      return;
  }
  
  ulElement.innerHTML = "";
  options.forEach((option) => {
      // Evitar agregar 'Auto' dos veces
      if (option.code === "auto" && !includeAuto) return;

      const li = document.createElement("li");
      const title = option.name + " (" + option.native + ")";
      li.innerHTML = title;
      li.dataset.value = option.code;
      li.classList.add("option");
      if (option.code === defaultCode) {
          li.classList.add("active");
          dropdown.querySelector(".selected").innerHTML = title;
          dropdown.querySelector(".selected").dataset.value = option.code;
      }
      ulElement.appendChild(li);
  });
}

// Poblar dropdowns con los idiomas
populateDropdown(inputLanguageDropdown, languages, false, "es"); // Incluir 'Auto (Detect)' y seleccionarlo por defecto
populateDropdown(outputLanguageDropdown, languages.filter(lang => lang.code !== "auto"), false, "en"); // No incluir 'Auto (Detect)' y seleccionar Inglés por defecto




// Manejo de eventos para los dropdowns
const dropdowns = document.querySelectorAll(".dropdown-container");
dropdowns.forEach((dropdown) => {
  dropdown.addEventListener("click", (e) => {
      dropdown.classList.toggle("active");
  });

  dropdown.querySelectorAll(".option").forEach((item) => {
      item.addEventListener("click", (e) => {
          // Eliminar clase activa de todos los elementos de la lista
          if (dropdown === outputLanguageDropdown && item.dataset.value === "auto") {
            return;
          }
          dropdown.querySelectorAll(".option").forEach((item) => {
              item.classList.remove("active");
          });
          item.classList.add("active");

          const selected = dropdown.querySelector(".selected");
          selected.innerHTML = item.innerHTML;
          selected.dataset.value = item.dataset.value;

          // If output language is set to 'auto', change to English
          if (dropdown === outputLanguageDropdown && selected.dataset.value === "auto") {
              selected.innerHTML = "Inglés (English)";
              selected.dataset.value = "en";
              dropdown.querySelector(`[data-value="en"]`).classList.add("active");
          }

          translate();
      });
  });
});





// Evento para cerrar dropdowns al hacer clic fuera
document.addEventListener("click", (e) => {
  dropdowns.forEach((dropdown) => {
    if (!dropdown.contains(e.target)) {
      dropdown.classList.remove("active");
    }
  });
});

// Intercambio de idiomas
swapBtn.addEventListener("click", (e) => {
  const tempText = inputTextElem.value;
  inputTextElem.value = outputTextElem.value;
  outputTextElem.value = tempText;

  const inputSelected = inputLanguageDropdown.querySelector(".selected");
  const outputSelected = outputLanguageDropdown.querySelector(".selected");
  const var1 = inputSelected.dataset.value;
  console.log(var1); // Verifica que el evento se dispara
  const tempInnerHTML = inputSelected.innerHTML;
  const tempDataValue = inputSelected.dataset.value;

  inputSelected.innerHTML = outputSelected.innerHTML;
  inputSelected.dataset.value = outputSelected.dataset.value;

  outputSelected.innerHTML = tempInnerHTML;
  outputSelected.dataset.value = tempDataValue;
  

  // Eliminar clase activa de todos los elementos de la lista
  inputLanguageDropdown.querySelectorAll(".option").forEach(item => item.classList.remove("active"));
  outputLanguageDropdown.querySelectorAll(".option").forEach(item => item.classList.remove("active"));

  // Asignar clase activa a los elementos correspondientes
  inputLanguageDropdown.querySelector(`[data-value="${inputSelected.dataset.value}"]`).classList.add("active");
  outputLanguageDropdown.querySelector(`[data-value="${outputSelected.dataset.value}"]`).classList.add("active");


  translate();
});






// Función de traducción
function translate() {
  const inputText = inputTextElem.value;
  const inputLanguage = inputLanguageDropdown.querySelector(".selected").dataset.value;
  const outputLanguage = outputLanguageDropdown.querySelector(".selected").dataset.value;
  const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${inputLanguage}&tl=${outputLanguage}&dt=t&q=${encodeURI(inputText)}`;

  fetch(url)
    .then(response => response.json())
    .then(json => {
      outputTextElem.value = json[0].map(item => item[0]).join("");
      addToHistory(inputText, outputTextElem.value, inputLanguage, outputLanguage);
    })
    .catch(error => {
      console.error(error);
    });
}

let debounceTimeout;
inputTextElem.addEventListener("input", () => {
    clearTimeout(debounceTimeout);
    debounceTimeout = setTimeout(() => {
        if (inputTextElem.value.length > 5000) {
            inputTextElem.value = inputTextElem.value.slice(0, 5000);
        }
        if (inputTextElem.value.trim() === "") {
            outputTextElem.value = ""; // Clear output when input is cleared
        } else {
            translate();
        }
    }, 300); // Espera 300ms después de la última entrada
});








// Función para agregar a favoritos
function addToFavorites() {
  const inputText = inputTextElem.value;
  const outputText = outputTextElem.value;
  const inputLanguage = inputLanguageDropdown.querySelector(".selected").dataset.value;
  const outputLanguage = outputLanguageDropdown.querySelector(".selected").dataset.value;

  const favorite = { inputText, outputText, inputLanguage, outputLanguage };
  favorites.push(favorite);
  localStorage.setItem('favorites', JSON.stringify(favorites));

  renderFavorites();
}

// Función para agregar al historial
function addToHistory(inputText, outputText, inputLanguage, outputLanguage) {
  const translation = { inputText, outputText, inputLanguage, outputLanguage, timestamp: new Date() };
  history.unshift(translation);
  if (history.length > 10) history.pop();
  localStorage.setItem('history', JSON.stringify(history));
  renderHistory();
}

function renderFavorites() {
  favoritesList.innerHTML = "";
  if (favorites.length === 0) {
    favoritesList.innerHTML = "<li>No hay favoritos guardados.</li>";
    return;
  }
  favorites.forEach((fav, index) => {
    const li = document.createElement("li");
    li.innerHTML = `
    <style>
      .favorite-item {
        display: grid;
        grid-template-columns: 1fr auto;
        gap: 10px;
        align-items: center;
        padding: 10px;
        background-color: var(--light-bg-color);

      }

      .favorite-item .details {
        /* La primera columna toma todo el espacio disponible */
      }

      .favorite-item .btn2 {
        background-color: var(--bg-color);
        color: var(--text-color);
        padding: 10px 20px;
        border-radius: 30px;
        border: none;
        cursor: pointer;

      }

      .favorite-item .btn2:hover {
        color: var(--primary-text-color);
        background-color: var(--primary-color);
      }
    </style>
    <div class="favorite-item">
      <div class="details">
        <strong>${fav.inputText}</strong>
        <br>
        <small>(${fav.inputLanguage}) ➔ (${fav.outputLanguage})</small>
        <br>
        <em>${fav.outputText}</em>
      </div>
      <button class="btn2" onclick="removeFavorite(${index})">Eliminar</button>
    </div>
  `;
    favoritesList.appendChild(li);
  });
}

// Función para renderizar historial con mensaje cuando esté vacío
function renderHistory() {
  historyList.innerHTML = "";
  if (history.length === 0) {
    historyList.innerHTML = "<li>No hay historial disponible.</li>";
    return;
  }
  history.forEach((hist, index) => {
    const li = document.createElement("li");
    li.innerHTML = `
      <strong>${hist.inputText}</strong>
      <br>
      <small>(${hist.inputLanguage}) ➔ (${hist.outputLanguage})</small>
      <br>
      <em>${hist.outputText}</em>
      <small>(${new Date(hist.timestamp).toLocaleString()})</small>
    `;
    historyList.appendChild(li);
  });
}




// Función para eliminar un favorito
function removeFavorite(index) {
  favorites.splice(index, 1);
  localStorage.setItem('favorites', JSON.stringify(favorites));
  renderFavorites();
}

// Evento para agregar a favoritos
favoriteBtn.addEventListener("click", addToFavorites);

// Evento para copiar al portapapeles
copyBtn.addEventListener("click", () => {
  const outputText = outputTextElem.value;
  if (outputText) {
    navigator.clipboard.writeText(outputText).then(() => {
      Swal.fire({
        position: "top",
        icon: "success",
        width: 400,
        title: "Elemento copiado",
        showConfirmButton: false,
        timer: 1000,
        backdrop: false
        
      });

    }).catch(err => {
      console.error("Error al copiar el texto: ", err);
    });
  }
});

// Evento para descargar el texto traducido
downloadBtn.addEventListener("click", () => {
  const outputText = outputTextElem.value;
  const outputLanguage = outputLanguageDropdown.querySelector(".selected").dataset.value;
  if (outputText) {
    const blob = new Blob([outputText], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.download = `translated-to-${outputLanguage}.txt`;
    a.href = url;
    a.click();
  }
});

// Evento para limpiar historial con confirmación
clearHistoryBtn.addEventListener('click', () => {
  Swal.fire({
    title: '¿Estás seguro?',
    text: "¡No podrás revertir esto!",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Sí, limpiar historial'
  }).then((result) => {
    if (result.isConfirmed) {
      history = [];
      localStorage.setItem('history', JSON.stringify(history));
      renderHistory();
      Swal.fire(
        '¡Limpiado!',
        'Tu historial ha sido limpiado.',
        'success'
      );
    }
  });
});

// Evento para limpiar favoritos con confirmación
clearFavoritesBtn.addEventListener('click', () => {
  Swal.fire({
    title: '¿Estás seguro?',
    text: "¡No podrás revertir esto!",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Sí, limpiar favoritos'
  }).then((result) => {
    if (result.isConfirmed) {
      favorites = [];
      localStorage.setItem('favorites', JSON.stringify(favorites));
      renderFavorites();
      Swal.fire(
        '¡Limpiado!',
        'Tus favoritos han sido limpiados.',
        'success'
      );
    }
  });
});

const pasteBtn = document.getElementById('paste-btn');


const inputCharsElem = document.getElementById('input-chars');

// Actualizar el contador de caracteres
function updateCharCount() {
  const charCount = inputTextElem.value.length;
  inputCharsElem.textContent = charCount;
}

// Manejar el evento de input en el textarea
inputTextElem.addEventListener('input', updateCharCount);

// Evento para manejar la carga de archivos
uploadDocument.addEventListener('change', (event) => {
  const file = event.target.files[0];
  if (file) {
      const reader = new FileReader();
      reader.onload = function(e) {
          inputTextElem.value = e.target.result;
          translate();
      };
      reader.readAsText(file);
  }
  event.target.value = ""; // Reset the file input
});


pasteBtn.addEventListener('click', async () => {
  try {
    const text = await navigator.clipboard.readText();
    inputTextElem.value = text;
    // Opcional: traducir automáticamente después de pegar
    
    
    updateCharCount();
    translate(); 
  } catch (err) {
    console.error('Failed to read clipboard contents: ', err);
  }
});

// Evento para mostrar y ocultar el dropdown de configuración
settingsDropdown.addEventListener('click', (e) => {
  settingsDropdown.classList.toggle('active');
  e.stopPropagation();  // Para evitar que se cierre inmediatamente al hacer clic
});

// Evento para cerrar el dropdown de configuración al hacer clic fuera
document.addEventListener("click", (e) => {
  if (!settingsDropdown.contains(e.target)) {
    settingsDropdown.classList.remove('active');
  }
});











// Renderizar favoritos e historial al cargar la página
document.addEventListener("DOMContentLoaded", () => {
  renderFavorites();
  renderHistory();
});


// Seleccionar el canvas y obtener el contexto
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Variables del juego
let pelota = {
    x: Math.random() * canvas.width,
    y: canvas.height - 50,
    dx: (Math.random() - 0.5) * 5,
    dy: -Math.random() * 5 - 5,
    width: 100,
    height: 100,
    esquinaCount: 0,
    esquinaRegistrada: false,
};

let portero = {
    x: canvas.width / 2 - 75,
    y: canvas.height - 500,
    width: 500,
    height: 500,
};

let puntuacion = 0;
let puntuacionMaxima = localStorage.getItem('puntuacionMaxima') || 0;

// Mostrar la puntuación actual
document.getElementById('puntuacion').textContent = puntuacion;

// Configurar el cursor estático con JavaScript
canvas.style.cursor = "url('images/cursor.cur'), auto"; // Cambia 'cursor.cur' por tu imagen de puntero

// Cargar la imagen de fondo
const fondoImg = new Image();
fondoImg.src = 'images/fondo2.jpg'; // Cambia por la ruta de tu imagen de fondo

// Cargar la imagen del balón
const balonImg = new Image();
balonImg.src = 'images/ball.png';

// Cargar la imagen del portero
const porteroImg = new Image();
porteroImg.src = 'images/portero.png';

// Dibujar el fondo
function dibujarFondo() {
    ctx.drawImage(fondoImg, 0, 0, canvas.width, canvas.height);
}

// Dibujar el balón
function dibujarPelota() {
    ctx.drawImage(balonImg, pelota.x, pelota.y, pelota.width, pelota.height);
}

// Dibujar al portero
function dibujarPortero() {
    ctx.drawImage(porteroImg, portero.x, portero.y, portero.width, portero.height);
}

// Mover el balón
function moverPelota() {
    // Actualizar posición del balón
    pelota.x += pelota.dx;
    pelota.y += pelota.dy;

    // Cambiar dirección aleatoriamente durante el movimiento
    if (Math.random() < 0.02) { // 2% de probabilidad en cada frame
        pelota.dx = (Math.random() - 0.5) * 10; // Nuevo movimiento horizontal aleatorio
        pelota.dy = (Math.random() - 0.5) * 10; // Nuevo movimiento vertical aleatorio
    }

    // Verificar colisiones con esquinas y parte superior
    if (
        (pelota.x <= 0 && pelota.y <= 0) ||
        (pelota.x + pelota.width >= canvas.width && pelota.y <= 0) ||
        (pelota.y <= 0)
    ) {
        if (!pelota.esquinaRegistrada) {
            pelota.esquinaCount++;
            pelota.esquinaRegistrada = true;
        }
    } else {
        pelota.esquinaRegistrada = false;
    }

    // Condición de pérdida
    if (pelota.esquinaCount >= 5) {
        guardarPuntuacionMaxima();
        alert("¡Perdiste! El balón chocó");
        document.location.reload();
    }

    // Rebote en los bordes con cambio aleatorio
    if (pelota.x <= 0) {
        pelota.x = 0;
        pelota.dx = (Math.random() - 0.5) * 10; // Dirección aleatoria al rebotar
    }

    if (pelota.x + pelota.width >= canvas.width) {
        pelota.x = canvas.width - pelota.width;
        pelota.dx = (Math.random() - 0.5) * 10; // Dirección aleatoria al rebotar
    }

    if (pelota.y <= 0) {
        pelota.y = 0;
        pelota.dy = (Math.random() - 0.5) * 10; // Dirección aleatoria al rebotar
    }

    if (pelota.y + pelota.height >= canvas.height) {
        pelota.y = canvas.height - pelota.height;
        pelota.dy = (Math.random() - 0.5) * 10; // Dirección aleatoria al rebotar
    }

    // Aumentar la velocidad cada 5 puntos
    if (puntuacion > 0 && puntuacion % 3 === 0) {
        pelota.dx *= 1.1; // Incrementar velocidad horizontal
        pelota.dy *= 1.1; // Incrementar velocidad vertical

        // Limitar la velocidad máxima (opcional)
        const velocidadMaxima = 15;
        if (Math.abs(pelota.dx) > velocidadMaxima) {
            pelota.dx = pelota.dx > 0 ? velocidadMaxima : -velocidadMaxima;
        }
        if (Math.abs(pelota.dy) > velocidadMaxima) {
            pelota.dy = pelota.dy > 0 ? velocidadMaxima : -velocidadMaxima;
        }
    }
}

// Detectar clic en el balón para sumar puntos
canvas.addEventListener('click', (e) => {
    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    if (
        mouseX >= pelota.x &&
        mouseX <= pelota.x + pelota.width &&
        mouseY >= pelota.y &&
        mouseY <= pelota.y + pelota.height &&
        pelota.esquinaCount < 5
    ) {
        puntuacion++;
        document.getElementById('puntuacion').textContent = puntuacion;

        pelota.x = Math.random() * (canvas.width - pelota.width);
        pelota.y = Math.random() * (canvas.height - pelota.height);
    }
});

// Guardar la puntuación más alta en localStorage
function guardarPuntuacionMaxima() {
    if (puntuacion > puntuacionMaxima) {
        puntuacionMaxima = puntuacion;
        localStorage.setItem('puntuacionMaxima', puntuacionMaxima);
    }
}

// Mostrar la puntuación máxima al inicio
function mostrarPuntuacionMaxima() {
    const maxScoreElement = document.createElement('h3');
    maxScoreElement.textContent = `Puntuación Máxima: ${puntuacionMaxima}`;
    document.getElementById('score').appendChild(maxScoreElement);
}
mostrarPuntuacionMaxima();

// Controlar al portero con el mouse
canvas.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;

    portero.x = mouseX - portero.width / 2;

    const porteriaInicio = 0;
    const porteriaFin = canvas.width - portero.width;
    if (portero.x < porteriaInicio) portero.x = porteriaInicio;
    if (portero.x + portero.width > porteriaFin) portero.x = porteriaFin;
});

// Bucle principal del juego
function juegoPrincipal() {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Limpiar el lienzo
    dibujarFondo(); // Dibujar el fondo primero
    dibujarPelota(); // Dibujar el balón
    dibujarPortero(); // Dibujar el portero
    moverPelota(); // Mover el balón
    requestAnimationFrame(juegoPrincipal);
}

// Iniciar el juego
juegoPrincipal();
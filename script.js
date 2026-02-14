/* script.js completo: contadores, corazones, album, visor, audio, boda y volver */

/* ---------- FECHAS ---------- */
const FECHA_ENAMORADOS = new Date("October 29, 2023 00:00:00").getTime();
const FECHA_ESPOSOS = null;

/* ---------- CONTADOR DETALLADO ---------- */
function diferenciaCompleta(startDate, endDate) {

  let y1 = startDate.getFullYear(), m1 = startDate.getMonth(), d1 = startDate.getDate();
  let h1 = startDate.getHours(), min1 = startDate.getMinutes(), s1 = startDate.getSeconds();

  let y2 = endDate.getFullYear(), m2 = endDate.getMonth(), d2 = endDate.getDate();
  let h2 = endDate.getHours(), min2 = endDate.getMinutes(), s2 = endDate.getSeconds();

  let years = y2 - y1;
  let months = m2 - m1;
  let days = d2 - d1;
  let hours = h2 - h1;
  let minutes = min2 - min1;
  let seconds = s2 - s1;

  if (seconds < 0) { seconds += 60; minutes -= 1; }
  if (minutes < 0) { minutes += 60; hours -= 1; }
  if (hours < 0) { hours += 24; days -= 1; }

  if (days < 0) {
    const prevMonth = new Date(y2, m2, 0);
    days += prevMonth.getDate();
    months -= 1;
  }

  if (months < 0) { months += 12; years -= 1; }

  return { years, months, days, hours, minutes, seconds };
}

function actualizarContadores() {

  const ahora = new Date();
  const inicio = new Date(FECHA_ENAMORADOS);
  const diff = diferenciaCompleta(inicio, ahora);

  const elEnam = document.getElementById("contador-enamorados");
  if (elEnam)
    elEnam.textContent =
      `${diff.years} años, ${diff.months} meses, ${diff.days} días, ${diff.hours}h ${diff.minutes}m ${diff.seconds}s`;

  const elEsp = document.getElementById("contador-esposos");
  if (!FECHA_ESPOSOS) {
    if (elEsp) elEsp.textContent = "Por definir";
  }
}

setInterval(actualizarContadores, 1000);
actualizarContadores();

/* ---------- CORAZONES FLOTANDO ---------- */
const contCor = document.getElementById("corazones-container");

function crearCorazon() {

  if (!contCor) return;

  const c = document.createElement("div");
  c.className = "corazon";
  c.textContent = Math.random() > 0.5 ? "💜" : "💛";
  c.style.left = (Math.random() * 100) + "%";
  c.style.fontSize = (12 + Math.random() * 30) + "px";
  c.style.animationDuration = (4 + Math.random() * 6) + "s";
  c.style.opacity = (0.5 + Math.random() * 0.5);

  contCor.appendChild(c);

  setTimeout(() => {
    if (c.parentNode) c.parentNode.removeChild(c);
  }, 11000);
}

setInterval(crearCorazon, 420);

/* ---------- AUDIO ---------- */
let pistaActiva = null;
let tipoPista = null;
let bodaAudio = null;

function detenerPistaActual() {

  if (pistaActiva) {
    pistaActiva.pause();
    pistaActiva.currentTime = 0;
    pistaActiva = null;
    tipoPista = null;
  }
}

/* ---------- ELEMENTOS ---------- */
const btnBoda = document.getElementById("btn-boda");
const verFotos = document.getElementById("verFotos");
const portada = document.getElementById("portada");
const album = document.getElementById("album");
const albumBoda = document.getElementById("album-boda");

const volverNormal = document.getElementById("volver-normal");
const volverBoda = document.getElementById("volver-boda");

const suponer = document.getElementById("suponer");
const suponerImg = document.getElementById("suponer-img");
const suponerDesc = document.getElementById("suponer-desc");
const btnCerrar = document.getElementById("btn-cerrar");

/* ---------- BOTÓN BODA ---------- */
if (btnBoda) {

  btnBoda.addEventListener("click", () => {

    if (!bodaAudio) {
      bodaAudio = new Audio(encodeURI("musica/boda.mp3"));
      bodaAudio.loop = true;
    }

    detenerPistaActual();

    pistaActiva = bodaAudio;
    tipoPista = "boda";
    bodaAudio.play().catch(() => {});

    if (portada) portada.classList.add("oculto");
    if (album) album.classList.add("oculto");
    if (albumBoda) albumBoda.classList.remove("oculto");
  });
}

/* ---------- BOTÓN VER FOTOS NORMAL ---------- */
if (verFotos) {

  verFotos.addEventListener("click", () => {

    if (portada) portada.classList.add("oculto");
    if (albumBoda) albumBoda.classList.add("oculto");
    if (album) album.classList.remove("oculto");
  });
}

/* ---------- BOTONES VOLVER ---------- */
function volverMenu() {

  if (album) album.classList.add("oculto");
  if (albumBoda) albumBoda.classList.add("oculto");
  if (portada) portada.classList.remove("oculto");

  detenerPistaActual();
}

if (volverNormal) volverNormal.addEventListener("click", volverMenu);
if (volverBoda) volverBoda.addEventListener("click", volverMenu);

/* ---------- VISOR ---------- */
document.querySelectorAll(".grid .item").forEach(item => {

  item.addEventListener("click", () => {

    const imgEl = item.querySelector("img");
    if (!imgEl) return;

    suponerImg.src = imgEl.src;
    suponerDesc.textContent = item.dataset.descripcion || "";

    suponer.classList.add("activo");

    if (item.dataset.audio) {

      detenerPistaActual();

      const audio = new Audio(encodeURI("musica/" + item.dataset.audio));
      pistaActiva = audio;
      tipoPista = "foto";
      audio.play().catch(() => {});
    }
  });
});

function cerrarVisor() {

  suponer.classList.remove("activo");

  if (tipoPista === "foto") detenerPistaActual();
}

if (btnCerrar) btnCerrar.addEventListener("click", cerrarVisor);

if (suponer) {
  suponer.addEventListener("click", e => {
    if (e.target === suponer) cerrarVisor();
  });
}

window.addEventListener("keydown", e => {
  if (e.key === "Escape") cerrarVisor();
});

/* ---------- LOADER ---------- */
window.addEventListener("load", () => {

  setTimeout(() => {

    const loader = document.getElementById("loader");
    if (loader) loader.style.display = "none";

  }, 3000);
});

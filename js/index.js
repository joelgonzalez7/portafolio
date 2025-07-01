const sliderWrapper = document.getElementById("sliderWrapper");
const menuButtons = document.querySelectorAll(".menu button");

function goToSlide(index) {
    sliderWrapper.style.transform = `translateX(-${index * 100}vw)`;
    menuButtons.forEach(btn => btn.classList.remove("active"));
    menuButtons[index].classList.add("active");
}

// AUDIO
const canvas = document.getElementById('stringCircleCanvas');
const ctx = canvas.getContext('2d');
let width = canvas.width = canvas.offsetWidth;
let height = canvas.height = canvas.offsetHeight;
let wave = 0;
let amplitude = 0;
let isMusicPlaying = false;

const audio = document.getElementById('sampleAudio');
const playPauseBtn = document.getElementById('playPauseBtn');
const progressBar = document.getElementById('progressBar');
const volumeControl = document.getElementById('volumeControl');
const songTitle = document.getElementById('songTitle');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');

const playlist = [
    { title: "Crush on You 💌", src: "./assets/CrushOnYou.mp3" }, 
    { title: "Hojas De Otoño 🍂 ", src: "./assets/HojasDeOtoño.mp3" },
    { title: "Walking With You 🌌🚶‍♂️🌠", src: "./assets/walking.mp3" },
    { title: "Best Friends 👯‍♀️", src: "./assets/best.mp3" }

];

let currentTrack = 0;

function loadTrack(index) {
    const track = playlist[index];
    audio.src = track.src;
    songTitle.textContent = track.title;
    audio.load();
    audio.play().then(() => {
        isMusicPlaying = true;
        playPauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
    }).catch(err => {
        isMusicPlaying = false;
        playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
    });
}

playPauseBtn.addEventListener('click', () => {
    if (audio.paused) {
        audio.play().then(() => {
            playPauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
            isMusicPlaying = true;
        });
    } else {
        audio.pause();
        playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
        isMusicPlaying = false;
    }
});

prevBtn.addEventListener('click', () => {
    currentTrack = (currentTrack - 1 + playlist.length) % playlist.length;
    loadTrack(currentTrack);
});

nextBtn.addEventListener('click', () => {
    currentTrack = (currentTrack + 1) % playlist.length;
    loadTrack(currentTrack);
});

audio.addEventListener('ended', () => {
    currentTrack = (currentTrack + 1) % playlist.length;
    loadTrack(currentTrack);
});

audio.addEventListener('timeupdate', () => {
    const percentage = (audio.currentTime / audio.duration) * 100;
    progressBar.value = percentage || 0;
});

progressBar.addEventListener('input', () => {
    const seekTime = (progressBar.value / 100) * audio.duration;
    audio.currentTime = seekTime;
});

volumeControl.addEventListener('input', () => {
    audio.volume = volumeControl.value / 100;
});

window.addEventListener('resize', () => {
    width = canvas.width = canvas.offsetWidth;
    height = canvas.height = canvas.offsetHeight;
});

function drawString() {
    ctx.clearRect(0, 0, width, height);
    ctx.beginPath();
    ctx.moveTo(0, height / 2);
    for (let x = 0; x < width; x++) {
        const y = height / 2 + Math.sin(x * 0.1 + wave) * amplitude;
        ctx.lineTo(x, y);
    }
    ctx.strokeStyle = '#00eaff';
    ctx.lineWidth = 2;
    ctx.stroke();
    wave += 0.2;
    amplitude = isMusicPlaying ? 8 + Math.sin(wave) * 2 : 0;
    requestAnimationFrame(drawString);
}

loadTrack(currentTrack);
drawString();
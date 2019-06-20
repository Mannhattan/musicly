import style from "./main.scss";

import script from './fontawesome';

import song from './songs/paradise.mp3';

window.onload = function() {
    var audio = document.getElementById("player__audio");

    document.getElementsByClassName("control-play")[0].addEventListener("click", (e) => {
        e.preventDefault();

        if(audio.paused) {
            audio.play();
            document.getElementsByClassName("control-play")[0].innerHTML = "<i class='fas fa-pause'></i>";
        } else {
            audio.pause();
            document.getElementsByClassName("control-play")[0].innerHTML = "<i class='fas fa-play'></i>";
        }
    }); 

    loadSong();
};

const loadSong = (songName) => {
    var audio = document.getElementById("player__audio");

    audio.src = song;
    audio.load();
    // audio.play();
    var context = new AudioContext();
    var src = context.createMediaElementSource(audio);
    var analyser = context.createAnalyser();

    var canvas = document.getElementById("control__visualizer");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    var ctx = canvas.getContext("2d");

    src.connect(analyser);
    analyser.connect(context.destination);

    analyser.fftSize = 2048;

    var bufferLength = analyser.frequencyBinCount;
    // console.log(bufferLength);

    var dataArray = new Uint8Array(bufferLength);

    var WIDTH = canvas.width;
    var HEIGHT = canvas.height;

    var barWidth = (WIDTH / bufferLength) * 2.5;
    var barHeight;
    var x = 0;

    function renderFrame() {
        requestAnimationFrame(renderFrame);

        x = 0;

        analyser.getByteFrequencyData(dataArray);

        // ctx.fillStyle = "#f83600";

        // var grd = ctx.createLinearGradient(0, 0, WIDTH, HEIGHT);
        // grd.addColorStop(1, "#fe8c00");
        // grd.addColorStop(0, "#f83600");

        // ctx.fillStyle = grd;
        ctx.fillStyle = "#fe8c00";
        ctx.fillRect(0, 0, WIDTH, HEIGHT);

        for (var i = 0; i < bufferLength; i++) {
            barHeight = dataArray[i]*4;
            
            // var r = barHeight + (25 * (i/bufferLength));
            // var g = 250 * (i/bufferLength);
            // var b = 50;

            const r=255;
            const g=255;
            const b=255;

            ctx.fillStyle = "rgb(" + r + "," + g + "," + b + ")";
            ctx.fillRect(x, HEIGHT - barHeight, barWidth, barHeight);

            // x += barWidth + 1;
            x += barWidth - 1;
        }

        updateTimeline(audio);
    }

    // audio.play();
    renderFrame();

    // renderFrame();
}

const updateTimeline = (audio) => {
    var currentMinutes = parseInt(audio.currentTime / 60, 10);
    var currentSeconds = parseInt(audio.currentTime % 60);

    var durationMinutes = parseInt(audio.duration / 60, 10);
    var durationSeconds = parseInt(audio.duration % 60);

    document.getElementsByClassName("control__timeline")[0].setAttribute("data-currentTime", currentMinutes+":"+currentSeconds);
    document.getElementsByClassName("control__timeline")[0].setAttribute("data-duration", durationMinutes+":"+durationSeconds);

    document.getElementsByClassName("timeline__progress")[0].style = `width: ${(audio.currentTime / audio.duration) * 100}%`;
    document.getElementsByClassName("timeline__dot")[0].style = `left: ${(audio.currentTime / audio.duration) * 99.7}%`;
}

//check for ES6
const arr = [1, 2, 3];
const iAmJavascriptES6 = () => console.log(...arr);
iAmJavascriptES6();
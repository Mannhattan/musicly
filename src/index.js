import style from "./main.scss";

import script from './fontawesome';

import song from './songs/Valence - Infinite [NCS Release].mp3';



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

    var canvas = document.getElementById("player__visualizer");
    canvas.width = window.innerWidth;
    canvas.height = 400;

    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = 400;
    }, false );

    loadSong(canvas, song);
};

const loadSong = (canvas, songName) => {
    var audio = document.getElementById("player__audio");

    audio.src = songName;
    audio.load();
    // audio.play();
    var context = new AudioContext();
    var src = context.createMediaElementSource(audio);
    var analyser = context.createAnalyser();

    var ctx = canvas.getContext("2d");

    src.connect(analyser);
    analyser.connect(context.destination);

    analyser.fftSize = 2048;
    analyser.smoothingTimeConstant = 0.92;

    var bufferLength = analyser.frequencyBinCount;
    // console.log(bufferLength);

    var dataArray = new Uint8Array(bufferLength);

    var WIDTH = canvas.width;
    var HEIGHT = canvas.height;

    var barWidth = (WIDTH / bufferLength) * 2.5;
    var barHeight;
    var x = 0;

    const renderFrame = () => {
        // console.log(audio.currentTime + "   " + audio.duration);
        requestAnimationFrame(renderFrame);

        x = 0;

        analyser.getByteFrequencyData(dataArray);

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        for (var i = 0; i < bufferLength; i++) {
            // barHeight = (dataArray[i] == 255 ? dataArray[i]*1.2 : dataArray[i]);
            barHeight = dataArray[i] /2 + 5;

            const r=224;
            const g=224;
            const b=224;

            if (audio.currentTime/audio.duration > x/window.innerWidth) {
                r=255;
                g=255;
                b=255;
            }
            
            // var r = barHeight + (25 * (i/bufferLength));
            // var g = 250 * (i/bufferLength);
            // var b = 50;

            

            ctx.fillStyle = "rgb(" + r + "," + g + "," + b + ")";
            ctx.fillRect(x, HEIGHT - barHeight, barWidth, barHeight);

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

    // document.getElementsByClassName("control__timeline")[0].setAttribute("data-currentTime", currentMinutes+":"+currentSeconds);
    // document.getElementsByClassName("control__timeline")[0].setAttribute("data-duration", durationMinutes+":"+durationSeconds);

    // document.getElementsByClassName("timeline__progress")[0].style = `width: ${(audio.currentTime / audio.duration) * 100}%`;
    // document.getElementsByClassName("timeline__dot")[0].style = `left: ${(audio.currentTime / audio.duration) * 99.7}%`;

    if(audio.currentTime == audio.duration) {
        document.getElementsByClassName("control-play")[0].innerHTML = "<i class='fas fa-play'></i>";
    }
}

//check for ES6
// const arr = [1, 2, 3];
// const iAmJavascriptES6 = () => console.log(...arr);
// iAmJavascriptES6();
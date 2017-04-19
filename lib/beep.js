function beep () {
    var audio_bytes = new Audio ('resources/sounds/d.wav');
    while (true) {
        setInterval(function(){audio_bytes.play()}, 300);
    }
}

self.onmessage = function(e) {
    beep();
}

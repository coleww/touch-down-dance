window.AudioContext = window.AudioContext || window.webkitAudioContext
var ac = new AudioContext()
var synth = require('./')(ac)
// just connect and start the synth to make sure it plays, edit as needed!
synth.connect(ac.destination)

var freqs = [550, 420, 640, 880, 730]
function pick () {
  return freqs[~~(Math.random() * freqs.length)]
}

setInterval(function () {
    synth.update({freq: pick()})
    synth.start(ac.currentTime)
}, 500)


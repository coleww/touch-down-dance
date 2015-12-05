var adsr = require('a-d-s-r')
var makeDistortionCurve = require('make-distortion-curve')
module.exports = function (ac, opts) {
  var audioNodes = {
    osc: ac.createOscillator(),
    gain: ac.createGain(),
    dist: ac.createWaveShaper(),
    filter: ac.createBiquadFilter(),
    settings: {
      freq: 250,
      endFreq: 0.000000000000000000001,
      attack: 0.000000000000000000001,
      decay: 0.000000000000000000001,
      sustain: 0.12,
      release: 0.13,
      peak: 0.5,
      mid: 0.35,
      end: 0.000000000000000000001
    }
  }

  audioNodes.osc.frequency.setValueAtTime(0.00000001, ac.currentTime)
  audioNodes.osc.start(ac.currentTime)

  audioNodes.gain.gain.setValueAtTime(0.00000001, ac.currentTime)

  audioNodes.dist.curve = makeDistortionCurve(25)

  audioNodes.filter.type = 'lowpass'
  audioNodes.filter.frequency.setValueAtTime(audioNodes.settings.freq * 3.5, ac.currentTime)

  audioNodes.osc.connect(audioNodes.gain)
  audioNodes.gain.connect(audioNodes.dist)
  audioNodes.dist.connect(audioNodes.filter)

  return {
    connect: function (input) {
      audioNodes.filter.connect(input)
    },
    start: function (when) {
      audioNodes.osc.frequency.setValueAtTime(audioNodes.settings.freq, when)
      audioNodes.osc.frequency.exponentialRampToValueAtTime(audioNodes.settings.endFreq, when + audioNodes.settings.attack + audioNodes.settings.decay + audioNodes.settings.sustain + audioNodes.settings.release)
      adsr(audioNodes.gain, when, audioNodes.settings)
    },
    stop: function (when) {
      audioNodes.source.stop(when)
    },
    update: function (opts) {
      Object.keys(opts).forEach(function (k) {
        audioNodes.settings[k] = opts[k]
      })
    },
    nodes: function () {
      return audioNodes
    }
  }
}
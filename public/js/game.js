let choosedFreq;

function updateMinimumFrequency(val) {
    document.getElementById("minFrequencyText").innerText = val + " Hz";

    val = Number(val);
    maxValue = Number(document.getElementById("maxFrequencySilder").value);

    if(val >= maxValue) {
        document.getElementById("maxFrequencySilder").value = val + 10;
        document.getElementById("maxFrequencyText").innerText = (val+10) + " Hz";
    }
}

function updateMaximumFrequency(val) {
    document.getElementById("maxFrequencyText").innerText = val + " Hz";

    val = Number(val);
    maxValue = Number(document.getElementById("minFrequencySilder").value);

    if(val <= maxValue) {
        document.getElementById("minFrequencySilder").value = val - 10;
        document.getElementById("minFrequencyText").innerText = (val-10) + " Hz";
    }
}

function updateToneDuration(val) {
    document.getElementById("toneDurationText").innerText = val + " ms";
}

function updateSelectedFrequency(val) {
    document.getElementById("selectedFrequencyText").innerText = val + " Hz";
}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function updateMaximumFrequencyBounds(allow) {
    if(allow) {
        document.getElementById("maxFrequencySilder").max = 22000;
        document.getElementById("minFrequencySilder").max = 22000;
    } else {
        document.getElementById("maxFrequencySilder").max = 8000;
        document.getElementById("minFrequencySilder").max = 8000;
    }
}

function playTone(freq, duration, volume, cb) {
    let context = new AudioContext()
    let ocsillator = context.createOscillator()
    let gain = context.createGain()

    ocsillator.connect(gain)
    gain.connect(context.destination);
    gain.gain.setValueAtTime(volume, context.currentTime);

    ocsillator.frequency.value = freq
    ocsillator.start(0)

    setTimeout(function () {
        gain.gain.exponentialRampToValueAtTime(
            0.00001, context.currentTime + 0.04
        )
        cb();
    }, duration);
}

function updateTitle(text) { document.getElementById("gameTitle").innerText = text; }

function map(x, in_min, in_max, out_min, out_max) {
    return (x - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
}

function startGame() {
    document.getElementById("gameSettingPage").style.display = "none";
    document.getElementById("gamePage").style.display = "block";
    document.getElementById("gameEndPage").style.display = "none";
    document.getElementById("guessButton").disabled = true;

    document.getElementById("selectedFrequencySilder").min   = Number(document.getElementById("minFrequencySilder").value);
    document.getElementById("selectedFrequencySilder").value = Number(document.getElementById("minFrequencySilder").value);
    document.getElementById("selectedFrequencySilder").max   = Number(document.getElementById("maxFrequencySilder").value);

    updateTitle("Starts in 3");
    setTimeout(function () {

        updateTitle("Starts in 2");
        setTimeout(function () {

            updateTitle("Starts in 1");
            setTimeout(function () {

                updateTitle("Guess the frequency");

                minFreq = Number(document.getElementById("minFrequencySilder").value);
                maxFreq = Number(document.getElementById("maxFrequencySilder").value);
                time    = Number(document.getElementById("toneDurationSlider").value);
                choosedFreq = getRandomInt(minFreq, maxFreq)
                console.log("Choosed frequency: "+choosedFreq)
                playTone(choosedFreq,1000, 0.15, function () {
                    document.getElementById("guessButton").disabled = false;
                });

            },1000);
        },1000);
    },1000);
}

function guessFrequency() {
    let selectedFrequency = Number(document.getElementById("selectedFrequencySilder").value);
    let offset = selectedFrequency - choosedFreq;
    let offsetPositive = offset < 0 ? offset * -1 : offset
    document.getElementById("resultText").innerText = "Your guess is " + offset + " Hz off. The right frequency was " + choosedFreq + " Hz. "

    axios.post(base_uri+'api/game/add', {
        randomFequency: choosedFreq,
        selectedFrequency: selectedFrequency
    }).then(function (response) {
        console.log(response);
    }).catch(function (error) {
        console.log(error);
    });

    document.getElementById("gameSettingPage").style.display = "none";
    document.getElementById("gamePage").style.display = "none";
    document.getElementById("gameEndPage").style.display = "block";
}

function replaySameSettings() {
    startGame();
}

function resetPage() {
    document.getElementById("gameSettingPage").style.display = "block";
    document.getElementById("gamePage").style.display = "none";
    document.getElementById("gameEndPage").style.display = "none";
}

let context = new AudioContext()
let gain2 = context.createGain()
let ocsillator2 = context.createOscillator()

function startPlayingSound() {
    try {
        ocsillator2.stop(context.currentTime)
    } catch (e) { }

    gain2 = context.createGain()
    ocsillator2 = context.createOscillator()

    ocsillator2.connect(gain2)
    gain2.connect(context.destination)
    gain2.gain.setValueAtTime(0.15, context.currentTime);
    ocsillator2.frequency.value = document.getElementById("selectedFrequencySilder").value
    ocsillator2.start(0)
}

function stopPlayingSound() {
    ocsillator2.stop(context.currentTime)
}

function updateFrequency() {
    ocsillator2.frequency.value = document.getElementById("selectedFrequencySilder").value
}
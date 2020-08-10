let stopSound = false
let testButtonPressed = false

function startAudioTest(volume) {
    let context = new AudioContext()
    let ocsillator = context.createOscillator()
    let gain = context.createGain()

    ocsillator.connect(gain)
    gain.connect(context.destination);
    gain.gain.setValueAtTime(volume, context.currentTime);

    ocsillator.frequency.value = 5
    ocsillator.start(0)

    setInterval(function () {
        if(ocsillator.frequency.value < 50) {
            ocsillator.frequency.value += 0.01
        } else
        if(ocsillator.frequency.value < 200) {
            ocsillator.frequency.value += 0.05
        }else
        if(ocsillator.frequency.value < 500) {
            ocsillator.frequency.value += 0.1
        }else
        if(ocsillator.frequency.value < 1000) {
            ocsillator.frequency.value += 0.5
        }else
        if(ocsillator.frequency.value < 7000) {
            ocsillator.frequency.value += 1
        }else
        if(ocsillator.frequency.value < 10000) {
            ocsillator.frequency.value += 2
        }else
        if(ocsillator.frequency.value < 23990) {
            ocsillator.frequency.value += 4
        }

        if(ocsillator.frequency.value > 6000 && ocsillator.frequency.value < 12000 && !stopSound) {
            gain.gain.exponentialRampToValueAtTime(volume/2.0, context.currentTime + 0.05);
        } else {
            gain.gain.exponentialRampToValueAtTime(volume, context.currentTime + 0.05);
        }

        if(ocsillator.frequency.value < 23990 && ocsillator.frequency.value % 100 < 15 && !stopSound) {
            setPregressBar(ocsillator.frequency.value,testButtonPressed)
        }

        document.getElementById("currentFrequency").innerText = Math.round(ocsillator.frequency.value) + "Hz"
        if( (ocsillator.frequency.value > 23990 && ocsillator.frequency.value !== 24000) || stopSound) {
            ocsillator.frequency.value = 24000

            gain.gain.exponentialRampToValueAtTime(
                0.00001, context.currentTime + 0.04
            )
        }

    },1)
}


function updateTitle(text) { document.getElementById("gameTitle").innerText = text; }

function map(x, in_min, in_max, out_min, out_max) {
    return (x - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
}

function testButton_onpress() {
    testButtonPressed = true;
}

function testButton_onrelease() {
    stopSound = true;
    testButtonPressed = false;
    setTimeout(fillProgressBar,100);
    resultPage()
}

function setPregressBar(frequency, is_earing) {
    //progressFreq_NotEaring_low / progressFreq_earing / progressFreq_NotEaring_high

    k = 23990

    if(is_earing) {
        u = document.getElementById("progressFreq_NotEaring_low").style.width
        m = Number(u.substring(0,u.length-1))
        document.getElementById("progressFreq_earing").style.width = ((frequency / k * 100)-m) + "%"

        document.getElementById("resultTextMax").innerText = Math.round(frequency);
    } else {
        document.getElementById("progressFreq_NotEaring_low").style.width = (frequency / k * 100) + "%"

        document.getElementById("resultTextMin").innerText = Math.round(frequency);
    }
}

function fillProgressBar() {
    let u1 = document.getElementById("progressFreq_NotEaring_low").style.width
    u1 = Number(u1.substring(0,u1.length-1))
    let u2 = document.getElementById("progressFreq_earing").style.width
    u2 = Number(u2.substring(0,u2.length-1))
    document.getElementById("progressFreq_NotEaring_high").style.width = (100 - u1 - u2) + "%"
}

function startTest() {
    document.getElementById("testStartPage").style.display = "none";
    document.getElementById("testPage").style.display = "block";
    document.getElementById("testResultPage").style.display = "none";
    document.getElementById("testButton").disabled = true;

    updateTitle("Starts in 3");
    setTimeout(function () {

        updateTitle("Starts in 2");
        setTimeout(function () {

            updateTitle("Starts in 1");
            setTimeout(function () {

                document.getElementById("testButton").disabled = false;
                updateTitle("Test running");
                startAudioTest(0.05)

            },1000);
        },1000);
    },1000);
}




function resultPage() {
    document.getElementById("testStartPage").style.display = "none";
    document.getElementById("testPage").style.display = "none";
    document.getElementById("testResultPage").style.display = "block";

    let min = Number(document.getElementById("resultTextMin").innerText);
    let max = Number(document.getElementById("resultTextMax").innerText);

    axios.post(base_uri+'api/response_test', {
        min: min,
        max: max
    }).then(function (response) {
        console.log(response);
    }).catch(function (error) {
        console.log(error);
    });

}

function resetPage() {
    document.getElementById("testStartPage").style.display = "block";
    document.getElementById("testPage").style.display = "none";
    document.getElementById("testResultPage").style.display = "none";
}


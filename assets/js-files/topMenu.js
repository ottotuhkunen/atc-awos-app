let intervalId;

function populateTopMenu(qnh, qfe, metCond) {
    // set values
    document.getElementById('qnhValue').textContent = qnh;
    document.getElementById('qfeValue').textContent = qfe;
    document.getElementById('trlValue').textContent = calculateTrl(qnh);
    document.getElementById('metCondValue').textContent = metCond;

    if (sessionStorage.getItem('efhkQnh') === null) sessionStorage.efhkQnh = null;
  
    var qnhChanger = JSON.parse(sessionStorage.efhkQnh);

    if (qnh != qnhChanger && qnhChanger != null){
        stopToggle();
        sessionStorage.efhkQnh = JSON.stringify(qnh);
        startToggle();
    } else {
        sessionStorage.efhkQnh = JSON.stringify(qnh);
    }
}

function toggleStyles() {
    [qnhBox.style.fill, qnhValue.style.fill] = [qnhValue.style.fill, qnhBox.style.fill];
}

function startToggle() {
    intervalId = setInterval(toggleStyles, 600);
}

function stopToggle() {
    clearInterval(intervalId);
    document.getElementById('qnhBox').style.fill = "black";
    document.getElementById('qnhValue').style.fill = "white";
}

function qnhClick() {
    stopToggle();
    var qnhBox = document.getElementById('qnhBox');
    var qnhValue = document.getElementById('qnhValue');
    qnhBox.style.fill = "";
    qnhValue.style.fill = "";
    qnhBox.classList.add('topMenu3');
    qnhValue.classList.add('topMenu6');
}

function calculateTrl(qnh) {
    const conditions = [
        { min: 943, max: 959, value: 80 },
        { min: 960, max: 977, value: 75 },
        { min: 978, max: 995, value: 70 },
        { min: 996, max: 1013, value: 65 },
        { min: 1014, max: 1031, value: 60 },
        { min: 1032, max: 1050, value: 55 },
        { min: 1051, max: 1068, value: 50 }
    ];
    for (let condition of conditions) {
        if (qnh >= condition.min && qnh <= condition.max) {
            return condition.value;
        }
    }
    return 0;
}

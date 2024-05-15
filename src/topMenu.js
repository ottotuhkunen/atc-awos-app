let intervalId;

function populateTopMenu(qnh, qfe, metCond) {
    // set values
    document.getElementById('qnhValue').textContent = qnh;
    document.getElementById('qfeValue').textContent = qfe;
    document.getElementById('trlValue').textContent = calculateTrl(qnh);
    document.getElementById('metCondValue').textContent = metCond;

    if (sessionStorage.getItem('efhkQnh') === null) sessionStorage.efhkQnh = JSON.stringify(1);
  
    var qnhChanger = JSON.parse(sessionStorage.efhkQnh);

    if (qnh != qnhChanger){
        sessionStorage.efhkQnh = JSON.stringify(qnh);
        startToggle();
    }
}

function toggleStyles() {
    [qnhBox.style.fill, qnhValue.style.fill] = [qnhValue.style.fill, qnhBox.style.fill];
}

function startToggle() {
    intervalId = setInterval(toggleStyles, 500);
}

function stopToggle() {
    clearInterval(intervalId);
    document.getElementById('qnhBox').style.fill = "black";
    document.getElementById('qnhValue').style.fill = "white";
}

function qnhClick() {
    stopToggle();
    document.getElementById('qnhBox').style.fill = "white";
    document.getElementById('qnhValue').style.fill = "black";
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


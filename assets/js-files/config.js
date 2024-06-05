async function loadConfig() {

    let dep04l = false, arr04l = false, 
      dep04r = false, arr04r = false, 
      dep15 = false, arr15 = false, 
      dep33 = false, arr33 = false,
      dep22l = false, arr22l = false, 
      dep22r = false, arr22r = false;
      
    let atisText = "";

    try {
        // get current ATIS
        const response = await fetch('/api/atis');
        const data = await response.json();

        for (let item of data.atis) {
            if (item.callsign === "EFHK_D_ATIS") {
                atisText += item.text_atis ? item.text_atis : "EFHK DEP ATIS NIL";
            }
            if (item.callsign === "EFHK_A_ATIS") {
                atisText += item.text_atis ? item.text_atis : "EFHK ARR ATIS NIL";
            }
            if (item.callsign === "EFHK_ATIS") {
                atisText += item.text_atis ? item.text_atis : "EFHK ATIS NIL";
            }
        }

    } catch (error) {
        console.error('Error fetching ATIS:', error);
    }

    // TESTING
    // atisText = "THIS IS HELSINKI-VANTAA ARRIVAL AND DEPARTURE INFORMATION GOLF AT TIME 1950 EXPECT ILS APPROACH ARRIVAL RUNWAY 15 CLEAR AND DRY DEPARTURE RUNWAY 22L CLEAR AND DRY TRANSITION LEVEL 60 WIND 180 DEGREES 3 KNOTS CAVOK TEMPERATURE 13 DEW POINT 8 QNH 1018 NOSIG ADVISE ON INITIAL CONTACT YOU HAVE INFORMATION GOLF";
    
    atisText = atisText.replace("DEPARTURE RUNWAY", "DEP RWY");
    atisText = atisText.replace("DEPARTURE RUNWAYS", "DEP RWYS");
    atisText = atisText.replace("ARRIVAL RUNWAY", "ARR RWY");
    atisText = atisText.replace("ARRIVAL RUNWAYS", "ARR RWYS");

    // load active departure runways
    switch (true) {
      case atisText.includes("DEP RWY 22L AND 22R"):
        dep22l = true;
        dep22r = true;
        break;
      case atisText.includes("DEP RWYS 22R AND 22L"):
        dep22l = true;
        dep22r = true;
        break;
      case atisText.includes("DEP RWYS 22L AND 15"):
        dep22l = true;
        dep15 = true;
        break;
      case atisText.includes("DEP RWYS 04R AND 15"):
        dep04r = true;
        dep15 = true;
        break;
      case atisText.includes("DEP RWY 22R"):
        dep22r = true;
        break;
      case atisText.includes("DEP RWY 04R"):
        dep04r = true;
        break;
      case atisText.includes("DEP RWY 15"):
        dep15 = true;
        break;
      case atisText.includes("DEP RWY 22L"):
        dep22l = true;
        break;
      case atisText.includes("DEP RWY 04L"):
        dep04l = true;
        break;
      case atisText.includes("DEP RWY 33"):
        dep33 = true;
        break;
    }
  
    // load active arrival runways
    switch (true) {
      case atisText.includes("ARR RWY 22L AND 22R"):
        arr22l = true;
        arr22r = true;
        break;
      case atisText.includes("ARR RWYS 22L AND 22R"):
        arr22l = true;
        arr22r = true;
        break;
      case atisText.includes("ARR RWY 22L"):
        arr22l = true;
        break;
      case atisText.includes("ARR RWY 04L AND 04R"):
        arr04l = true;
        arr04r = true;
        break;
      case atisText.includes("ARR RWYS 04L AND 04R"):
        arr04l = true;
        arr04r = true;
        break;
      case atisText.includes("ARR RWY 04L"):
        arr04l = true;
        break;
      case atisText.includes("ARR RWY 04R"):
        arr04r = true;
        break;
      case atisText.includes("ARR RWY 15"):
        arr15 = true;
        break;
      case atisText.includes("ARR RWY 22R"):
        arr22r = true;
        break;
      case atisText.includes("ARR RWY 33"):
        arr33 = true;
        break;
    }

    let status04l = dep04l || arr04l;
    let status04r = dep04r || arr04r;
    let status15 = dep15 || arr15;
    let status33 = dep33 || arr33;
    let status22l = dep22l || arr22l;
    let status22r = dep22r || arr22r;

    // set runway styles
    setRunwaySurface("rwy04L", status04l, status22r);
    setRunwaySurface("rwy15", status15, status33);
    setRunwaySurface("rwy04R", status04r, status22l);

    // set runway numbers
    setRunwayNumbers("04L_number", "22R_number", status04l, status22r);
    setRunwayNumbers("15_number", "33_number", status15, status33);
    setRunwayNumbers("04R_number", "22L_number", status04r, status22l);

    // set wind display
    setWindDisplay("display04L", "04L_windSpd", "04L_windDir", "arrow04L", status04l);
    setWindDisplay("display04R", "04R_windSpd", "04R_windDir", "arrow04R", status04r);
    setWindDisplay("display15", "15_windSpd", "15_windDir", "arrow15", status15);
    setWindDisplay("display33", "33_windSpd", "33_windDir", "arrow33", status33);
    setWindDisplay("display22L", "22L_windSpd", "22L_windDir", "arrow22L", status22l);
    setWindDisplay("display22R", "22R_windSpd", "22R_windDir", "arrow22R", status22r);

    // set dep/arr indicators
    runwayIndicators("dep04L", "arr04L", dep04l, arr04l);
    runwayIndicators("dep04R", "arr04R", dep04r, arr04r);
    runwayIndicators("dep15", "arr15", dep15, arr15);
    runwayIndicators("dep33", "arr33", dep33, arr33);
    runwayIndicators("dep22L", "arr22L", dep22l, arr22l);
    runwayIndicators("dep22R", "arr22R", dep22r, arr22r);

    // set variable wind direction or wind gust
    setDataStyles("04L_maxDir", "04L_maxSpd", "04L_minSpd", status04l);
    setDataStyles("04R_maxDir", "04R_maxSpd", "04R_minSpd", status04r);
    setDataStyles("15_maxDir", "15_maxSpd", "15_minSpd", status15);
    setDataStyles("33_maxDir", "33_maxSpd", "33_minSpd", status33);
    setDataStyles("22L_maxDir", "22L_maxSpd", "22L_minSpd", status22l);
    setDataStyles("22R_maxDir", "22R_maxSpd", "22R_minSpd", status22r);
}

function setDataStyles(vrbId, maxSpdId, minSpdId, runwayStatus) {
    
    var vrbField = document.getElementById(vrbId);
    var maxField = document.getElementById(maxSpdId);
    var minField = document.getElementById(minSpdId);
    vrbField.classList.remove("highlightInfo");
    maxField.classList.remove("highlightInfo");
    minField.classList.remove("highlightInfo");

    if (runwayStatus && variableBetween) {
        vrbField.classList.add("highlightInfo");
    }
    if (runwayStatus && gustFound) {
        maxField.classList.add("highlightInfo");
        minField.classList.add("highlightInfo");
    }
}

function runwayIndicators(depId, arrId, depStatus, arrStatus) {

    var depIndicator = document.getElementById(depId);
    var arrIndicator = document.getElementById(arrId);

    depIndicator.style.display = "none";
    arrIndicator.style.display = "none";

    if (depStatus) {
        depIndicator.style.display = "block";
    }
    if (arrStatus) {
        arrIndicator.style.display = "block";
    }
}

function setWindDisplay(displayId, windSpdId, windDirId, arrowId, runwayStatus) {

    var windDisplay = document.getElementById(displayId);
    var windSpd = document.getElementById(windSpdId);
    var windDir = document.getElementById(windDirId);
    var arrow = document.getElementById(arrowId);

    windDisplay.classList.remove("activeWindDisplay");
    windSpd.classList.remove("activeText");
    windDir.classList.remove("activeText");
    arrow.classList.remove("activeArrow");

    if (runwayStatus) {
        windDisplay.classList.add("activeWindDisplay");
        windSpd.classList.add("activeText");
        windDir.classList.add("activeText");
        arrow.classList.add("activeArrow");
    }
}

function setRunwayNumbers(numberId, oppositeNumberId, runwayStatus, oppositeStatus) {

    var runwayNumber = document.getElementById(numberId);
    var oppositeRunwayNumber = document.getElementById(oppositeNumberId);
    runwayNumber.classList.remove("activeNumbers", "oppositeOfActiveNumbers");
    oppositeRunwayNumber.classList.remove("activeNumbers", "oppositeOfActiveNumbers");

    if (runwayStatus && oppositeStatus) {
        runwayNumber.classList.add("activeNumbers");
        oppositeRunwayNumber.classList.add("activeNumbers");
    } 
    else if (runwayStatus && oppositeStatus == false) {
        runwayNumber.classList.add("activeNumbers");
        oppositeRunwayNumber.classList.add("oppositeOfActiveNumbers");
    }
    else if (runwayStatus == false && oppositeStatus) {
        runwayNumber.classList.add("oppositeOfActiveNumbers");
        oppositeRunwayNumber.classList.add("activeNumbers");
    }
}


function setRunwaySurface(runwayId, runwayStatus, oppositeStatus) {

    var runwayBackground = document.getElementById(runwayId);
    runwayBackground.classList.remove("activeBackground");

    if (runwayStatus || oppositeStatus) {
        // runway is active
        runwayBackground.classList.add("activeBackground");
    }

    // 04R bring-to-front if 15 is not in use
    if (runwayId == "rwy15" && runwayStatus == false) {
        document.getElementById("bringToFront04R22L").style.display = "block";
    } 
    else if (runwayId == "rwy15" && runwayStatus == true) {
        document.getElementById("bringToFront04R22L").style.display = "none";
    }
}



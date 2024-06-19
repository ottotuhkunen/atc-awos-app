document.addEventListener("DOMContentLoaded", function() {
    loadFMI();
    setInterval(loadFMI, 90000);
  
    fetch('/user-data')
      .then(response => response.json())
      .then(data => {
        document.getElementById('user-id').innerText = data.id;
      })
      .catch(error => console.error('Error fetching user data:', error));
});

async function loadFMI() {
  const loadingIcon = document.getElementById("loadingIcon");
  try {
    loadingIcon.style.display = "block";
    const response = await fetch("https://opendata.fmi.fi/wfs?service=WFS&version=2.0.0&request=getFeature&storedquery_id=fmi::observations::weather::simple&fmisid=100968");

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    } else {
      const responseText = await response.text();
      const parser = new DOMParser();
      const data = parser.parseFromString(responseText, "application/xml");
      await setData(data);
      await loadConfig();
      await fetchRwyStatus();
      console.log("FMI data loaded at", new Date().toLocaleTimeString());
    }
  } catch (error) {
    console.log('Fetch API error -', error);
  }
}

async function loadMetar() {
  try {
      const response = await fetch("https://opendata.fmi.fi/wfs?service=WFS&version=2.0.0&request=getFeature&storedquery_id=fmi::avi::observations::iwxxm&icaocode=EFHK");

      if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
      } else {
          const responseText = await response.text();
          const parser = new DOMParser();
          const data = parser.parseFromString(responseText, "application/xml");
          await setMetarData(data);
          await fetchInformation();
          console.log("METAR data loaded at", new Date().toLocaleTimeString());
      }
  } catch (error) {
      console.log('error in loadMetar function:', error);
      document.getElementById("metar").innerHTML = "NO FMI DATABASE CONNECTION=";
      document.getElementById("missingMetar").style.display = "block";
  }
}

// global scope
let wawa = 0;
let metCond = "//";
let qnh = 0;
let atisCode = "//";
let windDirection = 0;
let windProblems = false;
let metar = "//";
let atisType = 0;
const runways = ["22R", "22L", "15", "33", "04R", "04L"];
let variableBetween = false;
let gustFound = false;

async function setData(xmlDoc) {
  try {
    var xmlSize = xmlDoc.getElementsByTagName("BsWfs:ParameterName");
    var table = new Array(xmlSize.length);

    for(var i = 0; i < xmlSize.length; i++) {
      table[i] = new Array(2);
      table[i][0] = xmlDoc.getElementsByTagName("BsWfs:ParameterName")[i].childNodes[0].nodeValue;
      table[i][1] = xmlDoc.getElementsByTagName("BsWfs:ParameterValue")[i].childNodes[0].nodeValue;
    }

    table = table.slice(-70, -1);
    
    var windSpeed = 0;
    var windGust = 0;

    for (var i = 0; i < table.length; i++) {
        if (table[i][0] === "p_sea") qnh = table[i][1]; // set QNH
        if (table[i][0] === "ws_10min") { // set wind speed
          windSpeed = table[i][1];
          if (isNaN(windSpeed)) { // wind speed not found
            windSpeed = 5;
            document.getElementById('fmiProblems').style.display = "block";
            windProblems = true;
          } else {
            document.getElementById('fmiProblems').style.display = "none";
            windProblems = false;
          }
        }
        if (table[i][0] === "wd_10min") {
          windDirection = table[i][1];
          if (isNaN(windDirection)) { // wind direction not found
            windDirection = 360;
            windProblems = true;
          }
        }
        if (table[i][0] === "wg_10min") {
          windGust = table[i][1];
          if (isNaN(windGust)) windGust = windSpeed + 4;
        }
        if (table[i][0] === "wawa") wawa = table[i][1];
    }

    var roundedGust = Math.ceil(windGust * 1.943);
    var roundedWindSpeed = Math.round(windSpeed * 1.943);

    document.getElementById("metQfe").textContent = Math.floor(qnh - 6.5);
    document.getElementById("22R_windDir").innerHTML = randomWindDirection(windDirection, "arrow22R", "22R_maxDir", roundedWindSpeed);
    document.getElementById("22L_windDir").innerHTML = randomWindDirection(windDirection, "arrow22L", "22L_maxDir", roundedWindSpeed);
    document.getElementById("15_windDir").innerHTML = randomWindDirection(windDirection, "arrow15", "15_maxDir", roundedWindSpeed);
    document.getElementById("33_windDir").innerHTML = randomWindDirection(windDirection, "arrow33", "33_maxDir", roundedWindSpeed);
    document.getElementById("04L_windDir").innerHTML = randomWindDirection(windDirection, "arrow04L", "04L_maxDir", roundedWindSpeed);
    document.getElementById("04R_windDir").innerHTML = randomWindDirection(windDirection, "arrow04R", "04R_maxDir", roundedWindSpeed);

    // WIND CALM
    if (roundedWindSpeed < 2) {
      runways.forEach(runway => {
        document.getElementById(`${runway}_windDir`).style.display = "none";
        document.getElementById(`${runway}_maxDir`).style.display = "none";
        document.getElementById(`${runway}_windSpd`).innerHTML = "CALM";
        document.getElementById(`arrow${runway}`).style.display = "none";
      });
    }
    // WIND NOT CALM
    else {
      runways.forEach(runway => {
        document.getElementById(`${runway}_windSpd`).innerHTML = roundedWindSpeed;
        document.getElementById(`${runway}_windDir`).style.display = "block";
        document.getElementById(`${runway}_maxDir`).style.display = "block";
        document.getElementById(`arrow${runway}`).style.display = "block";
      });
    }

    getMaxSpeed(roundedGust, roundedWindSpeed, "display22R", "22R_maxSpd","22R");
    getMaxSpeed(roundedGust, roundedWindSpeed, "display22L", "22L_maxSpd", "22L");
    getMaxSpeed(roundedGust, roundedWindSpeed, "display15", "15_maxSpd", "15");
    getMaxSpeed(roundedGust, roundedWindSpeed, "display33", "33_maxSpd", "33");
    getMaxSpeed(roundedGust, roundedWindSpeed, "display04L", "04L_maxSpd", "04L");
    getMaxSpeed(roundedGust, roundedWindSpeed, "display04R", "04R_maxSpd", "04R");

    // SET MINIMUM WIND SPEED
    runways.forEach(runway => {
      document.getElementById(`${runway}_minSpd`).innerHTML = getMinSpeed(roundedWindSpeed);
    });

    await loadMetar();
    setCurrentWx(Math.floor(wawa));
    } catch (error) {
      console.log('Error in setData function:', error);
  }
}

function getMinSpeed(roundedWindSpeed) {
  var minimumSpeed = Math.floor(Math.random() * ((roundedWindSpeed - 2) - (roundedWindSpeed - 5)) + (roundedWindSpeed - 5));
  if (minimumSpeed < 0) {
    minimumSpeed = 0;
  }
  return minimumSpeed;
}

function getMaxSpeed(roundedGust, roundedWindSpeed, display, font1, runway) {
  var maxGust = roundedGust + 3;
  var maxSpeed = Math.floor(Math.random() * (maxGust - roundedGust) + roundedGust);
  var gustLimit = roundedWindSpeed + 10;

  if (maxSpeed >= gustLimit) gustFound = true;
  else gustFound = false;

  document.getElementById(font1).innerHTML = maxSpeed;
}

function randomWindDirection(realDirection, arrowID, maxDirID, windSpeed) {
  var min = (realDirection - 10);
  var max = (realDirection + 10);
  var randomDirection = Math.floor(Math.random() * (max - min) + min);

  randomDirection = Math.round(randomDirection / 10) * 10;
  randomDirection = ((randomDirection % 360) + 360) % 360;

  document.getElementById(arrowID).style.transform = `rotate(${(randomDirection + 180)}deg)`;

  var minimumRandomDirection = (randomDirection - 20);
  var maximumRandomDirection = (randomDirection + 20);

  minimumRandomDirection = ((minimumRandomDirection % 360) + 360) % 360;
  maximumRandomDirection = ((maximumRandomDirection % 360) + 360) % 360;

  windComponentCalculator(windSpeed, randomDirection, arrowID);

  randomDirection = adjustDirection(randomDirection);
  minimumRandomDirection = adjustDirection(minimumRandomDirection);
  maximumRandomDirection = adjustDirection(maximumRandomDirection);
  
  document.getElementById(maxDirID).innerHTML = minimumRandomDirection + "-" + maximumRandomDirection;
  
  return randomDirection;
}

function adjustDirection(direction) {
  if (direction == 0) direction = 360;
  if (direction < 100) direction = "0" + direction;
  return direction;
}

async function setMetarData(xmlDoc) {
  try {

  let records = xmlDoc.getElementsByTagName("iwxxm:MeteorologicalAerodromeObservationRecord");
  let latestRecord = records[records.length - 1];

  let counterClockwises = latestRecord ? latestRecord.getElementsByTagName("iwxxm:extremeCounterClockwiseWindDirection") : null;
  let clockwises = latestRecord ? latestRecord.getElementsByTagName("iwxxm:extremeClockwiseWindDirection") : null;

  var metars = xmlDoc.getElementsByTagName('avi:input');
  let metar = metars.length > 0 && metars[metars.length - 1].childNodes.length > 0
      ? metars[metars.length - 1].childNodes[0].nodeValue : "EFHK METAR NIL=";

  let dataProblem = metar === "EFHK METAR NIL=";

  document.getElementById("metar").innerHTML = metar; // show METAR

  // check if METAR is valid
  let metarTimes = xmlDoc.getElementsByTagName('avi:processingTime');
  // Find the latest processingTime
  let latestProcessingTime = null;
  for (let i = 0; i < metarTimes.length; i++) {
    let currentProcessingTime = new Date(metarTimes[i].textContent);
    if (!latestProcessingTime || currentProcessingTime > latestProcessingTime) {
      latestProcessingTime = currentProcessingTime;
    }
  }

  if (latestProcessingTime) {
    let currentTime = new Date();

    // Check if the latest processingTime is more than 35 minutes ago
    let timeDifference = (currentTime - latestProcessingTime) / (1000 * 60);
    // console.log(latestProcessingTime + " difference: " + timeDifference);
    
    if (timeDifference > 36) document.getElementById("missingMetar").style.display = "block";
    else document.getElementById("missingMetar").style.display = "none";

  }
  
  var trend = metar.match(/(\sQ\d{4}\s)(.*?)(?==)/); // set METREP trend (after QNH)
  if (trend && trend[2]) document.getElementById("metTrend").textContent = trend[2];

  // VARIABLE BETWEEN
  if (counterClockwises.length > 0 && dataProblem == false) {

    var counterClockwise = counterClockwises[counterClockwises.length-1].childNodes[0].nodeValue;
    var clockwise = clockwises[clockwises.length-1].childNodes[0].nodeValue;

    counterClockwise = Math.round(counterClockwise);
    clockwise = Math.round(clockwise);
    windDirection = Math.floor(windDirection / 10) * 10;

    if (clockwise < counterClockwise) {
      // adjust clockwise if windDirection is outside of the sector
      if (windDirection >= clockwise && windDirection < counterClockwise) {
          let clockwiseDiff = (windDirection - clockwise + 360) % 360;
          let counterClockwiseDiff = (counterClockwise - windDirection + 360) % 360;
          
          if (clockwiseDiff < counterClockwiseDiff) {
              clockwise = windDirection + 10;
          } else {
              counterClockwise = windDirection - 10;
          }
      }
    } else {
        // adjust counterClockwise or clockwise if windDirection is outside of the sector
        if (windDirection >= clockwise || windDirection <= counterClockwise) {
            let clockwiseDiff = (windDirection - clockwise + 360) % 360;
            let counterClockwiseDiff = (counterClockwise - windDirection + 360) % 360;
            
            if (clockwiseDiff < counterClockwiseDiff) {
                clockwise = windDirection + 10;
            } else {
                counterClockwise = windDirection - 10;
            }
        }
    }

    if (clockwise == 370) clockwise = 10;
    if (clockwise == 00) clockwise = 350;
    if (counterClockwise == 370) counterClockwise = 10;
    if (counterClockwise == 00) counterClockwise = 360;
    if (counterClockwise < 100) counterClockwise = "0" + counterClockwise;
    if (clockwise < 100) clockwise = "0" + clockwise;
    
    variableBetween = true;

    // SET VARIABLE MINIMUM AND MAXIMUM DIRECTION
    runways.forEach(runway => {
      document.getElementById(`${runway}_maxDir`).innerHTML = `${counterClockwise}-${clockwise}`;
    });
  }

  // NO VRB BETWEEN WIND IN METAR
  else variableBetween = false;

  // IF METAR CONTAINS VRB
  if (metar.includes("VRB")) {
    runways.forEach(runway => {
      document.getElementById(`${runway}_windDir`).innerHTML = "VRB";
    });

    runways.forEach(runway => {
      document.getElementById(`${runway}_maxDir`).style.display = "none";
    });
  }

  var viss = xmlDoc.getElementsByTagName("iwxxm:prevailingVisibility");
  var vis = viss.length > 0 && viss[viss.length - 1].childNodes.length > 0 ? viss[viss.length - 1].childNodes[0].nodeValue : "10000";

  setRwyLights(vis);

  // IMC VMC INDICATOR
  if (metar.match(" VV001") || metar.match(" VV002")) metCond = "LVP";
  else if (vis < 5000 && vis > 10 || metar.match(/\W*(BKN00)/g) || metar.match(/\W*(OVC00)/g) || metar.match(" VV")) metCond = "IMC";
  else metCond = "VMC";

  // Check if METAR contains RVR:
  var pattern_04L = metar.match(/R04L\/[A-Za-z]?(\d+)/);
  var pattern_04R = metar.match(/R04R\/[A-Za-z]?(\d+)/);
  var pattern_15 = metar.match(/R15\/[A-Za-z]?(\d+)/);
  var pattern_33 = metar.match(/R33\/[A-Za-z]?(\d+)/);
  var pattern_22L = metar.match(/R22L\/[A-Za-z]?(\d+)/);
  var pattern_22R = metar.match(/R22R\/[A-Za-z]?(\d+)/);

  // real RVR values stored below:
  var rvr_04L = pattern_04L ? pattern_04L[1] : null;
  var rvr_04R = pattern_04R ? pattern_04R[1] : null;
  var rvr_15 = pattern_15 ? pattern_15[1] : null;
  var rvr_33 = pattern_33 ? pattern_33[1] : null;
  var rvr_22L = pattern_22L ? pattern_22L[1] : null;
  var rvr_22R = pattern_22R ? pattern_22R[1] : null;

  // RVR 04L
  if (rvr_04L !== null) {
    var randomRVR_04L = rvrRandomizator(rvr_04L);
    document.getElementById('RVR_values_04L').style.display = "block";
    document.getElementById("rvr_04L_1").textContent = randomRVR_04L[0];
    document.getElementById("rvr_04L_2").textContent = randomRVR_04L[1];
    document.getElementById("rvr_04L_3").textContent = randomRVR_04L[2];
    document.getElementById("metRvr").textContent = "04L TDZ " + randomRVR_04L[0] + "M MID " + randomRVR_04L[1] + "M END " + randomRVR_04L[2] + "M";

    if (randomRVR_04L[0] < 600 || randomRVR_04L[1] < 600 || randomRVR_04L[2] < 600) metCond = "LVP";
  } 

  // RVR 04R
  if (rvr_04R !== null) {
    var randomRVR_04R = rvrRandomizator(rvr_04R);
    document.getElementById('RVR_values_04R').style.display = "block";
    document.getElementById("rvr_04R_1").textContent = randomRVR_04R[0];
    document.getElementById("rvr_04R_2").textContent = randomRVR_04R[1];
    document.getElementById("rvr_04R_3").textContent = randomRVR_04R[2];
    document.getElementById("metRvr2").textContent = "04R TDZ " + randomRVR_04R[0] + "M MID " + randomRVR_04R[1] + "M END " + randomRVR_04R[2] + "M";

    if (randomRVR_04R[0] < 600 || randomRVR_04R[1] < 600 || randomRVR_04R[2] < 600) metCond = "LVP";
  } 

  // RVR 15
  if (rvr_15 !== null) {
    var randomRVR_15 = rvrRandomizator(rvr_15);
    document.getElementById('RVR_values_15').style.display = "block";
    document.getElementById("rvr_15_1").textContent = randomRVR_15[0];
    document.getElementById("rvr_15_2").textContent = randomRVR_15[1];
    document.getElementById("rvr_15_3").textContent = randomRVR_15[2];
    document.getElementById("metRvr3").textContent = "15 TDZ " + randomRVR_15[0] + "M MID " + randomRVR_15[1] + "M END " + randomRVR_15[2] + "M";

    if (randomRVR_15[0] < 600 || randomRVR_15[1] < 600 || randomRVR_15[2] < 600 ) metCond = "LVP";
  } 

  // RVR 33
  if (rvr_33 !== null) {
    var randomRVR_33 = rvrRandomizator(rvr_33);
    document.getElementById('RVR_values_15').style.display = "block";
    document.getElementById("rvr_15_1").textContent = randomRVR_33[0];
    document.getElementById("rvr_15_2").textContent = randomRVR_33[1];
    document.getElementById("rvr_15_3").textContent = randomRVR_33[2];
    document.getElementById("metRvr3").textContent = "15 TDZ " + randomRVR_33[2] + "M MID " + randomRVR_33[1] + "M END " + randomRVR_33[0] + "M";

    if (randomRVR_33[0] < 600 || randomRVR_33[1] < 600 || randomRVR_33[2] < 600) metCond = "LVP";
  } 

  // RVR 22L
  if (rvr_22L !== null) {
    var randomRVR_22L = rvrRandomizator(rvr_22L);
    document.getElementById('RVR_values_04R').style.display = "block";
    document.getElementById("rvr_04R_1").textContent = randomRVR_22L[0];
    document.getElementById("rvr_04R_2").textContent = randomRVR_22L[1];
    document.getElementById("rvr_04R_3").textContent = randomRVR_22L[2];
    document.getElementById("metRvr2").textContent = "04R TDZ " + randomRVR_22L[2] + "M MID " + randomRVR_22L[1] + "M END " + randomRVR_22L[0] + "M";

    if (randomRVR_22L[0] < 600 || randomRVR_22L[1] < 600 || randomRVR_22L[2] < 600) metCond = "LVP";
  } 

  // RVR 22R
  if (rvr_22R !== null) {
    var randomRVR_22R = rvrRandomizator(rvr_22R);
    document.getElementById('RVR_values_04L').style.display = "block";
    document.getElementById("rvr_04L_1").textContent = randomRVR_22R[0];
    document.getElementById("rvr_04L_2").textContent = randomRVR_22R[1];
    document.getElementById("rvr_04L_3").textContent = randomRVR_22R[2];
    document.getElementById("metRvr").textContent = "04L TDZ " + randomRVR_22R[2] + "M MID " + randomRVR_22R[1] + "M END " + randomRVR_22R[0] + "M";

    if (randomRVR_22R[0] < 600 || randomRVR_22R[1] < 600 || randomRVR_22R[2] < 600) metCond = "LVP";
  } 

  // METCOND LVP if METAR contains VV
  if (metar.match(/[A-Za-z]+VV\d{2}[1-2]/)) metCond = "LVP";

  if (rvr_04L == null && rvr_22R == null) document.getElementById('RVR_values_04L').style.display = "none";
  if (rvr_04R == null && rvr_22L == null) document.getElementById('RVR_values_04R').style.display = "none";
  if (rvr_15 == null && rvr_33 == null) document.getElementById('RVR_values_15').style.display = "none";

  if (rvr_15 == null && rvr_33 == null && rvr_04L == null && rvr_22R == null && rvr_04R == null && rvr_22L == null) {
    document.getElementById("metRvr").textContent = "";
    document.getElementById("metRvr2").textContent = "";
    document.getElementById("metRvr3").textContent = "";
  }

  // populate the top menu (qnh, qfe, metCond)
  let qfeValue = Math.floor(qnh - 6.5);
  populateTopMenu(Math.floor(qnh), qfeValue, metCond);

  fetch('/api/atis')
  .then(async response => {
    const data = await response.json();
    let efhkAtisFound = false;

    for (let item of data.atis) {
      // checking for ATIS DEP
      if (item.callsign === "EFHK_D_ATIS") {
        efhkAtisFound = true;
        atisType = 1;
        let atisWithLines = item.text_atis ? item.text_atis.join(' ').replace(/\.\./g, '.').split('.') : ["EFHK DEP ATIS NIL"];
        await makeAtisText(atisWithLines.join('<br/>'));
      }

      // checking for ATIS ARR
      if (item.callsign === "EFHK_A_ATIS") {
        efhkAtisFound = true;
        atisType = 1;
        let atisWithLines = item.text_atis ? item.text_atis.join(' ').replace(/\.\./g, '.').split('.') : ["EFHK ARR ATIS NIL"];
        await makeAtisText(atisWithLines.join('<br/>'));
      }
    }

    // if ATIS DEP or ATIS ARR are not found, checking for ATIS combined
    if (!efhkAtisFound) {
      for (let item of data.atis) {
        if (item.callsign === "EFHK_ATIS") {
          efhkAtisFound = true;
          atisType = 2;

          let atisWithLines = item.text_atis ? item.text_atis.join(' ').replace(/\.\./g, '.').split('.') : ["EFHK ATIS NIL"];

          // console.log(atisWithLines);

          await makeAtisText(atisWithLines.join('<br/>'));
          break;
        }
      }
    }
      
    // EFHK ATIS not found:
    if (!efhkAtisFound) {
      atisType = 0;
      document.getElementById('atisId1').textContent = "--";
      document.getElementById('atisId2').textContent = "--";
      document.getElementById("atisInfoFieldDep").innerHTML = "EFHK DEP ATIS NIL";
      document.getElementById("atisInfoFieldArr").innerHTML = "EFHK ARR ATIS NIL";

      // TESTING:
      // let text = "THIS IS HELSINKI-VANTAA ARRIVAL AND DEPARTURE INFORMATION GOLF AT TIME 1950 EXPECT ILS APPROACH ARRIVAL RUNWAY 22L CLEAR AND DRY DEPARTURE RUNWAY 22L CLEAR AND DRY TRANSITION LEVEL 60 WIND 180 DEGREES 3 KNOTS CAVOK TEMPERATURE 13 DEW POINT 8 QNH 1018 NOSIG ADVISE ON INITIAL CONTACT YOU HAVE INFORMATION GOLF";
      // text = text.replace(/\.\./g, '.')
      // let atisWithLines = text ? text.replace(/\./g, '<br/>') : ["EFHK ATIS NIL"];
      // console.log(atisWithLines);
      // makeAtisText(atisWithLines);
      // END OF TESTING
    }

    if (windProblems) {
      noWindData();
    }

  }) // end of fetch .then
    
  } catch (error) {
    console.log('Error in closedATIS function:', error);
  }
}

async function makeAtisText(atisText) {
  try {
    if (atisText.includes("THIS IS HELSINKI-VANTAA")) {
      // using replacementRules from atisReplacementRules.js file
      // check if new VATATIS format (else UniATIS)
      if (atisText.includes("<br/>")) {
        for (const [pattern, replacement] of Object.entries(replacementRules)) {
          const regex = new RegExp(pattern, 'g');
          atisText = atisText.replace(regex, replacement);
        }
      } else {
        for (const [pattern, replacement] of Object.entries(replacementRulesOld)) {
          const regex = new RegExp(pattern, 'g');
          atisText = atisText.replace(regex, replacement);
        }
      }

    } else {
      // format clouds to show correctly with vATIS
      atisText = atisText.replace(/(?:\s*|<br\/>)*(FEW|BKN|SCT|OVC) (\d{3})/g, function(match, cloudCover, altitude) {
        let newAltitude = parseInt(altitude, 10) * 100;
        return `<br/>${cloudCover} ${newAltitude} FT`;
      });
      atisText = atisText.replace(/T (M?)0*(\d{1,2}) DP (M?)0*(\d{1,2})/g, function(match, m1, p1, m2, p2) {
        let temp1 = m1 === "M" ? "-" + p1 : p1;
        let temp2 = m2 === "M" ? "-" + p2 : p2;
        return "T " + parseInt(temp1, 10) + " DP " + parseInt(temp2, 10);
      });
      // format vertical visibility to vATIS
      atisText = atisText.replace(/VV 0*(\d{1,3})/g, function(match, num) {
        let value = parseInt(num, 10) * 100;
        return "OBSC VER VIS " + value + "FT";
      });
    }

    let pattern = /INFO\s([A-Z])/;
    let match = atisText.match(pattern);

    if (match && match[1]) atisCode = match[1]; // ATIS ID

    // set ATIS DEP and ATIS ARR identifiers and content
    if (atisText.includes("EFHK DEP INFO")) {
      document.getElementById('atisId1').textContent = atisCode;
      document.getElementById("atisInfoFieldDep").innerHTML = atisText;
    }
    else if (atisText.includes("EFHK ARR INFO")) {
      document.getElementById('atisId2').textContent = atisCode;
      document.getElementById("atisInfoFieldArr").innerHTML = atisText;
    }
    else if (atisText.includes("EFHK ARR AND DEP INFO")) {
      document.getElementById('atisId1').textContent = atisCode;
      document.getElementById("atisInfoFieldDep").innerHTML = atisText;
      document.getElementById('atisId2').textContent = atisCode;
      document.getElementById("atisInfoFieldArr").innerHTML = atisText;
    }

  } catch (error) {
    console.log('Error in makeAtisText function:', error);
  }
}

function rvrRandomizator(realRVR) {
  realRVR = Number(realRVR)
  var minRVR = realRVR - 100;
  var maxRVR = realRVR + 100;
  var rvrValue1, rvrValue2, rvrValue3;

  if (realRVR > 400 && realRVR < 1000) {
    rvrValue1 = (Math.round((Math.floor(Math.random() * (maxRVR - minRVR)) + minRVR)/50)*50);
    rvrValue2 = (Math.round((Math.floor(Math.random() * (maxRVR - minRVR)) + minRVR)/50)*50);
    rvrValue3 = (Math.round((Math.floor(Math.random() * (maxRVR - minRVR)) + minRVR)/50)*50);
  }
  else if (realRVR >= 1000) {
    rvrValue1 = (Math.round((Math.floor(Math.random() * (maxRVR - minRVR)) + minRVR)/100)*100);
    rvrValue2 = (Math.round((Math.floor(Math.random() * (maxRVR - minRVR)) + minRVR)/100)*100);
    rvrValue3 = (Math.round((Math.floor(Math.random() * (maxRVR - minRVR)) + minRVR)/100)*100);
  }
  else {
    rvrValue1 = realRVR;
    rvrValue2 = realRVR;
    rvrValue3 = realRVR;
  }

  return [rvrValue1, rvrValue2, rvrValue3];
}

function setCurrentWx(wawa) {
  // weatherConditions are listed in atisReplacementRules.js file
  document.getElementById("metCurrentWx").textContent = weatherConditions[wawa] || "";
}

function updateGroupText(groupElement, excludeId) {
  var textElements = groupElement.querySelectorAll('text');

  textElements.forEach(function(textElement) {
    if (textElement.id !== excludeId) {
      textElement.style.fill = '#C70039';
      textElement.textContent = "///";
    }
  });
}

function noWindData() {
  var groups = [
    { id: 'windDisp22R', excludeId: '22R_number' },
    { id: 'windDisp22L', excludeId: '22L_number' },
    { id: 'windDisp15', excludeId: '15_number' },
    { id: 'windDisp33', excludeId: '33_number' },
    { id: 'windDisp04L', excludeId: '04L_number' },
    { id: 'windDisp04R', excludeId: '04R_number' } 
  ];

  groups.forEach(function(group) {
    var groupElement = document.getElementById(group.id);
    updateGroupText(groupElement, group.excludeId);
  });

  document.getElementById("windArrows").style.display = "none";
}

function rwy15Closed() {
  var groups = [{id: 'windDisp15', excludeId: '15_number'}];

  groups.forEach(function(group) {
    var groupElement = document.getElementById(group.id);
    updateGroupText(groupElement, group.excludeId);
  });

  document.getElementById("arrow15").style.display = "none";
}

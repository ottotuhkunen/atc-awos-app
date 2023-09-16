function startDataFetching() {
  loadFMI();
  setInterval(loadFMI, 90000);
}

async function loadFMI() {
  try {
    const response = await fetch("https://opendata.fmi.fi/wfs?service=WFS&version=2.0.0&request=getFeature&storedquery_id=fmi::observations::weather::simple&fmisid=100968");

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    } else {
      const responseText = await response.text();
      const parser = new DOMParser();
      const data = parser.parseFromString(responseText, "application/xml");
      setData(data);
      fetchInformation();
      fetchRwyStatus();
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
          setMetarData(data);
          console.log("METAR data loaded at", new Date().toLocaleTimeString());
      }
  } catch (error) {
      console.log('Fetch API error -', error);
  }
}

// global scope
let wawa = 0;
let roundedQnh;
let metCond = "//";
let qnh = 0;
let atisCode = "//";
let windDirection = 0;
let windProblems = false;

function setData(xmlDoc) {
    var xmlSize = xmlDoc.getElementsByTagName("BsWfs:ParameterName");
    var table = new Array(xmlSize.length);

    for(var i = 0; i < xmlSize.length; i++) {
        table[i] = new Array(2);
        table[i][0] = xmlDoc.getElementsByTagName("BsWfs:ParameterName")[i].childNodes[0].nodeValue;
        table[i][1] = xmlDoc.getElementsByTagName("BsWfs:ParameterValue")[i].childNodes[0].nodeValue;
    }

    table = table.slice(-15, -1);
    
    var windSpeed = 0;
    var windGust = 0;

    for (var i = 0; i < table.length; i++) {
        if (table[i][0] === "p_sea") {
          qnh = table[i][1];
        }
        if (table[i][0] === "ws_10min") {
          windSpeed = table[i][1];
          if (isNaN(windSpeed)) {
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
          if (isNaN(windDirection)) {
            windDirection = 360;
            windProblems = true;
          }
        }
        if (table[i][0] === "wg_10min") {
          windGust = table[i][1];
          if (isNaN(windGust)) windGust = windSpeed + 4;
        }
        if (table[i][0] === "wawa") {
          wawa = table[i][1];
        }
    }

    roundedQnh = Math.floor(qnh);
    var roundedGust = Math.ceil(windGust * 1.943);
    var roundedWindSpeed = Math.round(windSpeed * 1.943);

    document.getElementById("metQfe").textContent = Math.floor(qnh - 6.5);
    document.getElementById("22R_windDir").innerHTML = randomWindDirection(windDirection, "arrow22R", "22R_maxDir", roundedWindSpeed);
    document.getElementById("22L_windDir").innerHTML = randomWindDirection(windDirection, "arrow22L", "22L_maxDir", roundedWindSpeed);
    document.getElementById("15_windDir").innerHTML = randomWindDirection(windDirection, "arrow15", "15_maxDir", roundedWindSpeed);
    document.getElementById("33_windDir").innerHTML = randomWindDirection(windDirection, "arrow33", "33_maxDir", roundedWindSpeed);
    document.getElementById("04L_windDir").innerHTML = randomWindDirection(windDirection, "arrow04L", "04L_maxDir", roundedWindSpeed);
    document.getElementById("04R_windDir").innerHTML = randomWindDirection(windDirection, "arrow04R", "04R_maxDir", roundedWindSpeed);

    //WIND CALM
    if (roundedWindSpeed < 2) {
      document.getElementById("22R_windDir").style.display = "none";
      document.getElementById("22R_maxDir").style.display = "none";
      document.getElementById("22R_windSpd").innerHTML = "CALM";
      document.getElementById("arrow22R").style.display = "none";

      document.getElementById("22L_windDir").style.display = "none";
      document.getElementById("22L_maxDir").style.display = "none";
      document.getElementById("22L_windSpd").innerHTML = "CALM";
      document.getElementById("arrow22L").style.display = "none";

      document.getElementById("15_windDir").style.display = "none";
      document.getElementById("15_maxDir").style.display = "none";
      document.getElementById("15_windSpd").innerHTML = "CALM";
      document.getElementById("arrow15").style.display = "none";

      document.getElementById("33_windDir").style.display = "none";
      document.getElementById("33_maxDir").style.display = "none";
      document.getElementById("33_windSpd").innerHTML = "CALM";
      document.getElementById("arrow33").style.display = "none";

      document.getElementById("04R_windDir").style.display = "none";
      document.getElementById("04R_maxDir").style.display = "none";
      document.getElementById("04R_windSpd").innerHTML = "CALM";
      document.getElementById("arrow04R").style.display = "none";

      document.getElementById("04L_windDir").style.display = "none";
      document.getElementById("04L_maxDir").style.display = "none";
      document.getElementById("04L_windSpd").innerHTML = "CALM";
      document.getElementById("arrow04L").style.display = "none";
    }
    else {
      document.getElementById("22R_windSpd").innerHTML = roundedWindSpeed;
      document.getElementById("22L_windSpd").innerHTML = roundedWindSpeed;
      document.getElementById("15_windSpd").innerHTML = roundedWindSpeed;
      document.getElementById("33_windSpd").innerHTML = roundedWindSpeed;
      document.getElementById("04R_windSpd").innerHTML = roundedWindSpeed;
      document.getElementById("04L_windSpd").innerHTML = roundedWindSpeed;

      document.getElementById("22R_windDir").style.display = "block";
      document.getElementById("22R_maxDir").style.display = "block";

      document.getElementById("22L_windDir").style.display = "block";
      document.getElementById("22L_maxDir").style.display = "block";

      document.getElementById("15_windDir").style.display = "block";
      document.getElementById("15_maxDir").style.display = "block";

      document.getElementById("33_windDir").style.display = "block";
      document.getElementById("33_maxDir").style.display = "block";

      document.getElementById("04R_windDir").style.display = "block";
      document.getElementById("04R_maxDir").style.display = "block";

      document.getElementById("04L_windDir").style.display = "block";
      document.getElementById("04L_maxDir").style.display = "block";

      document.getElementById("arrow04R").style.display = "block";
      document.getElementById("arrow04L").style.display = "block";
      document.getElementById("arrow15").style.display = "block";
      document.getElementById("arrow33").style.display = "block";
      document.getElementById("arrow22L").style.display = "block";
      document.getElementById("arrow22R").style.display = "block";
    }

    getMaxSpeed(roundedGust, roundedWindSpeed, "display22R", "22R_maxSpd", "22R_minSpd", "22R");
    getMaxSpeed(roundedGust, roundedWindSpeed, "display22L", "22L_maxSpd", "22L_minSpd", "22L");
    getMaxSpeed(roundedGust, roundedWindSpeed, "display15", "15_maxSpd", "15_minSpd", "15");
    getMaxSpeed(roundedGust, roundedWindSpeed, "display33", "33_maxSpd", "33_minSpd", "33");
    getMaxSpeed(roundedGust, roundedWindSpeed, "display04L", "04L_maxSpd", "04L_minSpd", "04L");
    getMaxSpeed(roundedGust, roundedWindSpeed, "display04R", "04R_maxSpd", "04R_minSpd", "04R");

    document.getElementById("22R_minSpd").innerHTML = getMinSpeed(roundedWindSpeed);
    document.getElementById("22L_minSpd").innerHTML = getMinSpeed(roundedWindSpeed);
    document.getElementById("15_minSpd").innerHTML = getMinSpeed(roundedWindSpeed);
    document.getElementById("33_minSpd").innerHTML = getMinSpeed(roundedWindSpeed);
    document.getElementById("04R_minSpd").innerHTML = getMinSpeed(roundedWindSpeed);
    document.getElementById("04L_minSpd").innerHTML = getMinSpeed(roundedWindSpeed);

    loadMetar();
    setCurrentWx(Math.floor(wawa));
}

function getMinSpeed(roundedWindSpeed) {
  var minimumSpeed = Math.floor(Math.random() * ((roundedWindSpeed - 2) - (roundedWindSpeed - 5)) + (roundedWindSpeed - 5));
  if (minimumSpeed < 0) {
    minimumSpeed = 0;
  }
  return minimumSpeed;
}

function getMaxSpeed(roundedGust, roundedWindSpeed, display, font1, font2, runway) {
  var maxGust = roundedGust + 3;
  var maxSpeed = Math.floor(Math.random() * (maxGust - roundedGust) + roundedGust);

  // console.log(maxSpeed);
  // console.log(roundedWindSpeed);

  var activeDep = JSON.parse(sessionStorage.getItem("depBox" + runway));
  var activeArr = JSON.parse(sessionStorage.getItem("arrBox" + runway));

  if (activeDep || activeArr){
      if (maxSpeed > (roundedWindSpeed + 9)) {
          document.getElementById(font1).style.fill = "black";
          document.getElementById(font2).style.fill = "black";
      } else {
          document.getElementById(font1).style.fill = "#B9B8BA";
          document.getElementById(font2).style.fill = "#B9B8BA";
      }
  } else {
      document.getElementById(font1).style.fill = "#B9B8BA";
      document.getElementById(font2).style.fill = "#B9B8BA";
  }
  
  // make gust
  document.getElementById(font1).innerHTML = roundedGust;
}

function randomWindDirection(realDirection, arrowID, maxDirID, windSpeed) { // 29.0
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

  if (randomDirection == 0) {
    randomDirection = 360;
  }
  if (randomDirection < 100) {
    randomDirection = "0" + randomDirection;
  }
  if (minimumRandomDirection == 0) {
    minimumRandomDirection = 360;
  }
  if (minimumRandomDirection < 100) {
    minimumRandomDirection = "0" + minimumRandomDirection;
  }
  if (maximumRandomDirection == 0) {
    maximumRandomDirection = 360;
  }
  if (maximumRandomDirection < 100) {
    maximumRandomDirection = "0" + maximumRandomDirection;
  }
  
  document.getElementById(maxDirID).innerHTML = minimumRandomDirection + "-" + maximumRandomDirection;
  
  return randomDirection;
}

function setMetarData(xmlDoc) {

  let records = xmlDoc.getElementsByTagName("iwxxm:MeteorologicalAerodromeObservationRecord");
  let latestRecord = records[records.length - 1];

  let counterClockwises = latestRecord.getElementsByTagName("iwxxm:extremeCounterClockwiseWindDirection");
  let clockwises = latestRecord.getElementsByTagName("iwxxm:extremeClockwiseWindDirection");

  var metars = xmlDoc.getElementsByTagName('avi:input');
  var metar = metars[metars.length-1].childNodes[0].nodeValue;
  document.getElementById("metar").innerHTML = metar;

  // set METREP trend
  var trend = metar.match(/(\sQ\d{4}\s)(.*?)(?==)/);

  if (trend && trend[2]) {
    document.getElementById("metTrend").textContent = trend[2];
  }

  // VARIABLE BETWEEN
  if (counterClockwises.length > 0) {

    var counterClockwise = counterClockwises[counterClockwises.length-1].childNodes[0].nodeValue;
    var clockwise = clockwises[clockwises.length-1].childNodes[0].nodeValue;

    counterClockwise = Math.round(counterClockwise);
    clockwise = Math.round(clockwise)

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

    if (JSON.parse(sessionStorage.getItem("depBox04L")) || JSON.parse(sessionStorage.getItem("arrBox04L"))) {
      document.getElementById("04L_maxDir").style.fill = "black";
    } else {
      document.getElementById("04L_maxDir").style.fill = "#B9B8BA";
    }
    if (JSON.parse(sessionStorage.getItem("depBox04R")) || JSON.parse(sessionStorage.getItem("arrBox04R"))) {
      document.getElementById("04R_maxDir").style.fill = "black";
    } else {
      document.getElementById("04R_maxDir").style.fill = "#B9B8BA";
    }
    if (JSON.parse(sessionStorage.getItem("depBox15")) || JSON.parse(sessionStorage.getItem("arrBox15"))) {
      document.getElementById("15_maxDir").style.fill = "black";
    } else {
      document.getElementById("15_maxDir").style.fill = "#B9B8BA";
    }
    if (JSON.parse(sessionStorage.getItem("depBox33")) || JSON.parse(sessionStorage.getItem("arrBox33"))) {
      document.getElementById("33_maxDir").style.fill = "black";
    } else {
      document.getElementById("33_maxDir").style.fill = "#B9B8BA";
    }
    if (JSON.parse(sessionStorage.getItem("depBox22L")) || JSON.parse(sessionStorage.getItem("arrBox22L"))) {
      document.getElementById("22L_maxDir").style.fill = "black";
    } else {
      document.getElementById("22L_maxDir").style.fill = "#B9B8BA";
    }
    if (JSON.parse(sessionStorage.getItem("depBox22R")) || JSON.parse(sessionStorage.getItem("arrBox22R"))) {
      document.getElementById("22R_maxDir").style.fill = "black";
    } else {
      document.getElementById("22R_maxDir").style.fill = "#B9B8BA";
    }

    document.getElementById("22R_maxDir").innerHTML = counterClockwise + "-" + clockwise;
    document.getElementById("22L_maxDir").innerHTML = counterClockwise + "-" + clockwise;
    document.getElementById("15_maxDir").innerHTML = counterClockwise + "-" + clockwise;
    document.getElementById("33_maxDir").innerHTML = counterClockwise + "-" + clockwise;
    document.getElementById("04R_maxDir").innerHTML = counterClockwise + "-" + clockwise;
    document.getElementById("04L_maxDir").innerHTML = counterClockwise + "-" + clockwise;
  }
  // no METAR VRB between:
  else {
    document.getElementById("04L_maxDir").style.fill = "#B9B8BA";
    document.getElementById("04R_maxDir").style.fill = "#B9B8BA";
    document.getElementById("15_maxDir").style.fill = "#B9B8BA";
    document.getElementById("33_maxDir").style.fill = "#B9B8BA";
    document.getElementById("22L_maxDir").style.fill = "#B9B8BA";
    document.getElementById("22R_maxDir").style.fill = "#B9B8BA";
  }

  // IF METAR CONTAINS VRB
  if (metar.includes("VRB")) {
    document.getElementById("22R_windDir").innerHTML = "VRB";
    document.getElementById("22L_windDir").innerHTML = "VRB";
    document.getElementById("15_windDir").innerHTML = "VRB";
    document.getElementById("33_windDir").innerHTML = "VRB";
    document.getElementById("04R_windDir").innerHTML = "VRB";
    document.getElementById("04L_windDir").innerHTML = "VRB";

    document.getElementById("22R_maxDir").style.display = "none";
    document.getElementById("22L_maxDir").style.display = "none";
    document.getElementById("15_maxDir").style.display = "none";
    document.getElementById("33_maxDir").style.display = "none";
    document.getElementById("04L_maxDir").style.display = "none";
    document.getElementById("04R_maxDir").style.display = "none";
  }

  var viss = xmlDoc.getElementsByTagName("iwxxm:prevailingVisibility");
  var vis = viss[viss.length-1].childNodes[0].nodeValue;

  // IMC VMC INDICATOR
  if (vis < 5000 && vis > 10 || metar.match(/\W*(BKN00)/g) || metar.match(/\W*(OVC00)/g) || metar.match(" VV")){
    metCond = "IMC";
  }
  else {
    metCond = "VMC";
  }

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

    if (randomRVR_04L[0] < 600 || randomRVR_04L[1] < 600 || randomRVR_04L[2] < 600) {
      metCond = "LVP";
    }
  } 

  // RVR 04R
  if (rvr_04R !== null) {
    var randomRVR_04R = rvrRandomizator(rvr_04R);
    document.getElementById('RVR_values_04R').style.display = "block";
    document.getElementById("rvr_04R_1").textContent = randomRVR_04R[0];
    document.getElementById("rvr_04R_2").textContent = randomRVR_04R[1];
    document.getElementById("rvr_04R_3").textContent = randomRVR_04R[2];
    document.getElementById("metRvr2").textContent = "04R TDZ " + randomRVR_04R[0] + "M MID " + randomRVR_04R[1] + "M END " + randomRVR_04R[2] + "M";

    if (randomRVR_04R[0] < 600 || randomRVR_04R[1] < 600 || randomRVR_04R[2] < 600) {
      metCond = "LVP";
    }
  } 

  // RVR 15
  if (rvr_15 !== null) {
    var randomRVR_15 = rvrRandomizator(rvr_15);
    document.getElementById('RVR_values_15').style.display = "block";
    document.getElementById("rvr_15_1").textContent = randomRVR_15[0];
    document.getElementById("rvr_15_2").textContent = randomRVR_15[1];
    document.getElementById("rvr_15_3").textContent = randomRVR_15[2];
    document.getElementById("metRvr3").textContent = "15 TDZ " + randomRVR_15[0] + "M MID " + randomRVR_15[1] + "M END " + randomRVR_15[2] + "M";

    if (randomRVR_15[0] < 600 || randomRVR_15[1] < 600 || randomRVR_15[2] < 600 ) {
      metCond = "LVP";
    }
  } 

  // RVR 33
  if (rvr_33 !== null) {
    var randomRVR_33 = rvrRandomizator(rvr_33);
    document.getElementById('RVR_values_15').style.display = "block";
    document.getElementById("rvr_15_1").textContent = randomRVR_33[0];
    document.getElementById("rvr_15_2").textContent = randomRVR_33[1];
    document.getElementById("rvr_15_3").textContent = randomRVR_33[2];
    document.getElementById("metRvr3").textContent = "15 TDZ " + randomRVR_33[2] + "M MID " + randomRVR_33[1] + "M END " + randomRVR_33[0] + "M";

    if (randomRVR_33[0] < 600 || randomRVR_33[1] < 600 || randomRVR_33[2] < 600) {
      metCond = "LVP";
    }
  } 

  // RVR 22L
  if (rvr_22L !== null) {
    var randomRVR_22L = rvrRandomizator(rvr_22L);
    document.getElementById('RVR_values_04R').style.display = "block";
    document.getElementById("rvr_04R_1").textContent = randomRVR_22L[0];
    document.getElementById("rvr_04R_2").textContent = randomRVR_22L[1];
    document.getElementById("rvr_04R_3").textContent = randomRVR_22L[2];
    document.getElementById("metRvr2").textContent = "04R TDZ " + randomRVR_22L[2] + "M MID " + randomRVR_22L[1] + "M END " + randomRVR_22L[0] + "M";

    if (randomRVR_22L[0] < 600 || randomRVR_22L[1] < 600 || randomRVR_22L[2] < 600) {
      metCond = "LVP";
    }
  } 

  // RVR 22R
  if (rvr_22R !== null) {
    var randomRVR_22R = rvrRandomizator(rvr_22R);
    document.getElementById('RVR_values_04L').style.display = "block";
    document.getElementById("rvr_04L_1").textContent = randomRVR_22R[0];
    document.getElementById("rvr_04L_2").textContent = randomRVR_22R[1];
    document.getElementById("rvr_04L_3").textContent = randomRVR_22R[2];
    document.getElementById("metRvr").textContent = "04L TDZ " + randomRVR_22R[2] + "M MID " + randomRVR_22R[1] + "M END " + randomRVR_22R[0] + "M";

    if (randomRVR_22R[0] < 600 || randomRVR_22R[1] < 600 || randomRVR_22R[2] < 600) {
      metCond = "LVP";
    }
  } 

  if (metar.match(/[A-Za-z]+VV\d{2}[1-2]/)) {
    metCond = "LVP";
  }

  if (rvr_04L == null && rvr_22R == null) {
    document.getElementById('RVR_values_04L').style.display = "none";
  }
  if (rvr_04R == null && rvr_22L == null) {
    document.getElementById('RVR_values_04R').style.display = "none";
  }
  if (rvr_15 == null && rvr_33 == null) {
    document.getElementById('RVR_values_15').style.display = "none";
  }
  if (rvr_15 == null && rvr_33 == null && rvr_04L == null && rvr_22R == null && rvr_04R == null && rvr_22L == null) {
    document.getElementById("metRvr").textContent = "";
    document.getElementById("metRvr2").textContent = "";
    document.getElementById("metRvr3").textContent = "";
  }

  // populate the top menu (qnh, qfe, metCond)
  let qfeValue = Math.floor(qnh - 6.5);
  populateTopMenu(roundedQnh, qfeValue, metCond);

  // get ATIS
  fetch('https://data.vatsim.net/v3/vatsim-data.json')
  .then(response => response.json())
  .then(data => {
    for (let item of data.atis) {
      if (item.callsign === "EFHK_ATIS") {
        var atisWithLines = item.text_atis.join(' ').replace(/\.\./g, '.').split('.');
        makeAtisText(atisWithLines.join('<br>'));
        break;
      }
      else {
        document.getElementById('atisId1').textContent = "//";
        document.getElementById('atisId2').textContent = "//";
        document.getElementById('atisInfoField').innerHTML = "EFHK ATIS NIL";
        if (document.getElementById("rwyConfigValue").textContent == "AUTO") {
          // make all runways inactive
          loadConfig();
        }
      }
    }
  })
  .catch(error => console.error('Error:', error));
  if (windProblems) {
    noWindData();
  }
  // rwy15Closed();
}

function makeAtisText(atisText) {
  if (atisText.includes("THIS IS HELSINKI-VANTAA")) {
    atisText = atisText.replace(/(THIS IS HELSINKI-VANTAA ARRIVAL AND DEPARTURE INFORMATION) (\w)/, "EFHK ARR AND DEP INFO $2<br/>");
    atisText = atisText.replace(/AT TIME (\d{4})/g, '$1<br/>');
    atisText = atisText.replace(/APPROACH/g, 'APCH');
    atisText = atisText.replace(/ARRIVAL/g, '<br/>ARR');
    atisText = atisText.replace(/DEPARTURE/g, '<br/>DEP');
    atisText = atisText.replace(/RUNWAY/g, 'RWY');
    atisText = atisText.replace(/RUNWAYS/g, 'RWYS');
    atisText = atisText.replace(/DEP RWY 22L AND 22R/g, 'DEP RWYS 22R AND 22L');
    atisText = atisText.replace(/ARR RWY 04L AND 04R/g, 'ARR RWYS 04L AND 04R');
    atisText = atisText.replace(/ARR RWY 22L AND 22R/g, 'ARR RWYS 22L AND 22R');
    atisText = atisText.replace(/CLEAR AND DRY/g, '');
    atisText = atisText.replace(/TRANSITION LEVEL (\d{2})/g, '<br/>TRL $1<br/>');
    atisText = atisText.replace(/DEGREES/g, 'DEG');
    atisText = atisText.replace(/KNOTS/g, 'KT');
    atisText = atisText.replace(/MAXIMUM/g, 'MAX');
    atisText = atisText.replace(/TEMPERATURE/g, '<br/>T');
    atisText = atisText.replace(/DEW POINT/g, 'DP');
    atisText = atisText.replace(/QNH (\d{4})/g, 'QNH $1<br/>');
    atisText = atisText.replace(/ADVISE ON INITIAL CONTACT YOU HAVE INFORMATION/g, '<br/>ACK INFO');
    atisText = atisText.replace(/VERTICAL VISIBILITY/g, '<br/>VV');
    atisText = atisText.replace(/VISIBILITY/g, '<br/>VIS');
    atisText = atisText.replace(/CAVOK/g, '<br/>CAVOK');
    atisText = atisText.replace(/BROKEN/g, '<br/>BKN');
    atisText = atisText.replace(/SCATTERED/g, '<br/>SCT');
    atisText = atisText.replace(/OVERCAST/g, '<br/>OVC');
    atisText = atisText.replace(/FEW/g, '<br/>FEW');
    atisText = atisText.replace(/PROBABILITY/g, 'PROB');
    atisText = atisText.replace(/LIGHT/g, 'FBL');
    atisText = atisText.replace(/HEAVY/g, 'HVY');
    atisText = atisText.replace(/MODERATE/g, 'MOD');
    atisText = atisText.replace(/CUMULONIMBUS/g, 'CB');
    atisText = atisText.replace(/MOVING/g, 'MOV');
    atisText = atisText.replace(/EAST/g, 'E');
    atisText = atisText.replace(/NORTH/g, 'N');
    atisText = atisText.replace(/WEST/g, 'W');
    atisText = atisText.replace(/SOUTH/g, 'S');
    atisText = atisText.replace(/NORTHWEST/g, 'NW');
    atisText = atisText.replace(/SOUTHWEST/g, 'SW');
    atisText = atisText.replace(/NORTHEAST/g, 'NE');
    atisText = atisText.replace(/SOUTHEAST/g, 'SE');
    atisText = atisText.replace(/ABOVE/g, 'ABV');
    atisText = atisText.replace(/FORECASTED/g, 'FCST');
    atisText = atisText.replace(/FLIGHT LEVEL/g, 'FL');
    atisText = atisText.replace(/NO SIGNIFICANT CLOUDS/g, 'NSC');
    atisText = atisText.replace(/SEVERE/g, 'SEV');
    atisText = atisText.replace(/CLEAR SKY/g, 'SKC');
    atisText = atisText.replace(/TEMPORARY/g, 'TEMPO');
    atisText = atisText.replace(/WIND SHEAR/g, 'WS');
    atisText = atisText.replace(/REPORTED/g, 'REP');
    atisText = atisText.replace(/BETWEEN/g, 'BTN');
    atisText = atisText.replace(/FROM/g, 'FM');
    atisText = atisText.replace(/FREEZING/g, 'FZ');
    atisText = atisText.replace(/ICING/g, 'ICE');
    atisText = atisText.replace(/NO CLOUDS DETECTED/g, 'NCD');
    atisText = atisText.replace(/RUNWAY VISUAL RANGE/g, 'RVR');
    atisText = atisText.replace(/TOWERING CUMULUS/g, 'TCU');
    atisText = atisText.replace(/VARIABLE/g, 'VRB');
    atisText = atisText.replace(/GUSTING/g, 'MAX');
    atisText = atisText.replace(/GUST/g, 'MAX');
    atisText = atisText.replace(/GUSTS/g, 'MAX');
    atisText = atisText.replace(/ SHALLOW/g, ' MI');
    atisText = atisText.replace(/ PARTIAL/g, ' PR');
    atisText = atisText.replace(/ PATCHES/g, ' BC');
    atisText = atisText.replace(/ LOW DRIFTING/g, ' DR');
    atisText = atisText.replace(/ BLOWING/g, ' BL');
    atisText = atisText.replace(/ SHOWERS/g, ' SH');
    atisText = atisText.replace(/ THUNDERSTORM/g, ' TS');
    atisText = atisText.replace(/DRIZZLE /g, 'DZ ');
    atisText = atisText.replace(/RAIN /g, 'RA ');
    atisText = atisText.replace(/SNOW GRAINS /g, 'SG ');
    atisText = atisText.replace(/SNOW /g, 'SN ');
    atisText = atisText.replace(/ICE CRYSTALS /g, 'IC ');
    atisText = atisText.replace(/ICE PELLETS /g, 'PL ');
    atisText = atisText.replace(/SMALL HAIL /g, 'GS ');
    atisText = atisText.replace(/HAIL /g, 'GR ');
    atisText = atisText.replace(/MIST /g, 'BR ');
    atisText = atisText.replace(/FOG /g, 'FG ');
    atisText = atisText.replace(/WIDESPREAD DUST /g, 'DU ');
    atisText = atisText.replace(/KILOMETERS/g, 'KM');
    atisText = atisText.replace(/METERS/g, 'M');
    atisText = atisText.replace(/VICINITY/g, 'VC');
    atisText = atisText.replace(/FEET/g, 'FT');
    atisText = atisText.replace(/NOSIG/g, 'NOSIG');
    atisText = atisText.replace(/BECOMING/g, '<br/>BECMG');
  }
  let pattern = /INFO\s([A-Z])/;

  let match = atisText.match(pattern);

  if (match && match[1]) {
    // ATIS ID
    atisCode = match[1];
  }

  document.getElementById('atisId1').textContent = atisCode;
  document.getElementById('atisId2').textContent = atisCode;
  
  document.getElementById("atisInfoField").innerHTML = atisText;

  if (document.getElementById("rwyConfigValue").textContent == "AUTO") {
    // load automatic rwy config
    loadConfig();
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
  currentWx = document.getElementById("metCurrentWx");

  if (wawa == 0) currentWx.textContent = "NSW";
  else if (wawa == 4) currentWx.textContent = "HZ";
  else if (wawa == 5) currentWx.textContent = "FG";
  else if (wawa == 10) currentWx.textContent = "BR";
  else if (wawa == 20) currentWx.textContent = "REFG";
  else if (wawa == 21) currentWx.textContent = "RE VCSH";
  else if (wawa == 22) currentWx.textContent = "RE SHRA";
  else if (wawa == 23) currentWx.textContent = "RERA";
  else if (wawa == 24) currentWx.textContent = "RESN";
  else if (wawa == 25) currentWx.textContent = "RE FZRA";
  else if (wawa == 30) currentWx.textContent = "FG";
  else if (wawa == 31) currentWx.textContent = "BCFG";
  else if (wawa == 32) currentWx.textContent = "MIFG";
  else if (wawa == 33) currentWx.textContent = "FG";
  else if (wawa == 34) currentWx.textContent = "HVY FG";
  else if (wawa == 40) currentWx.textContent = "RA";
  else if (wawa == 41) currentWx.textContent = "FBL RA";
  else if (wawa == 42) currentWx.textContent = "HVY RA";
  else if (wawa == 50) currentWx.textContent = "DZ";
  else if (wawa == 51) currentWx.textContent = "FBL DZ";
  else if (wawa == 52) currentWx.textContent = "DZ";
  else if (wawa == 53) currentWx.textContent = "HVY DZ";
  else if (wawa == 54) currentWx.textContent = "FBL FZDZ";
  else if (wawa == 55) currentWx.textContent = "FZDZ";
  else if (wawa == 56) currentWx.textContent = "HVY FZDZ";
  else if (wawa == 60) currentWx.textContent = "FBL RA";
  else if (wawa == 61) currentWx.textContent = "FBL RA";
  else if (wawa == 62) currentWx.textContent = "MOD RA";
  else if (wawa == 63) currentWx.textContent = "HVY RA";
  else if (wawa == 64) currentWx.textContent = "FBL FZRA";
  else if (wawa == 65) currentWx.textContent = "FZDZ";
  else if (wawa == 66) currentWx.textContent = "HVY FZDZ";
  else if (wawa == 67) currentWx.textContent = "FBL SNRA";
  else if (wawa == 68) currentWx.textContent = "SNRA";
  else if (wawa == 70) currentWx.textContent = "SN";
  else if (wawa == 71) currentWx.textContent = "FBL SN";
  else if (wawa == 72) currentWx.textContent = "SN";
  else if (wawa == 73) currentWx.textContent = "HVY SN";
  else if (wawa == 74) currentWx.textContent = "FBL GS";
  else if (wawa == 75) currentWx.textContent = "GS";
  else if (wawa == 76) currentWx.textContent = "HVY GS";
  else if (wawa == 77) currentWx.textContent = "SG";
  else if (wawa == 78) currentWx.textContent = "PL";
  else if (wawa == 80) currentWx.textContent = "SHRA";
  else if (wawa == 81) currentWx.textContent = "FBL SHRA";
  else if (wawa == 82) currentWx.textContent = "SHRA";
  else if (wawa == 83) currentWx.textContent = "HVY SHRA";
  else if (wawa == 84) currentWx.textContent = "HVY SHRA";
  else if (wawa == 85) currentWx.textContent = "FBL SHSN";
  else if (wawa == 86) currentWx.textContent = "SHSN";
  else if (wawa == 87) currentWx.textContent = "HVY SHSN";
  else if (wawa == 89) currentWx.textContent = "SHGR";
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
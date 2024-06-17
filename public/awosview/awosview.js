// open scope variables
var windDirection = 0;
var windSpeed = 0;
var windCalm = false;
var chartData;
let fmiStoredId = "101118";
let storedICAO = "EFTP";
let currentTime = new Date().getTime();
let fiveMinutesAgo = currentTime - (5 * 60 * 1000);
let cbState = [[fiveMinutesAgo, 0], [currentTime, 0]];

// get UTC time displayed on AWOS
function getDate(){
    var dateUtc = new Date();
    var day = dateUtc.getUTCDate();
    var month = dateUtc.getUTCMonth() + 1;
    if ( day < 10 ) { day = "0" + day; }
    if ( month < 10 ) { month = "0" + month; }

    var h = dateUtc.getUTCHours();
    var m = dateUtc.getUTCMinutes();
    var s = dateUtc.getUTCSeconds();

    if ( m < 10 ) { m = "0" + m; }
    if ( h < 10 ) { h = "0" + h; }
    if ( s < 10 ) { s = "0" + s; }

    var timeAwos = h + ":" + m + ":" + s;
    const awosTime = document.getElementById('utcTime');

    if(awosTime) {
        awosTime.textContent = timeAwos;
    }
} setInterval(getDate, 1000);

// load data (updates every 90 seconds)
function loadData(icaoCode, fmisid, qfeSub) {
    loadAtis(icaoCode, fmisid, qfeSub);
    setInterval(function() {
        loadAtis(icaoCode, fmisid, qfeSub);
    }, 90000);
}

// D-ATIS
let dAtis = "ATIS NIL";

// get current ATIS id
function loadAtis(icaoCode, fmisid, qfeSub) {
    const atisIdField = document.getElementById('atisId');
    const runwayField = document.getElementById('activeRunway');
    let atisCode = "";
    let runwayInUse = "//";
    let atisFound = false;
    let atisCallsign = icaoCode + "_ATIS"

    fetch('https://data.vatsim.net/v3/vatsim-data.json')
    .then(response => response.json())
    .then(data => {
        for (let item of data.atis) {
            if (item.callsign === atisCallsign) {
                atisFound = true;
                var atisWithLines = item.text_atis.join(' ');
                let matchId = atisWithLines.match(/INFO\s([A-Z])/);
                let matchIdType2 = atisWithLines.match(/INFORMATION\s([A-Z])/);
                let matchRwy = atisWithLines.match(/RWY (\d{2}) IN USE/);
                let matchRwyType2 = atisWithLines.match(/RUNWAY (\d{2}) IN USE/);

                atisWithLines = atisWithLines.replace(/\.\./g, '.').split('. ');
                makeAtisText(atisWithLines.join('\n'));
                
                if (matchId && matchId[1]) { atisCode = matchId[1] }
                else if (matchIdType2 && matchIdType2[1]) { atisCode = matchIdType2[1] }
                if (matchRwy && matchRwy[1]) { runwayInUse = matchRwy[1] }
                if (matchRwyType2 && matchRwyType2[1]) { runwayInUse = matchRwyType2[1] }
                break;
            }
        }
        if(atisIdField) {
            if(atisFound) {
                atisIdField.textContent = atisCode;
                atisIdField.classList.remove("noAtisHighlight");
            } else {
                atisIdField.textContent = "//";
                atisIdField.classList.add("noAtisHighlight");
            }
        }

        let runwayCheck = parseInt(runwayInUse);

        if (runwayField) {
            // no runway reported
            if (runwayInUse == "//") {
                runwayField.style.fontSize = "10pt";
                runwayField.style.marginTop = "-10px";
                runwayField.textContent = "N/A";
                document.getElementById("activeArrow03").style.display = "none";
                document.getElementById("active03").style.display = "none";
                document.getElementById("active21").style.display = "none";
                document.getElementById("cloudBase1").classList.remove("activeCeilometer");
                document.getElementById("cloudBase2").classList.remove("activeCeilometer");
            }
            // left runway
            else if (runwayCheck >= 1 && runwayCheck <= 17 || runwayCheck == 36) {
                runwayField.style.fontSize = "36pt";
                runwayField.style.marginTop = "10px";
                runwayField.textContent = runwayInUse;
                document.getElementById("activeArrow03").style.display = "block";
                document.getElementById("active03").style.display = "block";
                document.getElementById("activeArrow21").style.display = "none";
                document.getElementById("active21").style.display = "none";
                document.getElementById("cloudBase1").classList.add("activeCeilometer");
                document.getElementById("cloudBase2").classList.remove("activeCeilometer");
            }
            // right runway
            else if (runwayCheck >= 18 && runwayCheck <= 35) {
                runwayField.style.fontSize = "36pt";
                runwayField.style.marginTop = "10px";
                runwayField.textContent = runwayInUse;
                document.getElementById("activeArrow03").style.display = "none";
                document.getElementById("active03").style.display = "none";
                document.getElementById("activeArrow21").style.display = "block";
                document.getElementById("active21").style.display = "block";
                document.getElementById("cloudBase2").classList.add("activeCeilometer");
                document.getElementById("cloudBase1").classList.remove("activeCeilometer");
            }
        }
    })
    .catch(error => console.error('Error:', error));
    loadFMI(icaoCode, fmisid, qfeSub);
}

// make D-ATIS
function makeAtisText(atisText) {
    if (atisText.includes("THIS IS")) {
        atisText = atisText.replace(/THIS IS /g, "");
        atisText = atisText.replace(/(ARRIVAL AND DEPARTURE INFORMATION) (\w)/, "ARR AND DEP INFO $2\n");
        atisText = atisText.replace(/AUTOMATIC REPORT/g, 'AUTOMATIC REPORT\n');
        atisText = atisText.replace(/AT TIME (\d{4})/g, '$1\n');
        atisText = atisText.replace(/EXPECTED/g, 'EXPECTED\n');
        atisText = atisText.replace(/ARRIVAL/g, '\nARR');
        atisText = atisText.replace(/DEPARTURE/g, '\nDEP');
        atisText = atisText.replace(/RUNWAY/g, 'RWY');
        atisText = atisText.replace(/CLEAR AND DRY/g, '');
        atisText = atisText.replace(/TRANSITION LEVEL (\d{2})/g, '\nTRL $1\n');
        atisText = atisText.replace(/TOUCHDOWN ZONE/g, 'TDZ');
        atisText = atisText.replace(/DEGREES/g, 'DEG');
        atisText = atisText.replace(/KNOTS/g, 'KT');
        atisText = atisText.replace(/MAXIMUM/g, 'MAX');
        atisText = atisText.replace(/TEMPERATURE/g, '\nT');
        atisText = atisText.replace(/DEW POINT/g, 'DP');
        atisText = atisText.replace(/QNH (\d{4})/g, 'QNH $1\n');
        atisText = atisText.replace(/ADVISE ON INITIAL CONTACT YOU HAVE INFORMATION/g, '\nACK INFO');
        atisText = atisText.replace(/VERTICAL VISIBILITY/g, '\nVV');
        atisText = atisText.replace(/VISIBILITY/g, '\nVIS');
        atisText = atisText.replace(/CAVOK/g, '\nCAVOK\n');
        atisText = atisText.replace(/BROKEN/g, '\nBKN');
        atisText = atisText.replace(/SCATTERED/g, '\nSCT');
        atisText = atisText.replace(/OVERCAST/g, '\nOVC');
        atisText = atisText.replace(/FEW/g, '\nFEW');
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
        atisText = atisText.replace(/RVR VALUES AVAILABLE ON AIR TRAFFIC CONTROL FREQUENCY/g, '\nRVR VALUES AVBL ON ATC FREQ\n');
        atisText = atisText.replace(/\n /g, '\n');
        atisText = atisText.replace(/(\n\s*)+\n/g, '\n');
        atisText = atisText.replace(/NO CLOUD DETECTED/g, 'NCD');
        atisText = atisText.replace(/TAMPERE-PIRKKALA/g, 'EFTP');
        atisText = atisText.replace(/ROVANIEMI/g, 'EFRO');
        atisText = atisText.replace(/OULU/g, 'EFOU');
        atisText = atisText.replace(/KUOPIO/g, 'EFKU');
        atisText = atisText.replace(/JYVASKYLA/g, 'EFJY');
        atisText = atisText.replace(/TURKU/g, 'EFTU');
    }
    dAtis = atisText;
}

// show D-ATIS alert
document.addEventListener("DOMContentLoaded", function() {
    var atisElement = document.getElementById("atisId");
    atisElement.addEventListener("click", function() {
        alert(dAtis);
    });
});

// load current weather data from FMI
async function loadFMI(icaoCode, fmisid, qfeSub) {
    fmiStoredId = fmisid;
    storedICAO = icaoCode;
    try {
      const response = await fetch(`https://opendata.fmi.fi/wfs?service=WFS&version=2.0.0&request=getFeature&storedquery_id=fmi::observations::weather::simple&fmisid=${fmisid}`);
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      } else {
        const responseText = await response.text();
        const parser = new DOMParser();
        const data = parser.parseFromString(responseText, "application/xml");
        setData(data, icaoCode, qfeSub);
        loadMetar(icaoCode);
        console.log("FMI data loaded at", new Date().toLocaleTimeString());
      }
    } catch (error) {
      console.log('Fetch API error -', error);
    }
}

// load current METAR from FMI
async function loadMetar(icaoCode) {
    try {
        const response = await fetch(`https://opendata.fmi.fi/wfs?service=WFS&version=2.0.0&request=getFeature&storedquery_id=fmi::avi::observations::iwxxm&icaocode=${icaoCode}`);
  
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
        document.getElementById("metarText").innerHTML = "COULD NOT GET DATABASE CONNECTION TO FMI=";
    }
}

// display current weather data from FMI
function setData(xmlDoc, icaoCode, qfeSub) {
    var xmlSize = xmlDoc.getElementsByTagName("BsWfs:ParameterName");
    var table = new Array(xmlSize.length);

    for(var i = 0; i < xmlSize.length; i++) {
        table[i] = new Array(2);
        table[i][0] = xmlDoc.getElementsByTagName("BsWfs:ParameterName")[i].childNodes[0].nodeValue;
        table[i][1] = xmlDoc.getElementsByTagName("BsWfs:ParameterValue")[i].childNodes[0].nodeValue;
    }

    table = table.slice(-15, -1);
    
    let windGust = 0;
    let qnh = 0;
    let qfe = 0;
    let ta = 0;
    let td = 0;
    let wawa = "//";
    let vis = 0;

    for (var i = 0; i < table.length; i++) {
        if (table[i][0] === "p_sea") {
            qnh = (table[i][1]);
            qfe = qnh - qfeSub;
        }
        if (table[i][0] === "ws_10min") {
            windSpeed = table[i][1];
            if (isNaN(windSpeed)) windSpeed = 0;
            windSpeed = Math.round(windSpeed * 1.943);
            // wind calm
            if (windSpeed < 0.9) {
                windSpeed = 0;
                windCalm = true;
            }
        }
        if (table[i][0] === "wd_10min") {
            windDirection = Math.floor(table[i][1] / 10) * 10;
            if (isNaN(windDirection)) windDirection = 360;
            if (windDirection == 0) windDirection = 360;
        }
        if (table[i][0] === "wg_10min") {
            windGust = Math.ceil(table[i][1]) * 1.943;
            if (isNaN(windGust)) windGust = 0;
        }
        if (table[i][0] === "wawa") {
            wawa = table[i][1];
        }
        if (table[i][0] === "t2m") {
            ta = table[i][1];
        }
        if (table[i][0] === "td") {
            td = table[i][1];
        }
        if (table[i][0] === "vis") {
            vis = table[i][1];
        }
    }

    // maximum wind speed
    let gust1 = generateRandomGust(windGust);
    let gust2 = generateRandomGust(windGust);
    let gust3 = generateRandomGust(windGust);

    if (gust1 >= windSpeed + 10) {
        document.getElementById("maxbase").classList.add("maxWindHighlight");
    } else {
        document.getElementById("maxbase").classList.remove("maxWindHighlight");
    }
    if (gust2 >= windSpeed + 10) {
        document.getElementById("maxbase_2").classList.add("maxWindHighlight");
    } else {
        document.getElementById("maxbase_2").classList.remove("maxWindHighlight");
    }
    if (gust3 >= windSpeed + 10) {
        document.getElementById("maxbase_3").classList.add("maxWindHighlight");
    } else {
        document.getElementById("maxbase_3").classList.remove("maxWindHighlight");
    }

    // wind speed
    if (windSpeed > 0 && windSpeed < 10) windSpeed = "0" + windSpeed;

    // qnh
    var qnhParts = qnh.split(".");

    // visibility
    if (vis > 10000) vis = "10 km";
    else if (vis > 4000 && vis <= 10000) {
        vis = Math.round(vis / 1000) * 1000;
        vis = (vis / 1000) + " km";
    }
    else if (vis <= 4000) {
        vis = Math.round(vis / 100) * 100;
        vis = vis + " m"
    }
    else vis = Math.ceil(vis) + " m";

    // wind direction
    const directionArrow1 = document.getElementById('windArrow1');
    const directionArrow2 = document.getElementById('windArrow2');
    const directionArrow3 = document.getElementById('windArrow3');
    if (directionArrow1) {
        directionArrow1.setAttribute('transform', `rotate(${windDirection}, 100.58, 137.99)`);
        directionArrow3.setAttribute('transform', `rotate(${windDirection}, 637.28, 138.04)`);
        directionArrow2.setAttribute('transform', `rotate(${windDirection}, 369.47, 138.00)`);
        directionArrow1.style.display = "block";
        directionArrow2.style.display = "block";
        directionArrow3.style.display = "block";
    }

    let windDirText = windDirection;
    if (windDirText < 100) windDirText = "0" + windDirText;

    // set Data
    const windMaxField1 = document.getElementById('maxwind_1');
    const windMaxField2 = document.getElementById('maxwind_2');
    const windMaxField3 = document.getElementById('maxwind_3');
    const windMnmField1 = document.getElementById('mnmwind_1');
    const windMnmField2 = document.getElementById('mnmwind_2');
    const windMnmField3 = document.getElementById('mnmwind_3');
    const windSpeedField1 = document.getElementById('speed_1');
    const windSpeedField2 = document.getElementById('speed_2');
    const windSpeedField3 = document.getElementById('speed_3');
    const windDirectionField1 = document.getElementById('direction_1');
    const windDirectionField2 = document.getElementById('direction_2');
    const windDirectionField3 = document.getElementById('direction_3');
    // const qnhField = document.getElementById('qnh');
    const qnhDecimalField = document.getElementById('qnhDecimal');
    const qfeField = document.getElementById('qfe');
    // const trlField = document.getElementById('trl');
    const taField = document.getElementById('ta');
    const tdField = document.getElementById('td');
    const wxField = document.getElementById('weather');
    const visField = document.getElementById('visibility');

    if(windMaxField1) {
        windMaxField1.textContent = gust1;
        windMaxField2.textContent = gust2;
        windMaxField3.textContent = gust3;
        windMnmField1.textContent = generateRandomMnmWind();
        windMnmField2.textContent = generateRandomMnmWind();
        windMnmField3.textContent = generateRandomMnmWind();
        windSpeedField1.textContent = windSpeed + " kt";
        windSpeedField2.textContent = windSpeed + " kt";
        windSpeedField3.textContent = windSpeed + " kt";
        windDirectionField1.textContent = windDirText + "°";
        windDirectionField2.textContent = windDirText + "°";
        windDirectionField3.textContent = windDirText + "°";
    }
    //if(qnhField) {
        //EXTRA: qnhField.textContent = qnhParts[0]; 
        // qnhDecimalField.textContent = "." + qnhParts[1]; (delete below)
        // qnhField.textContent = "//";
        // QNH is moved to setMetarData() function due to FMI data problems!
        qnhDecimalField.textContent = "";
        
        qfeField.textContent = (Math.floor(qfe * 10) / 10).toFixed(1);
        // trlField.textContent = calculateTrl(Math.floor(qnh)); (moved)
    //}
    if(taField) {
        taField.textContent = ta;
        tdField.textContent = td;
    }
    if(wxField) {
        setCurrentWx(wawa);
        visField.textContent = vis;
    }
    calculateWindComponents(icaoCode); 
}

function generateRandomGust(gust) {
    gust = Math.round(gust + Math.random() * 3);
    if (gust < 10) gust = "0" + gust;
    return gust;
}

function generateRandomMnmWind() {
    let minSpeed = Math.round(windSpeed - 1 - Math.random() * 2);
    if (minSpeed < 1) minSpeed = "0";
    if (minSpeed > 0 && minSpeed < 10) minSpeed = "0" + minSpeed;
    return minSpeed;
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

// define variable wind direction sector
function createWindSector(windMeter, startAngle, endAngle) {
    let cx = 0;
    let cy = 0;
    let r = 0;

    if (windMeter == "left") {
        cx = 100.58;
        cy = 137.99;
        r = 55.73;
    }
    else if (windMeter == "right") {
        cx = 369.47;
        cy = 138;
        r = 55.53;
    }
    else if (windMeter == "mid") {
        cx = 637.28;
        cy = 138.04;
        r = 55.53;
    }
    
    startAngle = startAngle - 90;
    endAngle = endAngle - 90;
    
    const start = {
        x: cx + r * Math.cos(Math.PI * startAngle / 180),
        y: cy + r * Math.sin(Math.PI * startAngle / 180)
    };
    const end = {
        x: cx + r * Math.cos(Math.PI * endAngle / 180),
        y: cy + r * Math.sin(Math.PI * endAngle / 180)
    };
    const largeArcFlag = (endAngle - startAngle <= 180) ? 0 : 1;
    const d = [
        "M", cx, cy,
        "L", start.x, start.y,
        "A", r, r, 0, largeArcFlag, 1, end.x, end.y,
        "Z"
    ].join(" ");

    return d;
}

// display weather codes
function setCurrentWx(wawa) {
    currentWx = document.getElementById("weather");
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
    else if (wawa == 34) currentWx.textContent = "BCFG";
    else if (wawa == 40) currentWx.textContent = "RA";
    else if (wawa == 41) currentWx.textContent = "- RA";
    else if (wawa == 42) currentWx.textContent = "+RA";
    else if (wawa == 50) currentWx.textContent = "DZ";
    else if (wawa == 51) currentWx.textContent = "-DZ";
    else if (wawa == 52) currentWx.textContent = "DZ";
    else if (wawa == 53) currentWx.textContent = "+DZ";
    else if (wawa == 54) currentWx.textContent = "-FZDZ";
    else if (wawa == 55) currentWx.textContent = "FZDZ";
    else if (wawa == 56) currentWx.textContent = "+FZDZ";
    else if (wawa == 60) currentWx.textContent = "-RA";
    else if (wawa == 61) currentWx.textContent = "-RA";
    else if (wawa == 62) currentWx.textContent = "RA";
    else if (wawa == 63) currentWx.textContent = "+RA";
    else if (wawa == 64) currentWx.textContent = "-FZRA";
    else if (wawa == 65) currentWx.textContent = "FZDZ";
    else if (wawa == 66) currentWx.textContent = "+FZDZ";
    else if (wawa == 67) currentWx.textContent = "-SNRA";
    else if (wawa == 68) currentWx.textContent = "SNRA";
    else if (wawa == 70) currentWx.textContent = "SN";
    else if (wawa == 71) currentWx.textContent = "-SN";
    else if (wawa == 72) currentWx.textContent = "SN";
    else if (wawa == 73) currentWx.textContent = "+SN";
    else if (wawa == 74) currentWx.textContent = "-GS";
    else if (wawa == 75) currentWx.textContent = "GS";
    else if (wawa == 76) currentWx.textContent = "+GS";
    else if (wawa == 77) currentWx.textContent = "SG";
    else if (wawa == 78) currentWx.textContent = "PL";
    else if (wawa == 80) currentWx.textContent = "SHRA";
    else if (wawa == 81) currentWx.textContent = "-SHRA";
    else if (wawa == 82) currentWx.textContent = "SHRA";
    else if (wawa == 83) currentWx.textContent = "+SHRA";
    else if (wawa == 84) currentWx.textContent = "+SHRA";
    else if (wawa == 85) currentWx.textContent = "-SHSN";
    else if (wawa == 86) currentWx.textContent = "SHSN";
    else if (wawa == 87) currentWx.textContent = "+SHSN";
    else if (wawa == 89) currentWx.textContent = "SHGR";
}

// display data from FMI METAR
function setMetarData(xmlDoc) {
    let metars = xmlDoc.getElementsByTagName('avi:input');
    let metar = metars[metars.length-1].childNodes[0].nodeValue;
    let viss = xmlDoc.getElementsByTagName("iwxxm:prevailingVisibility");
    let vis = viss[viss.length-1].childNodes[0].nodeValue;

    // temporary QNH value taken from METAR due to FMI data problems
    const regexQnh = /Q0*([1-9]\d{0,3})/;
    const matchQnh = metar.match(regexQnh);
    const resultQnh = matchQnh ? matchQnh[1] : null;

    const qnhField = document.getElementById('qnh');
    const trlField = document.getElementById('trl');
    
    qnhField.textContent = resultQnh;
    trlField.textContent = calculateTrl(Math.floor(resultQnh));

    let records = xmlDoc.getElementsByTagName("iwxxm:MeteorologicalAerodromeObservationRecord");

    const vrbField1 = document.getElementById("vrb_1");
    const vrbField2 = document.getElementById("vrb_2");
    const vrbField3 = document.getElementById("vrb_3");

    // Variable wind direction
    let latestRecord = records[records.length - 1];
    let counterClockwiseElement = latestRecord.getElementsByTagName("iwxxm:extremeCounterClockwiseWindDirection");
    let clockwiseElement = latestRecord.getElementsByTagName("iwxxm:extremeClockwiseWindDirection");
    
    // if variable wind direction exists in latest METAR
    if (counterClockwiseElement.length > 0) {
        let counterClockwise = counterClockwiseElement[0].childNodes[0].nodeValue;
        let clockwise = clockwiseElement[0].childNodes[0].nodeValue;

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
    
        // write wind vrb data
        if (clockwise == 370) clockwise = 10;
        if (clockwise == 00) clockwise = 350;
        if (counterClockwise == 370) counterClockwise = 10;
        if (counterClockwise == 00) counterClockwise = 360;
        if (counterClockwise < 100) counterClockwise = "0" + counterClockwise;
        if (clockwise < 100) clockwise = "0" + clockwise;

        if (vrbField1) {
            vrbField1.textContent = counterClockwise + " - " + clockwise;
            vrbField2.textContent = counterClockwise + " - " + clockwise;
            vrbField3.textContent = counterClockwise + " - " + clockwise;
            vrbField1.classList.add("variableTextHighlight");
            vrbField2.classList.add("variableTextHighlight");
            vrbField3.classList.add("variableTextHighlight");
            document.getElementById("degreeCircle_1").classList.add("variableHighlight");
            document.getElementById("degreeCircle_2").classList.add("variableHighlight");
            document.getElementById("degreeCircle_3").classList.add("variableHighlight");
        }

        if (clockwise < counterClockwise) counterClockwise = counterClockwise - 360;
        
        // set wind sector background
        let windSectorData03 = createWindSector("left", counterClockwise, clockwise);
        let windSectorDataMid = createWindSector("mid", counterClockwise, clockwise);
        let windSectorData21 = createWindSector("right", counterClockwise, clockwise);
        const pathElement03 = document.getElementById('degreeCircle_1');
        const pathElementMid = document.getElementById('degreeCircle_2');
        const pathElement21 = document.getElementById('degreeCircle_3');

        if (pathElement03) {
            pathElement03.setAttribute('d', windSectorData03);
            pathElementMid.setAttribute('d', windSectorDataMid);
            pathElement21.setAttribute('d', windSectorData21);
        }
    }
    // Random variable direction
    else {
        if (vrbField1) {
            let randomVrb1 = randomVrb();
            let randomVrb2 = randomVrb();
            let randomVrb3 = randomVrb();

            let windSectorData03 = createWindSector("left", randomVrb1[0], randomVrb1[1]);
            let windSectorDataMid = createWindSector("mid", randomVrb2[0], randomVrb2[1]);
            let windSectorData21 = createWindSector("right", randomVrb3[0], randomVrb3[1]);
            const pathElement03 = document.getElementById('degreeCircle_1');
            const pathElementMid = document.getElementById('degreeCircle_2');
            const pathElement21 = document.getElementById('degreeCircle_3');

            if (pathElement03) {
                pathElement03.setAttribute('d', windSectorData03);
                pathElementMid.setAttribute('d', windSectorDataMid);
                pathElement21.setAttribute('d', windSectorData21);
            }

            if (randomVrb1[1] > 360) {
                randomVrb1[1] -= 360;
                if (randomVrb1[1] < 100) randomVrb1[1] = "0" + randomVrb1[1];
            }
            if (randomVrb2[1] > 360) {
                randomVrb2[1] -= 360;
                if (randomVrb2[1] < 100) randomVrb2[1] = "0" + randomVrb2[1];
            }
            if (randomVrb3[1] > 360) {
                randomVrb3[1] -= 360;
                if (randomVrb3[1] < 100) randomVrb3[1] = "0" + randomVrb3[1];
            }

            vrbField1.textContent = randomVrb1[0] + " - " + randomVrb1[1];
            vrbField2.textContent = randomVrb2[0] + " - " + randomVrb2[1];
            vrbField3.textContent = randomVrb3[0] + " - " + randomVrb3[1];
            vrbField1.classList.remove("variableTextHighlight");
            vrbField2.classList.remove("variableTextHighlight");
            vrbField3.classList.remove("variableTextHighlight");

            document.getElementById("degreeCircle_1").classList.remove("variableHighlight");
            document.getElementById("degreeCircle_2").classList.remove("variableHighlight");
            document.getElementById("degreeCircle_3").classList.remove("variableHighlight");
        }
    }

    const metarField = document.getElementById("metarText");
    const tsField = document.getElementById("ts");
    const cbField = document.getElementById("cb");
    const metCondField = document.getElementById("metCond");

    if(metarField) {
        metarField.textContent = metar;
    }

    // VRB wind
    const windDirectionField1 = document.getElementById('direction_1');
    const windDirectionField2 = document.getElementById('direction_2');
    const windDirectionField3 = document.getElementById('direction_3');

    if (metar.includes("VRB")) {
        if(windDirectionField1) { 
            windDirectionField1.textContent = "VRB";
            windDirectionField2.textContent = "VRB";
            windDirectionField3.textContent = "VRB";
            vrbField1.textContent = "";
            vrbField2.textContent = "";
            vrbField3.textContent = "";
            
            const pathElement03 = document.getElementById('degreeCircle_1');
            const pathElementMid = document.getElementById('degreeCircle_2');
            const pathElement21 = document.getElementById('degreeCircle_3');

            pathElement03.classList.remove("variableHighlight");
            pathElementMid.classList.remove("variableHighlight");
            pathElement21.classList.remove("variableHighlight");

            let windSectorData03 = createWindSector("left", 0.1, 360);
            let windSectorDataMid = createWindSector("mid", 0.1, 360);
            let windSectorData21 = createWindSector("right", 0.1, 360);
            
            if (pathElement03) {
                pathElement03.setAttribute('d', windSectorData03);
                pathElementMid.setAttribute('d', windSectorDataMid);
                pathElement21.setAttribute('d', windSectorData21);
            }
        }
    }

    // wind calm
    const windDSpeedField1 = document.getElementById('speed_1');
    const windDSpeedField2 = document.getElementById('speed_2');
    const windDSpeedField3 = document.getElementById('speed_3');

    if(windDSpeedField1) { 
        if (windCalm) {
            windDSpeedField1.textContent = "";
            windDSpeedField2.textContent = "";
            windDSpeedField3.textContent = "";
            windDirectionField1.textContent = "";
            windDirectionField2.textContent = "";
            windDirectionField3.textContent = "";
            vrbField1.textContent = "CALM";
            vrbField2.textContent = "CALM";
            vrbField3.textContent = "CALM";
            vrbField1.classList.add("variableTextHighlight");
            vrbField2.classList.add("variableTextHighlight");
            vrbField3.classList.add("variableTextHighlight");
            vrbField1.style.fontSize = "16px";
            vrbField2.style.fontSize = "16px";
            vrbField3.style.fontSize = "16px";
            vrbField1.style.fontWeight = "bold";
            vrbField2.style.fontWeight = "bold";
            vrbField3.style.fontWeight = "bold";

            const pathElement03 = document.getElementById('degreeCircle_1');
            const pathElementMid = document.getElementById('degreeCircle_2');
            const pathElement21 = document.getElementById('degreeCircle_3');

            pathElement03.classList.remove("variableHighlight");
            pathElementMid.classList.remove("variableHighlight");
            pathElement21.classList.remove("variableHighlight");

            let windSectorData03 = createWindSector("left", 0.1, 360);
            let windSectorDataMid = createWindSector("mid", 0.1, 360);
            let windSectorData21 = createWindSector("right", 0.1, 360);
            
            if (pathElement03) {
                pathElement03.setAttribute('d', windSectorData03);
                pathElementMid.setAttribute('d', windSectorDataMid);
                pathElement21.setAttribute('d', windSectorData21);
            }
        }
        else {
            vrbField1.style.fontSize = "13px";
            vrbField2.style.fontSize = "13px";
            vrbField3.style.fontSize = "13px";
            vrbField1.style.fontWeight = "normal";
            vrbField2.style.fontWeight = "normal";
            vrbField3.style.fontWeight = "normal";
        }
    }

    // TS indicator (thunderstorm)
    if(tsField) { 
        if (metar.includes("VCTS")) {
            tsField.textContent = "VCTS";
            document.getElementById("tsBackground").classList.add("topMenuHighlight");
            document.getElementById("weather").textContent = "-SHRA VCTS";
        } else if (metar.includes("TS")) {
            tsField.textContent = "TS";
            document.getElementById("tsBackground").classList.add("topMenuHighlight");
            document.getElementById("weather").textContent = "SHRA TS";
        } else {
            tsField.textContent = "";
            document.getElementById("tsBackground").classList.remove("topMenuHighlight");
        }
    }

    // CB indicator (cumulus)
    if(cbField) {
        if (metar.includes("CB")) {
            cbField.textContent = "CB";
            document.getElementById("cbBackground").classList.add("topMenuHighlight");
            cbState = [[fiveMinutesAgo, 2], [currentTime, 2]];
        } else {
            cbField.textContent = "";
            document.getElementById("cbBackground").classList.remove("topMenuHighlight");
            cbState = [[fiveMinutesAgo, 1], [currentTime, 1]];
        }
    }

    // METCOND indicator
    if (vis < 5000 && vis > 10 || metar.match(/\W*(BKN00)/g) || metar.match(/\W*(OVC00)/g) || metar.match(" VV")){
        if(metCondField) { metCondField.textContent = "IMC" }
    } else {
        if(metCondField) { metCondField.textContent = "VMC" }
    }

    // RVR indicators
    let rvrPattern = metar.match(/R\d{2}\/[A-Za-z]?(\d+)/);
    let rvr = rvrPattern ? rvrPattern[1] : null;

    if (rvr !== null) {
        let randomRVR = rvrRandomizator(rvr);
        document.getElementById("rvr1").textContent = randomRVR[0];
        document.getElementById("rvr2").textContent = randomRVR[1];
        document.getElementById("rvr3").textContent = randomRVR[2];
    }
    if (rvr == null) {
        document.getElementById("rvr1").textContent = "ABV 2000";
        document.getElementById("rvr2").textContent = "ABV 2000";
        document.getElementById("rvr3").textContent = "ABV 2000";
    }

    // Ceilometers
    const cloudBase1Field = document.getElementById('cloudBase1');
    const cloudBase2Field = document.getElementById('cloudBase2');
    const elementIds = [
        'cloudCoverage1', 'cloudType1', 'cloudAlt1',
        'cloudCoverage2', 'cloudType2', 'cloudAlt2',
        'cloucloudCoverage3', 'cloudType3', 'cloudAlt3',
        'cloudCoverage1_1', 'cloudType1_1', 'cloudAlt1_1',
        'cloudCoverage2_1', 'cloudType2_1', 'cloudAlt2_1',
        'cloudCoverage3_1', 'cloudType3_1', 'cloudAlt3_1'
    ];

    if (metar.includes("CAVOK")) {
        
        elementIds.forEach(id => {
            const element = document.getElementById(id);
            if (element) {
                if (id === 'cloudType1' || id === 'cloudType1_1') {
                    element.textContent = "NCD";
                } else if (id === 'cloudAlt1' || id === 'cloudAlt1_1') {
                    element.textContent = "-- ft";
                } else {
                    element.textContent = "";
                }
            }
        });
        if (cloudBase1Field) cloudBase1Field.setAttribute('height', '22.66');
        if (cloudBase2Field) cloudBase2Field.setAttribute('height', '22.66');
    } 
    else {
        // vertical visibility (VV)
        const regex = /VV(\d{3})/;
        const matchVV = metar.match(regex);
        let digits;

        if (matchVV) {
            digits = matchVV[1];
            digits = parseInt(digits, 10) * 100;

            elementIds.forEach(id => {
                const element = document.getElementById(id);
                if (element) {
                    if (id === 'cloudType1' || id === 'cloudType1_1') {
                        element.textContent = "VV";
                    } else if (id === 'cloudAlt1' || id === 'cloudAlt1_1') {
                        element.textContent = digits + " ft";
                    } else if (id === 'cloudCoverage1' || id === 'cloudCoverage1_1') {
                        element.textContent = "9/8";
                    } else {
                        element.textContent = "";
                    }
                }
            });
            if (cloudBase1Field) cloudBase1Field.setAttribute('height', '22.66');
            if (cloudBase2Field) cloudBase2Field.setAttribute('height', '22.66');
        }
        else {
            // cloud layers (FEW, SCT, BKN, OVC)
            var matchClouds = metar.match(/ (FEW|SCT|BKN|OVC)\d{3}/g) || [];

            // Initialize variables
            var cloudType1 = "";
            var cloudType2 = "";
            var cloudType3 = "";
            var cloudAlt1 = "";
            var cloudAlt2 = "";
            var cloudAlt3 = "";

            // Extract clouds from METAR
            if (matchClouds.length > 0) { // layer 1
                cloudType1 = matchClouds[0].trim().substring(0,3);
                cloudAlt1 = parseInt(matchClouds[0].trim().substring(3,6)) * 100;

                document.getElementById("cloudType1").textContent = cloudType1;
                document.getElementById("cloudType1_1").textContent = cloudType1;
                document.getElementById("cloudAlt1").textContent = cloudAlt1 + " ft";
                document.getElementById("cloudAlt1_1").textContent = cloudAlt1 + " ft";
                document.getElementById("cloudCoverage1").textContent = checkCloudCoverage(cloudType1);
                document.getElementById("cloudCoverage1_1").textContent = checkCloudCoverage(cloudType1);
                if (cloudBase1Field) cloudBase1Field.setAttribute('height', '22.66');
                if (cloudBase2Field) cloudBase2Field.setAttribute('height', '22.66');
            }

            if (matchClouds.length > 1) { // layer 2
                cloudType2 = matchClouds[1].trim().substring(0,3);
                cloudAlt2 = parseInt(matchClouds[1].trim().substring(3,6)) * 100;
                document.getElementById("cloudType2").textContent = cloudType2;
                document.getElementById("cloudType2_1").textContent = cloudType2;
                document.getElementById("cloudAlt2").textContent = cloudAlt2 + " ft";
                document.getElementById("cloudAlt2_1").textContent = cloudAlt2 + " ft";
                document.getElementById("cloudCoverage2").textContent = checkCloudCoverage(cloudType2);
                document.getElementById("cloudCoverage2_1").textContent = checkCloudCoverage(cloudType2);
                if (cloudBase1Field) cloudBase1Field.setAttribute('height', '45.32');
                if (cloudBase2Field) cloudBase2Field.setAttribute('height', '45.32');
            }

            if (matchClouds.length > 2) { // layer 3
                cloudType3 = matchClouds[2].trim().substring(0,3);
                cloudAlt3 = parseInt(matchClouds[2].trim().substring(3,6)) * 100;
                document.getElementById("cloudType3").textContent = cloudType3;
                document.getElementById("cloudType3_1").textContent = cloudType3;
                document.getElementById("cloudAlt3").textContent = cloudAlt3 + " ft";
                document.getElementById("cloudAlt3_1").textContent = cloudAlt3 + " ft";
                document.getElementById("cloudCoverage3").textContent = checkCloudCoverage(cloudType3);
                document.getElementById("cloudCoverage3_1").textContent = checkCloudCoverage(cloudType3);
                if (cloudBase1Field) cloudBase1Field.setAttribute('height', '67.98');
                if (cloudBase2Field) cloudBase2Field.setAttribute('height', '67.98');
            }

            // no clouds
            if (matchClouds.length == 0) {
                elementIds.forEach(id => {
                    const element = document.getElementById(id);
                    if (element) {
                        if (id === 'cloudType1' || id === 'cloudType1_1') {
                            element.textContent = "NCD";
                        } else if (id === 'cloudAlt1' || id === 'cloudAlt1_1') {
                            element.textContent = "-- ft";
                        } else {
                            element.textContent = "";
                        }
                    }
                });
                if (cloudBase1Field) cloudBase1Field.setAttribute('height', '22.66');
                if (cloudBase2Field) cloudBase2Field.setAttribute('height', '22.66');
            }
        }
    }
}

function checkCloudCoverage(cloudType) {
    if (cloudType == "FEW") {
        return "1/8";
    } else if (cloudType == "SCT") {
        return "3/8";
    } else if (cloudType == "BKN") {
        return "6/8";
    } else if (cloudType == "OVC") {
        return "8/8";
    }
    return "";
}

function randomVrb() {
    // creating offset between 10 and 30 degrees
    let randomOffset = Math.floor(Math.random() * 21) + 10;
    randomOffset = Math.round(randomOffset / 10) * 10;
    // applying offset to current wind direction
    let randomCounterClockwise = windDirection - randomOffset;
    let randomClockwise = windDirection + randomOffset;

    if (randomCounterClockwise <= 0) randomCounterClockwise += 360;
    if (randomClockwise <= 0) randomClockwise += 360;
    if (randomCounterClockwise < 100) randomCounterClockwise = "0" + randomCounterClockwise;
    if (randomClockwise < 100) randomClockwise = "0" + randomClockwise;
    
    return [randomCounterClockwise, randomClockwise];
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

// runway crosswind and tailwind components
function calculateWindComponents(icaoCode) {
    const crossWindField03 = document.getElementById("crosswind_1");
    const crossWindField21 = document.getElementById("crosswind_2");
    const tailWindField03 = document.getElementById("tailwind_1");
    const tailWindField21 = document.getElementById("tailwind_2");
    let ifStatement = false;

    const runwayDirections = {
        EFET: [35, 215],
        EFHA: [86, 266],
        EFIV: [47, 227],
        EFJO: [110, 290],
        EFJY: [134, 314],
        EFKE: [8, 188],
        EFKI: [80, 260],
        EFKK: [11, 191],
        EFKS: [132, 312],
        EFKT: [166, 346],
        EFKU: [157, 337],
        EFLP: [67, 247],
        EFMA: [23, 203],
        EFOU: [121, 301],
        EFPO: [126, 306],
        EFRO: [37, 217],
        EFSA: [126, 306],
        EFSI: [136, 316],
        EFTP: [64, 244],
        EFTU: [85, 265],
        EFUT: [78, 258],
        EFVA: [163, 343]
    };

    if (runwayDirections[icaoCode]) {
        // calculate wind components
        let runwayDirection = runwayDirections[icaoCode][0];
        let runwayDirection2 = runwayDirections[icaoCode][1];

        let lowerBound = (runwayDirections[icaoCode][0] - 90 + 360) % 360;
        let upperBound = (runwayDirections[icaoCode][0] + 90) % 360;

        if (lowerBound > upperBound) {
            ifStatement = windDirection >= lowerBound || windDirection <= upperBound;
        } else {
            ifStatement = windDirection >= lowerBound && windDirection <= upperBound;
        }        

        // crosswind component
        let crosswind = Math.round(windSpeed * (Math.sin((runwayDirection - windDirection) * Math.PI / 180)));
        crosswind = Math.abs(crosswind);
        if (crosswind < 10 && crosswind > 0) crosswind = "0" + crosswind;
        else if (crosswind == 0) crosswind = "0";

        crossWindField03.textContent = crosswind;
        crossWindField21.textContent = crosswind;

        // Tailwind for second runway
        if (ifStatement){ 
            let tailwind = Math.round(windSpeed * (Math.cos((runwayDirection - windDirection) * Math.PI / 180)));
            tailwind = Math.abs(tailwind);
            if (tailwind < 10 && tailwind > 0) tailwind = "0" + tailwind;
            else if (tailwind == 0) tailwind = "0";
            
            tailWindField03.textContent = "";
            tailWindField21.textContent = tailwind; 
        }
        // Tailwind for first runway
        else { 
            let tailwind = Math.round(windSpeed * (Math.cos((runwayDirection2 - windDirection) * Math.PI / 180)));
            tailwind = Math.abs(tailwind);
            if (tailwind < 10 && tailwind > 0) tailwind = "0" + tailwind;
            if (tailwind == 0) tailwind = "0";

            tailWindField03.textContent = tailwind;
            tailWindField21.textContent = "";
        }
    } else {
        // ICAO code not found
        crossWindField03.textContent = "//";
        crossWindField21.textContent = "//";
        tailWindField03.textContent = "//";
        tailWindField21.textContent = "//";
    }
}

// navigation function
function performAction(value) {
    switch (value.toLowerCase()) {
        case "efet":
            window.location.href = "efet.html";
            break;
        case "efha":
            window.location.href = "efha.html";
            break;
        case "efiv":
            window.location.href = "efiv.html";
            break;
        case "efjo":
            window.location.href = "efjo.html";
            break;
        case "efjy":
            window.location.href = "efjy.html";
            break;
        case "efki":
            window.location.href = "efki.html";
            break;
        case "efke":
            window.location.href = "efke.html";
            break;
        case "efkt":
            window.location.href = "efkt.html";
            break;
        case "efkk":
            window.location.href = "efkk.html";
            break;
        case "efku":
            window.location.href = "efku.html";
            break;
        case "efks":
            window.location.href = "efks.html";
            break;
        case "eflp":
            window.location.href = "eflp.html";
            break;
        case "efma":
            window.location.href = "efma.html";
            break;
        case "efmi":
            window.location.href = "efmi.html";
            break;
        case "efou":
            window.location.href = "efou.html";
            break;
        case "efpo":
            window.location.href = "efpo.html";
            break;
        case "efro":
            window.location.href = "efro.html";
            break;
        case "efsa":
            window.location.href = "efsa.html";
            break;
        case "efsi":
            window.location.href = "efsi.html";
            break;
        case "eftp":
            window.location.href = "eftp.html";
            break;
        case "eftu":
            window.location.href = "eftu.html";
            break;
        case "efut":
            window.location.href = "efut.html";
            break;
        case "efva":
            window.location.href = "efva.html";
            break;
        case "efhk":
            window.location.href = "../index.html";
            break;
        default:
            break;
    }
}

function compassPressed(rotationAngle, icaoCode) {
    const compassDiv = document.getElementById('compassDiv');

    if (compassDiv.getAttribute('data-state') === 'off') { // north-up true
        
        compassDiv.setAttribute('data-state', 'on');

        // Rotating the SVG background
        let backgroundElement = document.getElementById('backgroundImage');
        backgroundElement.style.transformOrigin = "42% 50%";
        backgroundElement.style.transform = `rotate(${rotationAngle}deg)`;

        // Counter-rotating taxiway text    
        let textWrappers = document.querySelectorAll('.textWrapper');
        textWrappers.forEach(wrapper => {
            let bbox = wrapper.getBBox();
            let cx = bbox.x + bbox.width/2;
            let cy = bbox.y + bbox.height/2;
            let transformStr = `rotate(${-rotationAngle} ${cx} ${cy})`;
            wrapper.setAttribute('transform', transformStr); 
        });

        // Rotating the compass back to north up
        compassDiv.style.transform = `rotate(0deg)`;

        // airport-specific adjustments
        rotateAirport(icaoCode);

    } else location.reload(); // north-up false
}

function rotateAirport(icaoCode) {
    if (icaoCode == "EFRO") {
        document.getElementById('windmeter03').style.transform = "translate(0, 400px)";
        document.getElementById('windmeterMid').style.transform = "translate(-210px, 190px)";
        document.getElementById('windmeter21').style.transform = "translate(-390px, -20px)";        
        document.getElementById('ceilometer1').style.transform = "translate(440px, 40px)";
        document.getElementById('ceilometer2').style.transform = "translate(10px, -240px)";
        document.getElementById('weatherBoxGroup').style.transform = "translate(160px, -120px)";
        document.getElementById('rvrLeftGroup').style.transform = "translate(86px, 110px)";
        document.getElementById('rvrMidGroup').style.transform = "translate(30px, 24px)";
        document.getElementById('rvrRightGroup').style.transform = "translate(-10px, -90px)";
    }
    else if (icaoCode == "EFET") {
        document.getElementById('windmeter21').style.transform = "translate(-390px, 0)";
        document.getElementById('ceilometer2').style.transform = "translate(10px, -240px)";
        document.getElementById('weatherBoxGroup').style.transform = "translate(160px, -90px)";
        document.getElementById('rvrRightGroup').style.transform = "translate(-30px, -90px)";
    }
    else if (icaoCode == "EFHA") {
        document.getElementById('rvrLeftGroup').style.transform = "translate(0, 14px)";
        document.getElementById('rvrRightGroup').style.transform = "translate(0, -8px)";
    }
    else if (icaoCode == "EFIV") {
        document.getElementById('windmeter21').style.transform = "translate(-300px, -20px)";
        document.getElementById('windmeterMid').style.transform = "translate(-210px, 190px)";
        document.getElementById('windmeter03').style.transform = "translate(-20px, 400px)";
        document.getElementById('ceilometer1').style.transform = "translate(300px, 40px)";
        document.getElementById('ceilometer2').style.transform = "translate(80px, -440px)";
        document.getElementById('weatherBoxGroup').style.transform = "translate(220px, -60px)";
        document.getElementById('rvrMidGroup').style.transform = "translate(-10px, 0px)";
        document.getElementById('rvrLeftGroup').style.transform = "translate(60px, 100px)";
        document.getElementById('rvrRightGroup').style.transform = "translate(-40px, -90px)";
    }
    else if (icaoCode == "EFJO") {
        document.getElementById('windmeter21').style.transform = "translate(100px, 100px)";
        document.getElementById('windmeter03').style.transform = "translate(10px, -20px)";
        document.getElementById('ceilometer1').style.transform = "translate(0, -80px)";
        document.getElementById('ceilometer2').style.transform = "translate(0, 0)";
        document.getElementById('weatherBoxGroup').style.transform = "translate(-50px, -340px)";
        document.getElementById('rvrLeftGroup').style.transform = "translate(0, -40px)";
        document.getElementById('rvrRightGroup').style.transform = "translate(0, 50px)";
    }
    else if (icaoCode == "EFJY") {
        document.getElementById('windmeter21').style.transform = "translate(100px, 230px)";
        document.getElementById('windmeter03').style.transform = "translate(-20px, 300px)";
        document.getElementById('ceilometer1').style.transform = "translate(-30px, -450px)";
        document.getElementById('ceilometer2').style.transform = "translate(80px, 20px)";
        document.getElementById('weatherBoxGroup').style.transform = "translate(20px, -400px)";
        document.getElementById('rvrLeftGroup').style.transform = "translate(10px, -110px)";
        document.getElementById('rvrMidGroup').style.transform = "translate(-20px, -20px)";
        document.getElementById('rvrRightGroup').style.transform = "translate(-70px, 55px)";
    }
    else if (icaoCode == "EFKI") {
        document.getElementById('rvrLeftGroup').style.transform = "translate(10px, 28px)";
        document.getElementById('rvrRightGroup').style.transform = "translate(0, -15px)";
    }
    else if (icaoCode == "EFKE") {
        document.getElementById('windmeter21').style.transform = "translate(-390px, -20px)";
        document.getElementById('windmeterMid').style.transform = "translate(-210px, 190px)";
        document.getElementById('windmeter03').style.transform = "translate(0, 400px)";
        document.getElementById('ceilometer1').style.transform = "translate(500px, 40px)";
        document.getElementById('ceilometer2').style.transform = "translate(0, -400px)";
        document.getElementById('weatherBoxGroup').style.transform = "translate(240px, -200px)";
        document.getElementById('rvrMidGroup').style.transform = "translate(50px, -20px)";
        document.getElementById('rvrLeftGroup').style.transform = "translate(160px, 100px)";
        document.getElementById('rvrRightGroup').style.transform = "translate(-56px, -150px)";
    }
    else if (icaoCode == "EFKT") {
        document.getElementById('windmeter21').style.transform = "translate(-535px, 340px)";
        document.getElementById('windmeter03').style.transform = "translate(0, 0)";
        document.getElementById('ceilometer1').style.transform = "translate(440px, -430px)";
        document.getElementById('ceilometer2').style.transform = "translate(0, 0)";
        document.getElementById('weatherBoxGroup').style.transform = "translate(180px, -250px)";
        document.getElementById('rvrMidGroup').style.transform = "translate(-28px, -20px)";
        document.getElementById('rvrLeftGroup').style.transform = "translate(70px, -130px)";
        document.getElementById('rvrRightGroup').style.transform = "translate(-130px, 80px)";
    }
    else if (icaoCode == "EFKK") {
        document.getElementById('windmeter03').style.transform = "translate(30px, 340px)";
        document.getElementById('windmeter21').style.transform = "translate(-500px, 0)";
        document.getElementById('ceilometer1').style.transform = "translate(500px, 0)";
        document.getElementById('ceilometer2').style.transform = "translate(0, -420px)";
        document.getElementById('weatherBoxGroup').style.transform = "translate(200px, -220px)";
        document.getElementById('rvrLeftGroup').style.transform = "translate(152px, 100px)";
        document.getElementById('rvrRightGroup').style.transform = "translate(-45px, -170px)";
    }
    else if (icaoCode == "EFKS") {
        document.getElementById('windmeter03').style.transform = "translate(300px, 0)";
        document.getElementById('windmeter21').style.transform = "translate(0, 210px)";
        document.getElementById('ceilometer1').style.transform = "translate(-20px, -220px)";
        document.getElementById('ceilometer2').style.transform = "translate(-300px, 20px)";
        document.getElementById('weatherBoxGroup').style.transform = "translate(-320px, -90px)";
        document.getElementById('rvrLeftGroup').style.transform = "translate(40px, -70px)";
        document.getElementById('rvrRightGroup').style.transform = "translate(-40px, 80px)";
    }
    else if (icaoCode == "EFKU") {
        document.getElementById('windmeter03').style.transform = "translate(440px, -20px)";
        document.getElementById('windmeterMid').style.transform = "translate(250px, 190px)";
        document.getElementById('windmeter21').style.transform = "translate(50px, 400px)";
        document.getElementById('ceilometer1').style.transform = "translate(-30px, -340px)";
        document.getElementById('ceilometer2').style.transform = "translate(-500px, 20px)";
        document.getElementById('weatherBoxGroup').style.transform = "translate(-360px, -170px)";
        document.getElementById('rvrLeftGroup').style.transform = "translate(70px, -100px)";
        document.getElementById('rvrMidGroup').style.transform = "translate(-14px, 0)";
        document.getElementById('rvrRightGroup').style.transform = "translate(-95px, 95px)";
    }
    else if (icaoCode == "EFLP") {
        document.getElementById('windmeter03').style.transform = "translate(0, 0)";
        document.getElementById('windmeter21').style.transform = "translate(-200px, 0)";
        document.getElementById('ceilometer1').style.transform = "translate(0, 20px)";
        document.getElementById('ceilometer2').style.transform = "translate(0, 0)";
        document.getElementById('weatherBoxGroup').style.transform = "translate(-80px, 0)";
        document.getElementById('rvrLeftGroup').style.transform = "translate(36px, 55px)";
        document.getElementById('rvrMidGroup').style.transform = "translate(30px, 5px)";
        document.getElementById('rvrRightGroup').style.transform = "translate(20px, -45px)";
    }
    else if (icaoCode == "EFMA") {
        document.getElementById('windmeter03').style.transform = "translate(0px, 280px)";
        document.getElementById('windmeter21').style.transform = "translate(-400px, 0px)";
        document.getElementById('ceilometer1').style.transform = "translate(500px, 0)";
        document.getElementById('ceilometer2').style.transform = "translate(90px, -380px)";
        document.getElementById('weatherBoxGroup').style.transform = "translate(280px, -200px)";
        document.getElementById('rvrLeftGroup').style.transform = "translate(125px, 120px)";
        document.getElementById('rvrMidGroup').style.transform = "translate(60px, -25px)";
        document.getElementById('rvrRightGroup').style.transform = "translate(-5px, -170px)";
    }
    else if (icaoCode == "EFMI") {
        document.getElementById('rvrLeftGroup').style.transform = "translate(20px, -35px)";
    }
    else if (icaoCode == "EFOU") {
        document.getElementById('windmeter03').style.transform = "translate(230px, -24px)";
        document.getElementById('windmeterMid').style.transform = "translate(165px, 40px)";
        document.getElementById('windmeter21').style.transform = "translate(100px, 200px)";
        document.getElementById('ceilometer1').style.transform = "translate(-20px, -100px)";
        document.getElementById('ceilometer2').style.transform = "translate(80px, 30px)";
        document.getElementById('weatherBoxGroup').style.transform = "translate(-160px, 0)";
        document.getElementById('rvrLeftGroup').style.transform = "translate(0, -67px)";
        document.getElementById('rvrMidGroup').style.transform = "translate(-20px, 0)";
        document.getElementById('rvrRightGroup').style.transform = "translate(-20px, 70px)";
    }
    else if (icaoCode == "EFPO") {
        document.getElementById('windmeter03').style.transform = "translate(350px, 0)";
        document.getElementById('windmeter21').style.transform = "translate(80px, 170px)";
        document.getElementById('ceilometer1').style.transform = "translate(-30px, -140px)";
        document.getElementById('ceilometer2').style.transform = "translate(80px, 0)";
        document.getElementById('weatherBoxGroup').style.transform = "translate(-200px, 0)";
        document.getElementById('rvrLeftGroup').style.transform = "translate(0, -78px)";
        document.getElementById('rvrRightGroup').style.transform = "translate(-20px, 85px)";
    }
    else if (icaoCode == "EFSA") {
        document.getElementById('windmeter03').style.transform = "translate(280px, 0)";
        document.getElementById('windmeter21').style.transform = "translate(90px, 200px)";
        document.getElementById('ceilometer1').style.transform = "translate(-20px, -150px)";
        document.getElementById('ceilometer2').style.transform = "translate(80px, 30px)";
        document.getElementById('weatherBoxGroup').style.transform = "translate(-160px, 0)";
        document.getElementById('rvrLeftGroup').style.transform = "translate(5px, -67px)";
        document.getElementById('rvrMidGroup').style.transform = "translate(-20px, 0)";
        document.getElementById('rvrRightGroup').style.transform = "translate(-40px, 70px)";
    }
    else if (icaoCode == "EFSI") {
        document.getElementById('windmeter03').style.transform = "translate(350px, 0)";
        document.getElementById('windmeter21').style.transform = "translate(70px, 230px)";
        document.getElementById('ceilometer1').style.transform = "translate(-30px, -260px)";
        document.getElementById('ceilometer2').style.transform = "translate(-320px, 30px)";
        document.getElementById('weatherBoxGroup').style.transform = "translate(-340px, -100px)";
        document.getElementById('rvrLeftGroup').style.transform = "translate(20px, -90px)";
        document.getElementById('rvrRightGroup').style.transform = "translate(-70px, 70px)";
    }
    else if (icaoCode == "EFTP") {
        document.getElementById('windmeter03').style.transform = "translate(-20px, 120px)";
        document.getElementById('windmeter21').style.transform = "translate(-270px, -20px)";
        document.getElementById('ceilometer1').style.transform = "translate(250px, 40px)";
        document.getElementById('ceilometer2').style.transform = "translate(90px, -440px)";
        document.getElementById('weatherBoxGroup').style.transform = "translate(200px, -50px)";
        document.getElementById('rvrLeftGroup').style.transform = "translate(30px, 65px)";
        document.getElementById('rvrMidGroup').style.transform = "translate(30px, 5px)";
        document.getElementById('rvrRightGroup').style.transform = "translate(10px, -48px)";
    }
    else if (icaoCode == "EFTU") {
        document.getElementById('rvrLeftGroup').style.transform = "translate(0, 15px)";
        document.getElementById('rvrMidGroup').style.transform = "translate(0, 5px)";
        document.getElementById('rvrRightGroup').style.transform = "translate(0, -8px)";
    }
    else if (icaoCode == "EFUT") {
        document.getElementById('windmeter03').style.transform = "translate(0, 30px)";
        document.getElementById('windmeter21').style.transform = "translate(0, -10px)";
        document.getElementById('ceilometer1').style.transform = "translate(-20px, 36px)";
        document.getElementById('ceilometer2').style.transform = "translate(20px, -50px)";
        document.getElementById('rvrLeftGroup').style.transform = "translate(26px, 30px)";
        document.getElementById('rvrRightGroup').style.transform = "translate(0, -18px)";
    }
    else if (icaoCode == "EFVA") {
        document.getElementById('windmeter03').style.transform = "translate(0, 0)";
        document.getElementById('windmeter21').style.transform = "translate(-500px, 370px)";
        document.getElementById('ceilometer1').style.transform = "translate(450px, -370px)";
        document.getElementById('ceilometer2').style.transform = "translate(0, 0)";
        document.getElementById('weatherBoxGroup').style.transform = "translate(140px, -200px)";
        document.getElementById('rvrLeftGroup').style.transform = "translate(70px, -140px)";
        document.getElementById('rvrMidGroup').style.transform = "translate(-20px, -20px)";
        document.getElementById('rvrRightGroup').style.transform = "translate(-105px, 105px)";
    }
}

document.addEventListener('DOMContentLoaded', function() {
    // light/dark mode theme toggle
    const themeToggleButton = document.getElementById('mode');
    const themeStylesheet = document.getElementById('theme-stylesheet');
        
    // Load theme from URL or local storage
    // Default = dark mode
    let currentTheme = getThemeFromUrl() || localStorage.getItem('theme') || 'dark';

    // Apply the loaded theme
    applyTheme();

    themeToggleButton.addEventListener('click', function() {
        // Toggle the theme
        currentTheme = currentTheme === 'dark' ? 'light' : 'dark';
        if (currentTheme == "dark") themeToggleButton.textContent = "To light mode";
        if (currentTheme == "light") themeToggleButton.textContent = "To dark mode";
        
        localStorage.setItem('theme', currentTheme);
        applyTheme();

        // Update the URL to reflect the theme without reloading the page
        const newUrl = `${window.location.pathname}?theme=${currentTheme}`;
        history.replaceState(null, null, newUrl);
    });


    function getThemeFromUrl() {
        return new URLSearchParams(window.location.search).get('theme');
    }

    function applyTheme() {
        if (currentTheme === 'dark') {
            themeStylesheet.setAttribute('href', 'dark-mode.css');
            themeToggleButton.textContent = "To light mode";
        } else {
            themeStylesheet.setAttribute('href', 'light-mode.css');
            themeToggleButton.textContent = "To dark mode";
        }
    }
});
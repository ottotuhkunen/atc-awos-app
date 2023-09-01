let chartUpdateInterval;

function airfieldView() {
    document.getElementById("mainContainer").style.display = "block";
    document.getElementById("chartsContainer").style.display = "none";
    document.getElementById("screenCleaningContainer").style.display = "none";
    document.getElementById("awosTopContainer").style.display = "block";
    document.getElementById("actions").disabled = false;
    document.getElementById("mode").disabled = false;
    document.getElementById("metarsContainer").style.display = "none";

    // buttons
    document.getElementById("airfieldViewButton").classList.add("topNavActive");
    document.getElementById("chartdisplayButton").classList.remove("topNavActive");
    document.getElementById("latestMETARsButton").classList.remove("topNavActive");

    // Stop updating charts
    clearInterval(chartUpdateInterval);
}
function chartDisplay() {
    document.getElementById("mainContainer").style.display = "none";
    document.getElementById("chartsContainer").style.display = "flex";
    document.getElementById("screenCleaningContainer").style.display = "none";
    document.getElementById("metarsContainer").style.display = "none";

    // buttons
    document.getElementById("airfieldViewButton").classList.remove("topNavActive");
    document.getElementById("chartdisplayButton").classList.add("topNavActive");
    document.getElementById("latestMETARsButton").classList.remove("topNavActive");

    // initial load charts
    loadCharts(fmiStoredId);

    // charts update every 60 seconds
    chartUpdateInterval = setInterval(() => {
        loadCharts(fmiStoredId);
    }, 60000);
}
function latestMetarView() {
    document.getElementById("mainContainer").style.display = "none";
    document.getElementById("chartsContainer").style.display = "none";
    document.getElementById("screenCleaningContainer").style.display = "none";
    document.getElementById("metarsContainer").style.display = "block";
    document.getElementById("latestMETARsButton").classList.add("topNavActive");

    // buttons
    document.getElementById("airfieldViewButton").classList.remove("topNavActive");
    document.getElementById("chartdisplayButton").classList.remove("topNavActive");

    // Stop updating charts
    clearInterval(chartUpdateInterval);

    // load latest METARs
    loadLatestMETARs();
}
function screenCleaning() {
    document.getElementById("screenCleaningContainer").style.display = "block";
    document.getElementById("awosTopContainer").style.display = "none";
    document.getElementById("mainContainer").style.display = "none";
    document.getElementById("chartsContainer").style.display = "none";
    document.getElementById("actions").disabled = true;
    document.getElementById("mode").disabled = true;
    document.getElementById("metarsContainer").style.display = "none";

    // Stop updating charts
    clearInterval(chartUpdateInterval);
}

async function loadCharts(fmisid) {
    try {
      const response = await fetch(`https://opendata.fmi.fi/wfs?service=WFS&version=2.0.0&request=getFeature&storedquery_id=fmi::observations::weather::simple&fmisid=${fmisid}`);
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      } else {
        const responseText = await response.text();
        const parser = new DOMParser();
        const data = parser.parseFromString(responseText, "application/xml");
        initializeChart(data);
      }
    } catch (error) {
      console.log('Fetch API error -', error);
    }
}

function initializeChart(xmlDoc) {
    var xmlElements = xmlDoc.getElementsByTagName("wfs:member");
    var windDirectionData = [];
    var windSpeedData = [];
    var windGustData = [];
    var tempData = [];
    var dewData = [];
    var humidityData = [];
    var qnhData = [];
    var visibilityData = [];

    for (var i = 0; i < xmlElements.length; i++) {
        var parameterName = xmlElements[i].getElementsByTagName("BsWfs:ParameterName")[0].textContent;
        var parameterValue = parseFloat(xmlElements[i].getElementsByTagName("BsWfs:ParameterValue")[0].textContent);
        var time = new Date(xmlElements[i].getElementsByTagName("BsWfs:Time")[0].textContent).getTime();

        // wind direction
        if (parameterName === "wd_10min") {
            windDirectionData.push([time, parameterValue]);
        }
        // wind speed
        if (parameterName === "ws_10min") {
            parameterValue = parameterValue * 2;
            windSpeedData.push([time, parameterValue]);
        }
        // wind gust
        if (parameterName === "wg_10min") {
            parameterValue = parameterValue * 2;
            windGustData.push([time, parameterValue]);
        }
        // temperature
        if (parameterName === "t2m") {
            tempData.push([time, parameterValue]);
        }
        // dewpoint
        if (parameterName === "td") {
            dewData.push([time, parameterValue]);
        }
        // humidity
        if (parameterName === "rh") {
            humidityData.push([time, parameterValue]);
        }
        // qnh
        if (parameterName === "p_sea") {
            qnhData.push([time, parameterValue]);
        }
        // visibility
        if (parameterName === "vis") {
            //if (parameterValue > 16000) parameterValue = 16000;
            visibilityData.push([time, parameterValue]);
        }
    }
    
    var minTime = new Date().getTime() - 1200000;
    var minTime2 = new Date().getTime() - 8200000;

    // wind direction
    const plotDirections = $.plot("#windDirectionChart", [
        {
            data: windDirectionData,
            lines: { show: true },
            points: { show: false },
            color: "#3495e5",
            label: "DIR 2min AVG",
            yaxis: 1
        },
        {
            data: [[null, null]],
            lines: { show: false },
            points: { show: false },
            yaxis: 2
        }
    ], {
        xaxis: {
            mode: "time",
            timeformat: "%H:%M",
            timezone: "UTC",
            min: minTime,
            tickSize: [2, "minute"]
        },
        yaxes: [
            {
                ticks: [
                    [0, "N"],
                    [45, "NE"],
                    [90, "E"],
                    [135, "SE"],
                    [180, "S"],
                    [225, "SW"],
                    [270, "W"],
                    [315, "NW"],
                    [360, "N"]
                ],
                tickFormatter: (v, axis) => {
                    return `${v.toFixed(0).padStart(3, '0')} (${axis.ticks.find(t => t[0] === v)[1]})`;
                }
            },
            { 
                position: "right",
                min: 0,
                max: 360,
                ticks: [
                    [0, "0°"],
                    [90, "90°"],
                    [180, "180°"],
                    [270, "270°"],
                    [360, "360°"]
                ]
            }
        ],
        legend: {
            show: true,
            position: "nw",
        },
        grid: {
            borderWidth: 1
        }
    });

    // wind speed
    const plotSpeeds = $.plot("#windSpeedChart", [
        {
            data: windSpeedData,
            lines: { show: true },
            points: { show: false },
            color: "#3495e5",
            label: "SPD 2min AVG"
        },
        {
            data: windGustData,
            lines: { show: true },
            points: { show: false },
            color: "gray",
            label: "SPD 2min MAX"
        }
    ], {
        xaxis: {
            mode: "time",
            timeformat: "%H:%M",
            timezone: "UTC",
            min: minTime,
            tickSize: [2, "minute"]
        },
        yaxis: {
            position: "right",
            tickFormatter: function (val, axis) {
                return Math.round(val) + " kt";
            }
        },
        legend: {
            show: true,
            position: "nw"
        },
        grid: {
            borderWidth: 1
        }
    });
    

    // temperature, dewpoint and humidity
    const plotTemperatures = $.plot("#temperaturesChart", [
        {
            data: tempData,
            lines: { show: true },
            points: { show: false },
            color: "#3495e5",
            label: "T",
            yaxis: 1
        },
        {
            data: dewData,
            lines: { show: true },
            points: { show: false },
            color: "#2b4c70",
            label: "DP",
            yaxis: 1
        },
        {
            data: humidityData,
            lines: { show: false },
            points: { show: true, fillColor: "gray", lineWidth: 0, radius: 1 },
            color: "gray",
            label: "RH %",
            yaxis: 2
        }
    ], {
        xaxis: {
            mode: "time",
            timeformat: "%H:%M",
            timezone: "UTC",
            min: minTime2,
            tickSize: [30, "minute"]
        },
        yaxes: [
            {
                tickFormatter: function (val, axis) {
                    return Math.round(val) + "°C";
                }
            },
            { 
                position: "right",
                min: 0,
                max: 100,
                axisLabel: "Humidity [%]",
                axisLabelUseCanvas: true,
                axisLabelFontSizePixels: 12,
                axisLabelPadding: 5,
                axisLabelAngle: 90,
                axisLabelColor: "white"
            }
        ],
        legend: {
            show: true,
            position: "nw"
        },
        grid: {
            borderWidth: 1
        }
    });

    // qnh
    const plotQnh = $.plot("#qnhChart", [{
        data: qnhData,
        lines: { show: false },
        points: { show: true, fillColor: "green", lineWidth: 0, radius: 1.5 },
        shadowSize: 0,
        label: "QNH",
        color: "green"
    }], {
        xaxis: {
            mode: "time",
            timeformat: "%H:%M",
            timezone: "UTC",
            min: minTime2,
            tickSize: [30, "minute"]
        },
        yaxis: {
            position: "right",
        },
        legend: {
            show: true,
            position: "nw"
        },
        grid: {
            borderWidth: 1
        }
    });

    let maxVisibility = Math.max.apply(Math, visibilityData.map((item) => item[1]));

    // generate visibility ticks dynamically
    let ticks = [];
    if (maxVisibility <= 2000) {
        // Use 200m intervals if the max visibility is 2km or less
        for (let i = 0; i <= maxVisibility; i += 200) {
            ticks.push([i, i + " m"]);
        }
    } else if (maxVisibility <= 10000) {
        // Use 1km intervals if the max visibility is between 2km and 10km
        for (let i = 0; i <= maxVisibility; i += 1000) {
            ticks.push([i, i/1000 + " km"]);
        }
    } else {
        // Use 5km intervals if the max visibility is above 10km
        for (let i = 0; i <= maxVisibility; i += 10000) {
            ticks.push([i, i/1000 + " km"]);
        }
    }

    // visibility
    const plotVisibility = $.plot("#visibilityChart", [{
        data: visibilityData,
        lines: { show: false },
        points: { show: true, fillColor: "#3495e5", lineWidth: 0, radius: 1.5 },
        shadowSize: 0,
        label: "PVIS 10min",
        color: "#3495e5"
    }], {
        xaxis: {
            mode: "time",
            timeformat: "%H:%M",
            timezone: "UTC",
            min: minTime2,
            tickSize: [30, "minute"]
        },
        yaxis: {
            ticks: ticks,
            position: "right"
        },
        legend: {
            show: true,
            position: "nw"
        },
        grid: {
            borderWidth: 1
        }
    });

    // CB on/off
    const plotCb = $.plot("#cbChart", [{
        data: cbState,
        lines: { show: false },
        points: { show: true, fillColor: "red", lineWidth: 0, radius: 3 },
        label: "CB 5min",
        color: "red"
    }], {
        xaxis: {
            mode: "time",
            timeformat: "%H:%M",
            timezone: "UTC",
            ticks: [fiveMinutesAgo, currentTime],
        },
        yaxis: {
            ticks: [
                [-1, ""],
                [0, "CB<br/>N/A"],
                [1, "CB<br/>OFF"],
                [2, "CB<br/>ON"],
                [3, ""],
            ]
        },
        legend: {
            show: true,
            position: "nw"
        },
        grid: {
            borderWidth: 1
        }
    });
}

// Latest METARs page
async function loadLatestMETARs() {
    try {
        const response = await fetch(`https://opendata.fmi.fi/wfs?service=WFS&version=2.0.0&request=getFeature&storedquery_id=fmi::avi::observations::latest::iwxxm&icaocode=${storedICAO}`);
  
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        } else {
            const responseText = await response.text();
            const parser = new DOMParser();
            const data = parser.parseFromString(responseText, "application/xml");
            setLatestMETARs(data);
        }
    } catch (error) {
        console.log('Fetch API error -', error);
    }
}

function setLatestMETARs(xmlDoc) {
    var xmlElements = xmlDoc.getElementsByTagName("avi:source");
    var latestMETARs = [];
  
    for (var i = xmlElements.length - 1; i >= 0; i--) {
      var metar = xmlElements[i].getElementsByTagName("avi:input")[0].textContent;
      var time = xmlElements[i].getElementsByTagName("avi:processingTime")[0].textContent;

      time = time.replace(/T/g, '&emsp;&emsp;');
      time = time.replace(/\.\d{3}Z/g, '');


  
      latestMETARs.push([metar, time]);
    }
  
    // Clear the existing rows
    const table = document.getElementById("metarsTable");
    
    while (table.rows.length > 1) {
      table.deleteRow(1);
    }
  
    // Add new rows
    for (var i = 0; i < Math.min(latestMETARs.length, 20); i++) { // Limit to 20 rows
      const row = table.insertRow(-1); // Insert new row at the end of the table
      const cell1 = row.insertCell(0);
      const cell2 = row.insertCell(1);
  
      cell1.innerHTML = latestMETARs[i][0]; // Report
      cell2.innerHTML = latestMETARs[i][1]; // Time
    }
}
  
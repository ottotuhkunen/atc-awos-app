function openMainPage(checkType) {
    // left nav triangles
    document.getElementById("mainTriangle").style.display = "block";
    document.getElementById("rwy1Triangle").style.display = "none";
    document.getElementById("rwy2Triangle").style.display = "none";
    document.getElementById("rwy3Triangle").style.display = "none";
    document.getElementById("snowtamTriangle").style.display = "none";
    document.getElementById("metReportTriangle").style.display = "none";
    document.getElementById("setupTriangle").style.display = "none";

    // left nav buttons
    document.getElementById("mainBackground").classList.remove("leftNav1_1");
    document.getElementById("mainBackground").classList.add("leftNav1");
    document.getElementById("metReportBackground").classList.remove("leftNav9_1");
    document.getElementById("metReportBackground").classList.add("leftNav9");
    document.getElementById("setupBackground").classList.remove("leftNav11_1");
    document.getElementById("setupBackground").classList.add("leftNav11");
    document.getElementById("snowtamBackground").classList.remove("leftNav8_1");
    document.getElementById("snowtamBackground").classList.add("leftNav8");
    document.getElementById("buttonMain").style.pointerEvents = "none";
    document.getElementById("buttonSnowtam").style.pointerEvents = "auto";
    document.getElementById("buttonMetReport").style.pointerEvents = "auto";
    document.getElementById("buttonSetup").style.pointerEvents = "auto";
    document.getElementById("rwy1Background").classList.remove("rwy04RButtonactive");
    document.getElementById("rwy1Background").classList.add("rwy04RButtonInactive");
    document.getElementById("rwy2Background").classList.remove("rwy15Buttonactive");
    document.getElementById("rwy2Background").classList.add("rwy15ButtonInactive");
    document.getElementById("rwy3Background").classList.remove("rwy04LButtonactive");
    document.getElementById("rwy3Background").classList.add("rwy04LButtonInactive");
    document.getElementById("buttonRwy1").style.pointerEvents = "auto";
    document.getElementById("buttonRwy2").style.pointerEvents = "auto";
    document.getElementById("buttonRwy3").style.pointerEvents = "auto";

    // displayed content
    document.getElementById("rwyccDiv").style.visibility = "hidden";
    document.getElementById("atisDiv").style.display = "none";
    document.getElementById("mainSvg").style.display = "block";
    document.getElementById("setupDiv").style.display = "none";
    document.getElementById("metrepDiv").style.display = "none";
    document.getElementById("snowtamDiv").style.display = "none";

    if(checkType != "buttonClick") {
        loadFMI();
    }
}

async function openRWYCC(runwayId) {
    const loadingIconRWYCC = document.getElementById("loadingIconRWYCC");
    
    try {
        document.getElementById("rwyccDiv").style.visibility = "visible";
        loadingIconRWYCC.style.display = "block";

        if (runwayId == "04R") {
            document.getElementById("rwy1Triangle").style.display = "block";
            document.getElementById("rwy2Triangle").style.display = "none";
            document.getElementById("rwy3Triangle").style.display = "none";
            document.getElementById("rwy1Background").classList.remove("rwy04RButtonInactive");
            document.getElementById("rwy1Background").classList.add("rwy04RButtonactive");
            document.getElementById("rwy2Background").classList.remove("rwy15Buttonactive");
            document.getElementById("rwy2Background").classList.add("rwy15ButtonInactive");
            document.getElementById("rwy3Background").classList.remove("rwy04LButtonactive");
            document.getElementById("rwy3Background").classList.add("rwy04LButtonInactive");
            document.getElementById("buttonRwy1").style.pointerEvents = "none";
            document.getElementById("buttonRwy2").style.pointerEvents = "auto";
            document.getElementById("buttonRwy3").style.pointerEvents = "auto";

        } else if (runwayId == "15") {
            document.getElementById("rwy1Triangle").style.display = "none";
            document.getElementById("rwy2Triangle").style.display = "block";
            document.getElementById("rwy3Triangle").style.display = "none";
            document.getElementById("rwy1Background").classList.remove("rwy04RButtonactive");
            document.getElementById("rwy1Background").classList.add("rwy04RButtonInactive");
            document.getElementById("rwy2Background").classList.remove("rwy15ButtonInactive");
            document.getElementById("rwy2Background").classList.add("rwy15Buttonactive");
            document.getElementById("rwy3Background").classList.remove("rwy04LButtonactive");
            document.getElementById("rwy3Background").classList.add("rwy04LButtonInactive");
            document.getElementById("buttonRwy1").style.pointerEvents = "auto";
            document.getElementById("buttonRwy2").style.pointerEvents = "none";
            document.getElementById("buttonRwy3").style.pointerEvents = "auto";

        } else if (runwayId == "04L") {
            document.getElementById("rwy1Triangle").style.display = "none";
            document.getElementById("rwy2Triangle").style.display = "none";
            document.getElementById("rwy3Triangle").style.display = "block";
            document.getElementById("rwy1Background").classList.remove("rwy04RButtonactive");
            document.getElementById("rwy1Background").classList.add("rwy04RButtonInactive");
            document.getElementById("rwy2Background").classList.remove("rwy15Buttonactive");
            document.getElementById("rwy2Background").classList.add("rwy04RButtonInactive");
            document.getElementById("rwy3Background").classList.remove("rwy04LButtonInactive");
            document.getElementById("rwy3Background").classList.add("rwy04LButtonactive");
            document.getElementById("buttonRwy1").style.pointerEvents = "auto";
            document.getElementById("buttonRwy2").style.pointerEvents = "auto";
            document.getElementById("buttonRwy3").style.pointerEvents = "none";
        }

        // other left nav triangles
        document.getElementById("mainTriangle").style.display = "none";
        document.getElementById("snowtamTriangle").style.display = "none";
        document.getElementById("metReportTriangle").style.display = "none";
        document.getElementById("setupTriangle").style.display = "none";

        // left nav buttons
        document.getElementById("mainBackground").classList.remove("leftNav1");
        document.getElementById("mainBackground").classList.add("leftNav1_1");
        document.getElementById("metReportBackground").classList.remove("leftNav9_1");
        document.getElementById("metReportBackground").classList.add("leftNav9");
        document.getElementById("setupBackground").classList.remove("leftNav11_1");
        document.getElementById("setupBackground").classList.add("leftNav11");
        document.getElementById("snowtamBackground").classList.remove("leftNav8_1");
        document.getElementById("snowtamBackground").classList.add("leftNav8");
        document.getElementById("buttonMain").style.pointerEvents = "auto";
        document.getElementById("buttonSnowtam").style.pointerEvents = "auto";
        document.getElementById("buttonMetReport").style.pointerEvents = "auto";
        document.getElementById("buttonSetup").style.pointerEvents = "auto";

        // displayed content
        document.getElementById("atisDiv").style.display = "none";
        document.getElementById("mainSvg").style.display = "none";
        document.getElementById("setupDiv").style.display = "none";
        document.getElementById("metrepDiv").style.display = "none";
        document.getElementById("snowtamDiv").style.display = "none";
        
        // set data on page
        await setRWYCC(runwayId);

    } catch (error) {
        console.error('Error in RWYCC function:', error);

    }
}

function metrep() {
    document.getElementById("loadingIconMETREP").style.display = "inline-block";
    // left nav triangles
    document.getElementById("mainTriangle").style.display = "none";
    document.getElementById("rwy1Triangle").style.display = "none";
    document.getElementById("rwy2Triangle").style.display = "none";
    document.getElementById("rwy3Triangle").style.display = "none";
    document.getElementById("snowtamTriangle").style.display = "none";
    document.getElementById("metReportTriangle").style.display = "block";
    document.getElementById("setupTriangle").style.display = "none";

    // left nav buttons
    document.getElementById("mainBackground").classList.remove("leftNav1");
    document.getElementById("mainBackground").classList.add("leftNav1_1");
    document.getElementById("metReportBackground").classList.remove("leftNav9");
    document.getElementById("metReportBackground").classList.add("leftNav9_1");
    document.getElementById("setupBackground").classList.remove("leftNav11_1");
    document.getElementById("setupBackground").classList.add("leftNav11");
    document.getElementById("snowtamBackground").classList.remove("leftNav8_1");
    document.getElementById("snowtamBackground").classList.add("leftNav8");
    document.getElementById("buttonMain").style.pointerEvents = "auto";
    document.getElementById("buttonSnowtam").style.pointerEvents = "auto";
    document.getElementById("buttonMetReport").style.pointerEvents = "none";
    document.getElementById("buttonSetup").style.pointerEvents = "auto";
    document.getElementById("rwy1Background").classList.remove("rwy04RButtonactive");
    document.getElementById("rwy1Background").classList.add("rwy04RButtonInactive");
    document.getElementById("rwy2Background").classList.remove("rwy15Buttonactive");
    document.getElementById("rwy2Background").classList.add("rwy15ButtonInactive");
    document.getElementById("rwy3Background").classList.remove("rwy04LButtonactive");
    document.getElementById("rwy3Background").classList.add("rwy04LButtonInactive");
    document.getElementById("buttonRwy1").style.pointerEvents = "auto";
    document.getElementById("buttonRwy2").style.pointerEvents = "auto";
    document.getElementById("buttonRwy3").style.pointerEvents = "auto";

    // displayed content
    document.getElementById("atisDiv").style.display = "none";
    document.getElementById("mainSvg").style.display = "none";
    document.getElementById("setupDiv").style.display = "none";
    document.getElementById("metrepDiv").style.display = "block";
    document.getElementById("snowtamDiv").style.display = "none";
    document.getElementById("rwyccDiv").style.visibility = "hidden";

    loadMetRep();
    loadCurrentMet();
}

function setup() {
    // left nav triangles
    document.getElementById("mainTriangle").style.display = "none";
    document.getElementById("rwy1Triangle").style.display = "none";
    document.getElementById("rwy2Triangle").style.display = "none";
    document.getElementById("rwy3Triangle").style.display = "none";
    document.getElementById("snowtamTriangle").style.display = "none";
    document.getElementById("metReportTriangle").style.display = "none";
    document.getElementById("setupTriangle").style.display = "block";
    
    // left nav buttons
    document.getElementById("mainBackground").classList.remove("leftNav1");
    document.getElementById("mainBackground").classList.add("leftNav1_1");
    document.getElementById("metReportBackground").classList.remove("leftNav9_1");
    document.getElementById("metReportBackground").classList.add("leftNav9");
    document.getElementById("setupBackground").classList.remove("leftNav11");
    document.getElementById("setupBackground").classList.add("leftNav11_1");
    document.getElementById("snowtamBackground").classList.remove("leftNav8_1");
    document.getElementById("snowtamBackground").classList.add("leftNav8");
    document.getElementById("buttonMain").style.pointerEvents = "auto";
    document.getElementById("buttonSnowtam").style.pointerEvents = "auto";
    document.getElementById("buttonMetReport").style.pointerEvents = "auto";
    document.getElementById("buttonSetup").style.pointerEvents = "none";
    document.getElementById("rwy1Background").classList.remove("rwy04RButtonactive");
    document.getElementById("rwy1Background").classList.add("rwy04RButtonInactive");
    document.getElementById("rwy2Background").classList.remove("rwy15Buttonactive");
    document.getElementById("rwy2Background").classList.add("rwy15ButtonInactive");
    document.getElementById("rwy3Background").classList.remove("rwy04LButtonactive");
    document.getElementById("rwy3Background").classList.add("rwy04LButtonInactive");
    document.getElementById("buttonRwy1").style.pointerEvents = "auto";
    document.getElementById("buttonRwy2").style.pointerEvents = "auto";
    document.getElementById("buttonRwy3").style.pointerEvents = "auto";
    
    // displayed content
    document.getElementById("metrepDiv").style.display = "none";
    document.getElementById("snowtamDiv").style.display = "none";
    document.getElementById("atisDiv").style.display = "none";
    document.getElementById("mainSvg").style.display = "none";
    document.getElementById("setupDiv").style.display = "block";
    document.getElementById("rwyccDiv").style.visibility = "hidden";

    // load ATS-units
    loadATSunits();

    // load greeting
    const currentHour = new Date().getHours();
    let greeting;
    if (currentHour < 12) greeting = "Good morning ☕️, ";
    else if (currentHour < 18) greeting = "Good afternoon, ";
    else greeting = "Good evening, ";

    fetch('/user-data')
    .then(response => response.json())
    .then(data => {
        document.getElementById('greeting').innerText = greeting + data.full_name + "!";
    })
    .catch(error => console.error('Error fetching user data:', error));
}

function openSnowtam() {
    // left nav triangles
    document.getElementById("mainTriangle").style.display = "none";
    document.getElementById("rwy1Triangle").style.display = "none";
    document.getElementById("rwy2Triangle").style.display = "none";
    document.getElementById("rwy3Triangle").style.display = "none";
    document.getElementById("snowtamTriangle").style.display = "block";
    document.getElementById("metReportTriangle").style.display = "none";
    document.getElementById("setupTriangle").style.display = "none";

    // left nav buttons
    document.getElementById("mainBackground").classList.remove("leftNav1");
    document.getElementById("mainBackground").classList.add("leftNav1_1");
    document.getElementById("metReportBackground").classList.remove("leftNav9_1");
    document.getElementById("metReportBackground").classList.add("leftNav9");
    document.getElementById("setupBackground").classList.remove("leftNav11_1");
    document.getElementById("setupBackground").classList.add("leftNav11");
    document.getElementById("snowtamBackground").classList.remove("leftNav8");
    document.getElementById("snowtamBackground").classList.add("leftNav8_1");
    document.getElementById("buttonMain").style.pointerEvents = "auto";
    document.getElementById("buttonSnowtam").style.pointerEvents = "none";
    document.getElementById("buttonMetReport").style.pointerEvents = "auto";
    document.getElementById("buttonSetup").style.pointerEvents = "auto";
    document.getElementById("rwy1Background").classList.remove("rwy04RButtonactive");
    document.getElementById("rwy1Background").classList.add("rwy04RButtonInactive");
    document.getElementById("rwy2Background").classList.remove("rwy15Buttonactive");
    document.getElementById("rwy2Background").classList.add("rwy15ButtonInactive");
    document.getElementById("rwy3Background").classList.remove("rwy04LButtonactive");
    document.getElementById("rwy3Background").classList.add("rwy04LButtonInactive");
    document.getElementById("buttonRwy1").style.pointerEvents = "auto";
    document.getElementById("buttonRwy2").style.pointerEvents = "auto";
    document.getElementById("buttonRwy3").style.pointerEvents = "auto";
    
    // displayed content
    document.getElementById("metrepDiv").style.display = "none";
    document.getElementById("snowtamDiv").style.display = "block";
    document.getElementById("atisDiv").style.display = "none";
    document.getElementById("mainSvg").style.display = "none";
    document.getElementById("setupDiv").style.display = "none";
    document.getElementById("rwyccDiv").style.visibility = "hidden";
    
    loadSnowtam(); // function located in fetchInfo.js file
}

function snowtamNav1() {
    document.getElementById("snowtam").style.display = "block";
    document.getElementById("taxiways").style.display = "none";
    document.getElementById("aprons").style.display = "none";
    document.getElementById("snowtamButton1").style.backgroundColor = "#D8E5F3";
    document.getElementById("snowtamButton2").style.backgroundColor = "#E6E6E6";
    document.getElementById("snowtamButton3").style.backgroundColor = "#E6E6E6";
    document.getElementById("snowtamButton1").style.pointerEvents = "none";
    document.getElementById("snowtamButton2").style.pointerEvents = "all";
    document.getElementById("snowtamButton3").style.pointerEvents = "all";
}

function snowtamNav2() {
    document.getElementById("snowtam").style.display = "none";
    document.getElementById("taxiways").style.display = "block";
    document.getElementById("aprons").style.display = "none";
    document.getElementById("snowtamButton1").style.backgroundColor = "#E6E6E6";
    document.getElementById("snowtamButton2").style.backgroundColor = "#D8E5F3";
    document.getElementById("snowtamButton3").style.backgroundColor = "#E6E6E6";
    document.getElementById("snowtamButton1").style.pointerEvents = "all";
    document.getElementById("snowtamButton2").style.pointerEvents = "none";
    document.getElementById("snowtamButton3").style.pointerEvents = "all";
}

function snowtamNav3() {
    document.getElementById("snowtam").style.display = "none";
    document.getElementById("taxiways").style.display = "none";
    document.getElementById("aprons").style.display = "block";
    document.getElementById("snowtamButton1").style.backgroundColor = "#E6E6E6";
    document.getElementById("snowtamButton2").style.backgroundColor = "#E6E6E6";
    document.getElementById("snowtamButton3").style.backgroundColor = "#D8E5F3";
    document.getElementById("snowtamButton1").style.pointerEvents = "all";
    document.getElementById("snowtamButton2").style.pointerEvents = "all";
    document.getElementById("snowtamButton3").style.pointerEvents = "none";
}

function metNav1() {
    document.getElementById("metrepSvg").style.display = "block";
    document.getElementById("metarsSvg").style.display = "none";
    document.getElementById("tafsSvg").style.display = "none";
    document.getElementById("metButton1").style.backgroundColor = "#D8E5F3";
    document.getElementById("metButton2").style.backgroundColor = "#E6E6E6";
    document.getElementById("metButton3").style.backgroundColor = "#E6E6E6";
    document.getElementById("metButton1").style.pointerEvents = "none";
    document.getElementById("metButton2").style.pointerEvents = "all";
    document.getElementById("metButton3").style.pointerEvents = "all";
}

function metNav2() {
    document.getElementById("loadingIconMETREP").style.display = "inline-block";
    document.getElementById("metrepSvg").style.display = "none";
    document.getElementById("metarsSvg").style.display = "block";
    document.getElementById("tafsSvg").style.display = "none";
    document.getElementById("metButton1").style.backgroundColor = "#E6E6E6";
    document.getElementById("metButton2").style.backgroundColor = "#D8E5F3";
    document.getElementById("metButton3").style.backgroundColor = "#E6E6E6";
    document.getElementById("metButton1").style.pointerEvents = "all";
    document.getElementById("metButton2").style.pointerEvents = "none";
    document.getElementById("metButton3").style.pointerEvents = "all";

    // load METARs
    const airports = [
        { code: "EFTU", prefix: "metarEFTU", splitLength: 90 },
        { code: "EFTP", prefix: "metarEFTP" },
        { code: "EETN", prefix: "metarEETN" },
        { code: "EFJY", prefix: "metarEFJY" },
        { code: "ESSA", prefix: "metarESSA" },
        { code: "ULLI", prefix: "metarULLI" },
    ];
    
    airports.forEach(airport => {
        fetch(`/api/metar/${airport.code}`)
        .then(response => response.json())
        .then(result => {
            const splitLength = airport.splitLength || 100; // Default split length is 100
            processMETARData(result.data[0], airport.prefix, splitLength);
    
            // Hide the loading icon after the last fetch
            if (airport.code === "ULLI") {
                document.getElementById("loadingIconMETREP").style.display = "none";
            }
        })
        .catch(error => console.log('error', error));
    });
}

function metNav3() {
    document.getElementById("loadingIconMETREP").style.display = "inline-block";
    document.getElementById("metrepSvg").style.display = "none";
    document.getElementById("metarsSvg").style.display = "none";
    document.getElementById("tafsSvg").style.display = "block";
    document.getElementById("metButton1").style.backgroundColor = "#E6E6E6";
    document.getElementById("metButton2").style.backgroundColor = "#E6E6E6";
    document.getElementById("metButton3").style.backgroundColor = "#D8E5F3";
    document.getElementById("metButton1").style.pointerEvents = "all";
    document.getElementById("metButton2").style.pointerEvents = "all";
    document.getElementById("metButton3").style.pointerEvents = "none";

    // Fetching TAFs for each airport
    const airports = ["EFTU", "EFTP", "EETN", "EFJY", "ESSA", "ULLI"];

    airports.forEach(airport => {
        fetch(`/api/taf/${airport}`)
        .then(response => response.json())
        .then(result => {
            processTAFData(result.data[0], `metTaf${airport.toLowerCase()}`);
            if (airport === "ULLI") {
                document.getElementById("loadingIconMETREP").style.display = "none";
            }
        })
        .catch(error => console.log('error', error));
    });
}

function processMETARData(metarData, elementPrefix, splitLength = 100) {
    // Helper function to safely set text content
    function setElementTextContent(id, content) {
        const element = document.getElementById(id);
        if (element) {
            element.textContent = content;
        } else {
            console.log(`Element with ID ${id} not found`);
        }
    }

    if (metarData && metarData.length > splitLength) {
        const originalString = metarData;
        let splitIndex = splitLength;

        while (splitIndex > 0 && originalString[splitIndex] !== ' ') splitIndex--;

        const firstPart = originalString.slice(0, splitIndex).trim();
        const secondPart = originalString.slice(splitIndex).trim();
        setElementTextContent(`${elementPrefix}1`, firstPart);
        setElementTextContent(`${elementPrefix}2`, secondPart + "=");
    } else {
        setElementTextContent(`${elementPrefix}1`, metarData + "=");
    }
}

function processTAFData(tafData, elementPrefix) {
    // Helper function to safely set text content
    function setElementTextContent(id, content) {
        const element = document.getElementById(id);
        if (element) {
            element.textContent = content;
        } else {
            console.log(`Element with ID ${id} not found`);
        }
    }

    if (tafData && tafData.length > 100) {
        let splitIndex2 = 100;
        let splitIndex3 = tafData.length > 200 ? 200 : tafData.length;

        while (splitIndex2 > 0 && tafData[splitIndex2] !== ' ') splitIndex2--;
        while (splitIndex3 > splitIndex2 && tafData[splitIndex3] !== ' ') splitIndex3--;

        const firstPart = tafData.slice(0, splitIndex2).trim();
        const secondPart = tafData.slice(splitIndex2, splitIndex3).trim();
        const thirdPart = tafData.slice(splitIndex3).trim();

        setElementTextContent(`${elementPrefix}1`, firstPart);
        setElementTextContent(`${elementPrefix}2`, secondPart + (thirdPart ? '' : '='));
        if (thirdPart) {
            setElementTextContent(`${elementPrefix}3`, thirdPart + "=");
        }
    } else {
        setElementTextContent(`${elementPrefix}1`, tafData + "=");
    }
}

function setupButton1() {
    document.getElementById("runwaySelection-container").style.display = "block";
    document.getElementById("setupContainer3").style.display = "none";
    document.getElementById("setupContainerMessages").style.display = "none";

    document.getElementById("setupButton1").style.backgroundColor = "#D8E5F3";
    document.getElementById("setupButton2").style.backgroundColor = "#E6E6E6";
    // document.getElementById("setupButton3").style.backgroundColor = "#E6E6E6";

    document.getElementById("setupButton1").style.pointerEvents = "none";
    document.getElementById("setupButton2").style.pointerEvents = "all";
   // document.getElementById("setupButton3").style.pointerEvents = "all";
}

function setupButton2() {
    document.getElementById("runwaySelection-container").style.display = "none";
    document.getElementById("setupContainer3").style.display = "block";
    document.getElementById("setupContainerMessages").style.display = "none";

    document.getElementById("setupButton1").style.backgroundColor = "#E6E6E6";
    document.getElementById("setupButton2").style.backgroundColor = "#D8E5F3";
    // document.getElementById("setupButton3").style.backgroundColor = "#E6E6E6";

    document.getElementById("setupButton1").style.pointerEvents = "all";
    document.getElementById("setupButton2").style.pointerEvents = "none";
    // document.getElementById("setupButton3").style.pointerEvents = "all";
}

function setupButton3() {
    document.getElementById("runwaySelection-container").style.display = "none";
    document.getElementById("setupContainer3").style.display = "none";
    document.getElementById("setupContainerMessages").style.display = "block";

    document.getElementById("setupButton1").style.backgroundColor = "#E6E6E6";
    document.getElementById("setupButton2").style.backgroundColor = "#E6E6E6";
    // document.getElementById("setupButton3").style.backgroundColor = "#D8E5F3";

    document.getElementById("setupButton1").style.pointerEvents = "all";
    document.getElementById("setupButton2").style.pointerEvents = "all";
    // document.getElementById("setupButton3").style.pointerEvents = "none";
}

function openDepATIS(){
    openAtisWindow(1);
}

function openArrATIS(){   
    openAtisWindow(2);
}

function openAtisWindow(atisWindow){
    document.getElementById("metrepDiv").style.display = "none";
    document.getElementById("snowtamDiv").style.display = "none";
    document.getElementById("buttonMain").style.pointerEvents = "auto";

    let atisDepContent = document.getElementById("atisInfoFieldDep");
    let atisArrContent = document.getElementById("atisInfoFieldArr");

    if (atisType == 2) {
        document.getElementById("atisDeporArr").innerHTML = "ARRIVAL AND DEPARTURE ATIS";
        atisDepContent.style.display = "none";
        atisArrContent.style.display = "block";
    }
    else if (atisWindow == 1) {
        document.getElementById("atisDeporArr").innerHTML = "DEPARTURE ATIS";
        atisArrContent.style.display = "none";
        atisDepContent.style.display = "block";
    }
    else {
        document.getElementById("atisDeporArr").innerHTML = "ARRIVAL ATIS";
        atisDepContent.style.display = "none";
        atisArrContent.style.display = "block";
    }

    document.getElementById("atisDiv").style.display = "block";
    document.getElementById("mainTriangle").style.display = "none";
    document.getElementById("metReportTriangle").style.display = "none";
    document.getElementById("setupTriangle").style.display = "none";
    document.getElementById("mainSvg").style.display = "none";
    document.getElementById("setupDiv").style.display = "none";
    document.getElementById("rwyccDiv").style.visibility = "hidden";
}

function getParams() {
    var params = new URLSearchParams(window.location.search);
    var runway = params.get('runway');

    // runway specific information:
    if (runway == "04L") {
        document.getElementById("main_rwy_id").textContent = "RWY 04L";
        document.getElementById("lfc_title_rwy1").textContent = "RWY 04L";
        document.getElementById("lfc_title_rwy2").textContent = "RWY 22R";
        document.getElementById("other_rwy_id").textContent = "RWY 22R";
        document.getElementById("rwy_title").textContent = "04L";
        document.getElementById("rwy_title2").textContent = "EFHK 04L";
        document.getElementById("rwy_condition_report_header").textContent = "RUNWAY 04L CONDITION REPORT AT " + getRWYCCTime();
        document.getElementById("rwy_condition_report_header2").textContent = "RUNWAY 22R CONDITION REPORT AT " + getRWYCCTime();
    }
    else if (runway == "15") {
        document.getElementById("main_rwy_id").textContent = "RWY 15";
        document.getElementById("lfc_title_rwy1").textContent = "RWY 15";
        document.getElementById("lfc_title_rwy2").textContent = "RWY 33";
        document.getElementById("other_rwy_id").textContent = "RWY 33";
        document.getElementById("rwy_title").textContent = "15";
        document.getElementById("rwy_title2").textContent = "EFHK 15";
        document.getElementById("rwy_condition_report_header").textContent = "RUNWAY 15 CONDITION REPORT AT " + getRWYCCTime();
        document.getElementById("rwy_condition_report_header2").textContent = "RUNWAY 33 CONDITION REPORT AT " + getRWYCCTime();
    }
    else if (runway == "04R") {
        document.getElementById("main_rwy_id").textContent = "RWY 04R";
        document.getElementById("lfc_title_rwy1").textContent = "RWY 04R";
        document.getElementById("lfc_title_rwy2").textContent = "RWY 22L";
        document.getElementById("other_rwy_id").textContent = "RWY 22L";
        document.getElementById("rwy_title").textContent = "04R";
        document.getElementById("rwy_title2").textContent = "EFHK 04R";
        document.getElementById("rwy_condition_report_header").textContent = "RUNWAY 04R CONDITION REPORT AT " + getRWYCCTime();
        document.getElementById("rwy_condition_report_header2").textContent = "RUNWAY 22L CONDITION REPORT AT " + getRWYCCTime();
    }

    // Common information:
    document.getElementById("rwycc_assessment").textContent = "ASSESSED \u0020\u0020\u0020\u0020" +   returnDate() + "\u0020\u0020\u0020\u0020" + getRWYCCTime();
    document.getElementById("rwycc_report").textContent = "REPORTED \u0020\u0020\u0020\u0020" +   returnDate() + "\u0020\u0020\u0020\u0020" + getRWYCCTime();
    getRWYCCValues();
}


function getRWYCCTime() {
    var currentTime = new Date();

  // Set the adjusted minutes based on the current minutes
  var adjustedMinutes;
  var currentMinutes = currentTime.getMinutes();

  if (currentMinutes >= 50) {
    adjustedMinutes = 50;
  } else if (currentMinutes >= 20) {
    adjustedMinutes = 20;
  } else {
    // If current minutes < 20, set it to the previous hour's 50
    currentTime.setHours(currentTime.getHours() - 1);
    adjustedMinutes = 50;
  }

  currentTime.setMinutes(adjustedMinutes);

  var formattedTime =
    currentTime.getUTCHours().toString().padStart(2, '0') + ':' +
    currentTime.getUTCMinutes().toString().padStart(2, '0') +
    ' UTC';

  return formattedTime;
}

function returnDate() {
    var dateUtc = new Date();
    var day = dateUtc.getUTCDate();
    var month = dateUtc.getUTCMonth() + 1;
    var year = dateUtc.getUTCFullYear();
    if ( day < 10 ) { day = "0" + day; }
    if ( month < 10 ) { month = "0" + month; }
    var fullDate = day + "." + month + "." + year;

    return fullDate;
}

var baseUrl = "https://api.airtable.com/v0/appGAYI2wFvY7jZVG/Table%201";

var requestOptions = {
    method: 'GET',
    headers: {
        'Authorization': 'Bearer patdi7Qmwc4DabdNb.2bd05fae548b7ec31be6a80e2500e78c499b0cf2b5a1b5c893211538d962eb0d'
    },
};

function getRWYCCValues(){
    fetch(baseUrl, requestOptions)
    .then(response => response.json())

    .then(result => {
        for (let record of result.records) {
            // Runway condition report (RWYCC)
            if (record.fields['Name'] === 'rwycc_all_rwys') {
                console.log(record.fields['content']);
                if(record.fields['content'] == "..."){
                    document.getElementById("all_rwycc_codes").textContent = "-, -, -";
                    document.getElementById("all_rwycc_codes2").textContent = "-, -, -";
                    document.getElementById("rwycc_first_code").textContent = "-";
                    document.getElementById("rwycc_second_code").textContent = "-";
                    document.getElementById("rwycc_third_code").textContent = "-";
                }
                else{
                    document.getElementById("all_rwycc_codes").textContent = record.fields['content'] + ", " + record.fields['content'] + ", " + record.fields['content'];
                    document.getElementById("all_rwycc_codes_2").textContent = record.fields['content'] + ", " + record.fields['content'] + ", " + record.fields['content'];
                    document.getElementById("rwycc_first_code").textContent = record.fields['content'];
                    document.getElementById("rwycc_second_code").textContent = record.fields['content'];
                    document.getElementById("rwycc_third_code").textContent = record.fields['content'];
                }
            }
            // Runway contaminants
            if (record.fields['Name'] === 'contaminants') {
                console.log(record.fields['content']);
                if(record.fields['content'] == "..."){
                    document.getElementById("rwycc_first_contaminant").textContent = "N/A";
                    document.getElementById("rwycc_second_contaminant").textContent = "N/A";
                    document.getElementById("rwycc_third_contaminant").textContent = "N/A";
                    document.getElementById("contaminants_1").textContent = "FIRST PART N/A ";
                    document.getElementById("contaminants_2").textContent = "SECOND PART N/A ";
                    document.getElementById("contaminants_3").textContent = "THIRD PART N/A ";
                    document.getElementById("contaminants_4").textContent = "FIRST PART N/A ";
                    document.getElementById("contaminants_5").textContent = "SECOND PART N/A ";
                    document.getElementById("contaminants_6").textContent = "THIRD PART N/A ";
                }
                else{
                    document.getElementById("rwycc_first_contaminant").textContent = record.fields['content'];
                    document.getElementById("rwycc_second_contaminant").textContent = record.fields['content'];
                    document.getElementById("rwycc_third_contaminant").textContent = record.fields['content'];
                    document.getElementById("contaminants_1").textContent = "FIRST PART 100 PERCENT " + record.fields['content'];
                    document.getElementById("contaminants_2").textContent = "SECOND PART 100 PERCENT " + record.fields['content'];
                    document.getElementById("contaminants_3").textContent = "THIRD PART 100 PERCENT " + record.fields['content'];
                    document.getElementById("contaminants_4").textContent = "FIRST PART 100 PERCENT " + record.fields['content'];
                    document.getElementById("contaminants_5").textContent = "SECOND PART 100 PERCENT " + record.fields['content'];
                    document.getElementById("contaminants_6").textContent = "THIRD PART 100 PERCENT " + record.fields['content'];
                }
            }
        }
    })
    .catch(error => console.log('error', error));
}

function loadMetRep() {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            setMetRep(this);
        }
    };
    xhttp.open("GET", "https://opendata.fmi.fi/wfs?service=WFS&version=2.0.0&request=getFeature&storedquery_id=fmi::avi::observations::iwxxm&icaocode=EFHK", true); 
    xhttp.send();

    // set low-wind data
    fetch('/api/fmidata')
    .then(response => response.json())
    .then(data => {
        processFMIData(data);
    })
    .catch(error => console.error('Error fetching data:', error));
}

function setMetRep(xml) {
    var xmlDoc = xml.responseXML;

    var metars = xmlDoc.getElementsByTagName('avi:input');
    var metar = metars[metars.length-1].childNodes[0].nodeValue;

    var viss = xmlDoc.getElementsByTagName('iwxxm:prevailingVisibility');
    var vis = viss[viss.length-1].childNodes[0].nodeValue;

    if (vis == "9999.0") vis = "10KM";
    else vis = Math.round(vis) + "M";

    document.getElementById("metVis").textContent = vis;
    
    var temps = xmlDoc.getElementsByTagName('iwxxm:airTemperature');
    var temp = temps[temps.length-1].childNodes[0].nodeValue;
    document.getElementById("metTa").textContent = Math.round(temp);

    var dews = xmlDoc.getElementsByTagName('iwxxm:dewpointTemperature');
    var dew = dews[dews.length-1].childNodes[0].nodeValue;
    document.getElementById("metTd").textContent = Math.round(dew);

    var qnhs = xmlDoc.getElementsByTagName('iwxxm:qnh');
    var qnh = qnhs[qnhs.length-1].childNodes[0].nodeValue;
    document.getElementById("metQnh").textContent = Math.round(qnh);
}

function loadCurrentMet() {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
        loadActualMet(this);
      }
    };
    //AIRPORT SPECIFIC
    xhttp.open("GET", "https://opendata.fmi.fi/wfs?service=WFS&version=2.0.0&request=getFeature&storedquery_id=fmi::observations::weather::simple&fmisid=100968", true); 
    xhttp.send();
    fetchInformation();
    setTimeout(loadFMI, 60000);
}

function loadActualMet(xml) {
    var xmlDoc = xml.responseXML;

    var xmlSize = xmlDoc.getElementsByTagName("BsWfs:ParameterName");
    var table = new Array(xmlSize.length);

    for(var i = 0; i < xmlSize.length; i++) {
        table[i] = new Array(2);
        table[i][0] = xmlDoc.getElementsByTagName("BsWfs:ParameterName")[i].childNodes[0].nodeValue;
        table[i][1] = xmlDoc.getElementsByTagName("BsWfs:ParameterValue")[i].childNodes[0].nodeValue;
    }

    table = table.slice(-15, -1);

    var currentQnh = 0;
    var currentVisibility = 0;
    var currentDewpoint = 0;
    var currentTemperature = 0;

    for (var i = 0; i < table.length; i++) {
        if (table[i][0] === "p_sea") {
          currentQnh = table[i][1] - 0.0;
        }
        if (table[i][0] === "vis") {
          currentVisibility = table[i][1];
        }
        if (table[i][0] === "td") {
          currentDewpoint = table[i][1];
        }
        if (table[i][0] === "t2m") {
          currentTemperature = table[i][1];
        }
    }

    var roundedCurrentVisibility = Math.round(currentVisibility / 500) * 500;
    if (roundedCurrentVisibility >= 50000) {
        roundedCurrentVisibility = 50000;
    }

    document.getElementById("metCurrentVis").textContent = roundedCurrentVisibility;
    document.getElementById("metCurrentTemp").textContent = currentTemperature;
    document.getElementById("metCurrentDewpoint").textContent = currentDewpoint;
    document.getElementById("metCurrentQnh").textContent = currentQnh.toFixed(1);
    document.getElementById("metCurrentQfe04R").textContent = (currentQnh - 5.9).toFixed(1);
    document.getElementById("metCurrentQfe22L").textContent = (currentQnh - 6.5).toFixed(1);

    fetch("/api/taf/EFHK")
    .then(response => {
        // Check if response is in JSON format
        if (response.headers.get("content-type") && response.headers.get("content-type").includes("application/json")) {
            return response.json();
        } else {
            console.log("TAF is not JSON");
            throw new Error('Not a JSON response');
        }
    })
    .then(result => {
        if (result.data[0] && result.data[0].length > 100) {
            if (result.data[0] && result.data[0].length > 200) {
                const originalString = result.data[0];
                let splitIndex2 = 100;
                let splitIndex3 = 200;

                while (splitIndex2 > 0 && originalString[splitIndex2] !== ' ') {
                    splitIndex2--;
                }
                while (splitIndex3 > splitIndex2 && originalString[splitIndex3] !== ' ') {
                    splitIndex3--;
                }

                const firstPart = originalString.slice(0, splitIndex2).trim();
                const secondPart = originalString.slice(splitIndex2, splitIndex3).trim();
                const thirdPart = originalString.slice(splitIndex3).trim();

                document.getElementById("metTaf1").textContent = firstPart;
                document.getElementById("metTaf2").textContent = secondPart;
                document.getElementById("metTaf3").textContent = thirdPart + "=";
            } else {
                const originalString = result.data[0];
                let splitIndex = 100;
                while (splitIndex > 0 && originalString[splitIndex] !== ' ') {
                    splitIndex--;
                }
                const firstPart = originalString.slice(0, splitIndex).trim();
                const secondPart = originalString.slice(splitIndex).trim();
                document.getElementById("metTaf1").textContent = firstPart;
                document.getElementById("metTaf2").textContent = secondPart + "=";
            }
        } 
        else {
            document.getElementById("metTaf1").textContent = result.data[0] + "=";
        }
        
    })
    .catch(error => console.log('error', error));

    fetch("/api/decodedmetar/EFHK")
    .then(response => response.json())
    .then(result => {

        let allConditionsText = '';

        if (result.data[0].conditions) {
            result.data[0].conditions.forEach(condition => {
                allConditionsText += `${condition.code} `;
            });
        }

        let allCloudsText = '';
        let cloudAltPreset = '';
        result.data[0].clouds.forEach((cloud, index) => {
            // All clouds
            allCloudsText += cloud.code + " " + cloud.base_feet_agl + "FT ";
            // Get elements
            const feetElement = document.getElementById(`metCurrentCloud_alt${index + 1}`);
            const codeElement = document.getElementById(`metCurrentCloud_id${index + 1}`);
            cloudAltPreset = String(Math.floor(cloud.base_feet_agl / 100)).padStart(3, '0'); 

            // Update fields
            if (allCloudsText.includes("CAVOK")) {
                if (feetElement) feetElement.textContent = "";
                if (codeElement) codeElement.textContent = "";
                document.getElementById("metWx").textContent = "CAVOK";
            } 
            else if (allCloudsText.includes("CLR")) {
                if (feetElement) feetElement.textContent = "";
                if (codeElement) codeElement.textContent = "";
                document.getElementById("metWx").textContent = "";
            } 
            else {
                if (feetElement) feetElement.textContent = cloudAltPreset;
                if (codeElement) codeElement.textContent = cloud.code;
                document.getElementById("metWx").textContent = allConditionsText;
            }
        });

        document.getElementById("loadingIconMETREP").style.display = "none";
    })
    .catch(error => console.log('error', error));
}

// LOW WIND, METREP, SPECIAL
function processFMIData(data) {
    const lowWindData = data.find(item => item.messagetype === 'LOWWIND');
    const specialData = data.find(item => item.messagetype === 'SPECIAL');
    const metrepData = data.find(item => item.messagetype === 'METREP');

    if (lowWindData) {
        const message = lowWindData.message;
        const splitPoint = "500FT";
        const endPoint = "FL100";
        const titlePart = message.split(splitPoint)[0].trim();
        const valuesPart = message.split(endPoint)[1].trim().replace('=', '');

        // Update HTML elements
        document.getElementById("lowwind_title").textContent = titlePart;
        document.getElementById("lowwind_values").textContent = valuesPart;
    } else {
        console.log("LOWWIND data not found");
    }

    // set SPECIAL or METREP data
    if (specialData) {
        setMetHeader(specialData.message);
        setMetWind(specialData.message);
        setMetCloud(specialData.message);
        setMetTrend(specialData.message);

    } else if (metrepData) {
        setMetHeader(metrepData.message);
        setMetWind(metrepData.message);
        setMetCloud(metrepData.message);
        setMetTrend(metrepData.message); 
    } else {
        console.log("METREP/SPECIAL not found");
    }
}

function setMetHeader(message) {
    const timeEndIndex = message.indexOf("Z") + 1;

    if (timeEndIndex > 0) {
        const header = message.substring(0, timeEndIndex).trim();
        document.getElementById("metHeader").textContent = header;
    } else {
        console.log("Timestamp not found in METREP/SPECIAL");
    }
}

function setMetWind(message) {
    const windData = message.substring(message.indexOf("RWY 04L"), message.indexOf("RWY 04R")).trim();
    const metWind = document.getElementById("metWind");

    if (windData) {
        metWind.textContent = windData;

        const containerWidth = 390;
        let fontSize = 24;
        metWind.style.fontSize = fontSize + 'px';

        // Function to adjust font size based on width
        function adjustFontSize() {
            metWind.style.whiteSpace = 'nowrap';
            let textWidth = metWind.scrollWidth;

            while (textWidth > containerWidth) {
                fontSize -= 0.5;
                metWind.style.fontSize = fontSize + 'px';
                textWidth = metWind.scrollWidth

                if (fontSize <= 10) break; // Minimum font size
            }
        }

        // Perform adjustment
        adjustFontSize();
    } else {
        console.log("Could not find WIND in METREP/SPECIAL message");
    }
}

function setMetCloud(message) {
    let windData = null;

    const trendIndex = message.indexOf("TREND");
    let cldIndex = message.indexOf("CLD");

    if (cldIndex !== -1 && (trendIndex === -1 || cldIndex < trendIndex)) {
        // If 'CLD' is found and it's before 'TREND' (or TREND doesn't exist), find the end of the cloud data
        const endIndex = message.indexOf(" T", cldIndex);
        if (endIndex !== -1) {
            windData = message.substring(cldIndex + 3, endIndex).trim();
        }
    } else if (message.includes("CAVOK")) {
        windData = "";
    } else {
        windData = "NCD";
    }

    // Set the HTML content
    const metCloudsElement = document.getElementById('metClouds');
    if (metCloudsElement) {
        metCloudsElement.textContent = windData ? windData : "No cloud data available";
    } else {
        console.log("Element with ID 'metClouds' not found");
    }
}

function setMetTrend(message) {
    const trendIndex = message.indexOf("TREND ");
    if (trendIndex !== -1) {
        const trendData = message.substring(trendIndex + 6, message.indexOf("=", trendIndex)).trim();
        document.getElementById("metTrend").textContent = trendData || 'NOSIG';
    } else {
        document.getElementById("metTrend").textContent = 'NOSIG';
    }
}

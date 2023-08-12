function openMainPage() {
    saveConfig();
    // left nav triangles
    document.getElementById("mainTriangle").style.display = "block";
    document.getElementById("rwy1Triangle").style.display = "none";
    document.getElementById("rwy2Triangle").style.display = "none";
    document.getElementById("rwy3Triangle").style.display = "none";
    document.getElementById("snowtamTriangle").style.display = "none";
    document.getElementById("metReportTriangle").style.display = "none";
    document.getElementById("setupTriangle").style.display = "none";

    // left nav buttons
    document.getElementById("buttonMain").style.pointerEvents = "none";
    document.getElementById("mainBackground").classList.remove("leftNav1_1");
    document.getElementById("mainBackground").classList.add("leftNav1");
    document.getElementById("metReportBackground").classList.remove("leftNav9_1");
    document.getElementById("metReportBackground").classList.add("leftNav9");
    document.getElementById("setupBackground").classList.remove("leftNav11_1");
    document.getElementById("setupBackground").classList.add("leftNav11");
    document.getElementById("snowtamBackground").classList.remove("leftNav8_1");
    document.getElementById("snowtamBackground").classList.add("leftNav8");


    // displayed content
    document.getElementById("atisDiv").style.display = "none";
    document.getElementById("mainSvg").style.display = "block";
    document.getElementById("setupDiv").style.display = "none";
    document.getElementById("metrepDiv").style.display = "none";
    document.getElementById("snowtamDiv").style.display = "none";
    loadFMI();
}

function metrep() {
    // left nav triangles
    document.getElementById("mainTriangle").style.display = "none";
    document.getElementById("rwy1Triangle").style.display = "none";
    document.getElementById("rwy2Triangle").style.display = "none";
    document.getElementById("rwy3Triangle").style.display = "none";
    document.getElementById("snowtamTriangle").style.display = "none";
    document.getElementById("metReportTriangle").style.display = "block";
    document.getElementById("setupTriangle").style.display = "none";

    // left nav buttons
    document.getElementById("buttonMain").style.pointerEvents = "auto";
    document.getElementById("mainBackground").classList.remove("leftNav1");
    document.getElementById("mainBackground").classList.add("leftNav1_1");
    document.getElementById("metReportBackground").classList.remove("leftNav9");
    document.getElementById("metReportBackground").classList.add("leftNav9_1");
    document.getElementById("setupBackground").classList.remove("leftNav11_1");
    document.getElementById("setupBackground").classList.add("leftNav11");
    document.getElementById("snowtamBackground").classList.remove("leftNav8_1");
    document.getElementById("snowtamBackground").classList.add("leftNav8");

    // displayed content
    document.getElementById("atisDiv").style.display = "none";
    document.getElementById("mainSvg").style.display = "none";
    document.getElementById("setupDiv").style.display = "none";
    document.getElementById("metrepDiv").style.display = "block";
    document.getElementById("snowtamDiv").style.display = "none";

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
    document.getElementById("buttonMain").style.pointerEvents = "auto";
    document.getElementById("mainBackground").classList.remove("leftNav1");
    document.getElementById("mainBackground").classList.add("leftNav1_1");
    document.getElementById("metReportBackground").classList.remove("leftNav9_1");
    document.getElementById("metReportBackground").classList.add("leftNav9");
    document.getElementById("setupBackground").classList.remove("leftNav11");
    document.getElementById("setupBackground").classList.add("leftNav11_1");
    document.getElementById("snowtamBackground").classList.remove("leftNav8_1");
    document.getElementById("snowtamBackground").classList.add("leftNav8");
    
    // displayed content
    document.getElementById("metrepDiv").style.display = "none";
    document.getElementById("snowtamDiv").style.display = "none";
    document.getElementById("atisDiv").style.display = "none";
    document.getElementById("mainSvg").style.display = "none";
    document.getElementById("setupDiv").style.display = "block";
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
    document.getElementById("buttonMain").style.pointerEvents = "auto";
    document.getElementById("mainBackground").classList.remove("leftNav1");
    document.getElementById("mainBackground").classList.add("leftNav1_1");
    document.getElementById("metReportBackground").classList.remove("leftNav9_1");
    document.getElementById("metReportBackground").classList.add("leftNav9");
    document.getElementById("setupBackground").classList.remove("leftNav11_1");
    document.getElementById("setupBackground").classList.add("leftNav11");
    document.getElementById("snowtamBackground").classList.remove("leftNav8");
    document.getElementById("snowtamBackground").classList.add("leftNav8_1");
    
    // displayed content
    document.getElementById("metrepDiv").style.display = "none";
    document.getElementById("snowtamDiv").style.display = "block";
    document.getElementById("atisDiv").style.display = "none";
    document.getElementById("mainSvg").style.display = "none";
    document.getElementById("setupDiv").style.display = "none";
    
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
    document.getElementById("metrepSvg").style.display = "none";
    document.getElementById("metarsSvg").style.display = "block";
    document.getElementById("tafsSvg").style.display = "none";
    document.getElementById("metButton1").style.backgroundColor = "#E6E6E6";
    document.getElementById("metButton2").style.backgroundColor = "#D8E5F3";
    document.getElementById("metButton3").style.backgroundColor = "#E6E6E6";
    document.getElementById("metButton1").style.pointerEvents = "all";
    document.getElementById("metButton2").style.pointerEvents = "none";
    document.getElementById("metButton3").style.pointerEvents = "all";

    var myHeaders = new Headers();
    myHeaders.append("X-API-Key", "bcad5819aedc44a7aa9b4705be");

    var requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
    };

    // load METARs
    fetch("/api/metar/EFTU")
    .then(response => response.json())
    .then(result => {
        if (result.data[0] && result.data[0].length > 90) {
            const originalString = result.data[0];
            let splitIndex = 90;
            while (splitIndex > 0 && originalString[splitIndex] !== ' ') {
              splitIndex--;
            }
            const firstPart = originalString.slice(0, splitIndex).trim();
            const secondPart = originalString.slice(splitIndex).trim();
            document.getElementById("metarEFTU1").textContent = firstPart;
            document.getElementById("metarEFTU2").textContent = secondPart + "=";
        } 
        else {
            document.getElementById("metarEFTU1").textContent = result.data[0] + "=";
        }
    })
    .catch(error => console.log('error', error));

    fetch("/api/metar/EFTP")
    .then(response => response.json())
    .then(result => {
        if (result.data[0] && result.data[0].length > 100) {
            const originalString = result.data[0];
            let splitIndex = 100;
            while (splitIndex > 0 && originalString[splitIndex] !== ' ') {
              splitIndex--;
            }
            const firstPart = originalString.slice(0, splitIndex).trim();
            const secondPart = originalString.slice(splitIndex).trim();
            document.getElementById("metarEFTP1").textContent = firstPart;
            document.getElementById("metarEFTP2").textContent = secondPart + "=";
        } 
        else {
            document.getElementById("metarEFTP1").textContent = result.data[0] + "=";
        }
    })
    .catch(error => console.log('error', error));

    fetch("/api/metar/EETN")
    .then(response => response.json())
    .then(result => {
        if (result.data[0] && result.data[0].length > 100) {
            const originalString = result.data[0];
            let splitIndex = 100;
            while (splitIndex > 0 && originalString[splitIndex] !== ' ') {
              splitIndex--;
            }
            const firstPart = originalString.slice(0, splitIndex).trim();
            const secondPart = originalString.slice(splitIndex).trim();
            document.getElementById("metarEETN1").textContent = firstPart;
            document.getElementById("metarEETN2").textContent = secondPart + "=";
        } 
        else {
            document.getElementById("metarEETN1").textContent = result.data[0] + "=";
        }
    })
    .catch(error => console.log('error', error));

    fetch("/api/metar/EFJY")
    .then(response => response.json())
    .then(result => {
        if (result.data[0] && result.data[0].length > 100) {
            const originalString = result.data[0];
            let splitIndex = 100;
            while (splitIndex > 0 && originalString[splitIndex] !== ' ') {
              splitIndex--;
            }
            const firstPart = originalString.slice(0, splitIndex).trim();
            const secondPart = originalString.slice(splitIndex).trim();
            document.getElementById("metarEFJY1").textContent = firstPart;
            document.getElementById("metarEFJY2").textContent = secondPart + "=";
        } 
        else {
            document.getElementById("metarEFJY1").textContent = result.data[0] + "=";
        }
    })
    .catch(error => console.log('error', error));

    fetch("/api/metar/ESSA")
    .then(response => response.json())
    .then(result => {
        if (result.data[0] && result.data[0].length > 100) {
            const originalString = result.data[0];
            let splitIndex = 100;
            while (splitIndex > 0 && originalString[splitIndex] !== ' ') {
              splitIndex--;
            }
            const firstPart = originalString.slice(0, splitIndex).trim();
            const secondPart = originalString.slice(splitIndex).trim();
            document.getElementById("metarESSA1").textContent = firstPart;
            document.getElementById("metarESSA2").textContent = secondPart + "=";
        } 
        else {
            document.getElementById("metarESSA1").textContent = result.data[0] + "=";
        }
    })
    .catch(error => console.log('error', error));

    fetch("/api/metar/ULLI")
    .then(response => response.json())
    .then(result => {
        if (result.data[0] && result.data[0].length > 100) {
            const originalString = result.data[0];
            let splitIndex = 100;
            while (splitIndex > 0 && originalString[splitIndex] !== ' ') {
              splitIndex--;
            }
            const firstPart = originalString.slice(0, splitIndex).trim();
            const secondPart = originalString.slice(splitIndex).trim();
            document.getElementById("metarULLI1").textContent = firstPart;
            document.getElementById("metarULLI2").textContent = secondPart + "=";
        } 
        else {
            document.getElementById("metarULLI1").textContent = result.data[0] + "=";
        }
    })
    .catch(error => console.log('error', error));
}

function metNav3() {
    document.getElementById("metrepSvg").style.display = "none";
    document.getElementById("metarsSvg").style.display = "none";
    document.getElementById("tafsSvg").style.display = "block";
    document.getElementById("metButton1").style.backgroundColor = "#E6E6E6";
    document.getElementById("metButton2").style.backgroundColor = "#E6E6E6";
    document.getElementById("metButton3").style.backgroundColor = "#D8E5F3";
    document.getElementById("metButton1").style.pointerEvents = "all";
    document.getElementById("metButton2").style.pointerEvents = "all";
    document.getElementById("metButton3").style.pointerEvents = "none";

    var myHeaders = new Headers();
    myHeaders.append("X-API-Key", "bcad5819aedc44a7aa9b4705be");

    var requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
    };

    // fetching TAFs:
    fetch("/api/taf/EFTU")
    .then(response => response.json())
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

                document.getElementById("metTaf1_eftu").textContent = firstPart;
                document.getElementById("metTaf2_eftu").textContent = secondPart;
                document.getElementById("metTaf3_eftu").textContent = thirdPart + "=";
            } else {
                const originalString = result.data[0];
                let splitIndex = 100;
                while (splitIndex > 0 && originalString[splitIndex] !== ' ') {
                    splitIndex--;
                }
                const firstPart = originalString.slice(0, splitIndex).trim();
                const secondPart = originalString.slice(splitIndex).trim();
                document.getElementById("metTaf1_eftu").textContent = firstPart;
                document.getElementById("metTaf2_eftu").textContent = secondPart + "=";
            }
        } 
        else {
            document.getElementById("metTaf1_eftu").textContent = result.data[0] + "=";
        }
        
    })
    .catch(error => console.log('error', error));

    fetch("/api/taf/EFTP")
    .then(response => response.json())
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

                document.getElementById("metTaf1_eftp").textContent = firstPart;
                document.getElementById("metTaf2_eftp").textContent = secondPart;
                document.getElementById("metTaf3_eftp").textContent = thirdPart + "=";
            } else {
                const originalString = result.data[0];
                let splitIndex = 100;
                while (splitIndex > 0 && originalString[splitIndex] !== ' ') {
                    splitIndex--;
                }
                const firstPart = originalString.slice(0, splitIndex).trim();
                const secondPart = originalString.slice(splitIndex).trim();
                document.getElementById("metTaf1_eftp").textContent = firstPart;
                document.getElementById("metTaf2_eftp").textContent = secondPart + "=";
            }
        } 
        else {
            document.getElementById("metTaf1_eftp").textContent = result.data[0] + "=";
        }
        
    })
    .catch(error => console.log('error', error));

    fetch("/api/taf/EETN")
    .then(response => response.json())
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

                document.getElementById("metTaf1_eetn").textContent = firstPart;
                document.getElementById("metTaf2_eetn").textContent = secondPart;
                document.getElementById("metTaf3_eetn").textContent = thirdPart + "=";
            } else {
                const originalString = result.data[0];
                let splitIndex = 100;
                while (splitIndex > 0 && originalString[splitIndex] !== ' ') {
                    splitIndex--;
                }
                const firstPart = originalString.slice(0, splitIndex).trim();
                const secondPart = originalString.slice(splitIndex).trim();
                document.getElementById("metTaf1_eetn").textContent = firstPart;
                document.getElementById("metTaf2_eetn").textContent = secondPart + "=";
            }
        } 
        else {
            document.getElementById("metTaf1_eetn").textContent = result.data[0] + "=";
        }
        
    })
    .catch(error => console.log('error', error));

    fetch("/api/taf/EFJY")
    .then(response => response.json())
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

                document.getElementById("metTaf1_efjy").textContent = firstPart;
                document.getElementById("metTaf2_efjy").textContent = secondPart;
                document.getElementById("metTaf3_efjy").textContent = thirdPart + "=";
            } else {
                const originalString = result.data[0];
                let splitIndex = 100;
                while (splitIndex > 0 && originalString[splitIndex] !== ' ') {
                    splitIndex--;
                }
                const firstPart = originalString.slice(0, splitIndex).trim();
                const secondPart = originalString.slice(splitIndex).trim();
                document.getElementById("metTaf1_efjy").textContent = firstPart;
                document.getElementById("metTaf2_efjy").textContent = secondPart + "=";
            }
        } 
        else {
            document.getElementById("metTaf1_efjy").textContent = result.data[0] + "=";
        }
        
    })
    .catch(error => console.log('error', error));

    fetch("/api/taf/ESSA")
    .then(response => response.json())
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

                document.getElementById("metTaf1_essa").textContent = firstPart;
                document.getElementById("metTaf2_essa").textContent = secondPart;
                document.getElementById("metTaf3_essa").textContent = thirdPart + "=";
            } else {
                const originalString = result.data[0];
                let splitIndex = 100;
                while (splitIndex > 0 && originalString[splitIndex] !== ' ') {
                    splitIndex--;
                }
                const firstPart = originalString.slice(0, splitIndex).trim();
                const secondPart = originalString.slice(splitIndex).trim();
                document.getElementById("metTaf1_essa").textContent = firstPart;
                document.getElementById("metTaf2_essa").textContent = secondPart + "=";
            }
        } 
        else {
            document.getElementById("metTaf1_essa").textContent = result.data[0] + "=";
        }
        
    })
    .catch(error => console.log('error', error));

    fetch("/api/taf/ULLI")
    .then(response => response.json())
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

                document.getElementById("metTaf1_ulli").textContent = firstPart;
                document.getElementById("metTaf2_ulli").textContent = secondPart;
                document.getElementById("metTaf3_ulli").textContent = thirdPart + "=";
            } else {
                const originalString = result.data[0];
                let splitIndex = 100;
                while (splitIndex > 0 && originalString[splitIndex] !== ' ') {
                    splitIndex--;
                }
                const firstPart = originalString.slice(0, splitIndex).trim();
                const secondPart = originalString.slice(splitIndex).trim();
                document.getElementById("metTaf1_ulli").textContent = firstPart;
                document.getElementById("metTaf2_ulli").textContent = secondPart + "=";
            }
        } 
        else {
            document.getElementById("metTaf1_ulli").textContent = result.data[0] + "=";
        }
        
    })
    .catch(error => console.log('error', error));
}

function openDepATIS(){
    openAtisWindow(1);
}

function openArrATIS(){   
    openAtisWindow(2);
}

function openAtisWindow(atisType){
    document.getElementById("metrepDiv").style.display = "none";
    document.getElementById("snowtamDiv").style.display = "none";
    document.getElementById("buttonMain").style.pointerEvents = "auto";

    if (atisType == 1) {
        document.getElementById("atisDeporArr").innerHTML = "DEPARTURE ATIS";
    }else {
        document.getElementById("atisDeporArr").innerHTML = "ARRIVAL ATIS";
    }

    document.getElementById("atisDiv").style.display = "block";
    document.getElementById("mainTriangle").style.display = "none";
    document.getElementById("metReportTriangle").style.display = "none";
    document.getElementById("setupTriangle").style.display = "none";
    document.getElementById("mainSvg").style.display = "none";
    document.getElementById("setupDiv").style.display = "none";
}

function openRWYCC(runway) {
    //var url = "rwycc/index.html?runway=" + encodeURIComponent(runway);
    //window.location.href = url;
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
}

function setMetRep(xml) {
    var xmlDoc = xml.responseXML;

    var metars = xmlDoc.getElementsByTagName('avi:input');
    var metar = metars[metars.length-1].childNodes[0].nodeValue;
    document.getElementById("metar").innerHTML = metar;

    var header = metar.match(/(EFHK\s\d{6}Z)\s/);

    if (header && header[1]) {
        document.getElementById("metHeader").textContent = header[1];
    }


    var viss = xmlDoc.getElementsByTagName('iwxxm:prevailingVisibility');
    var vis = viss[viss.length-1].childNodes[0].nodeValue;
    if (vis == "9999.0") {
        vis = "10KM";
    }
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
          currentQnh = table[i][1];
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
    document.getElementById("metCurrentQnh").textContent = currentQnh;
    document.getElementById("metCurrentQfe04R").textContent = (currentQnh - 5.9).toFixed(1);
    document.getElementById("metCurrentQfe22L").textContent = (currentQnh - 6.5).toFixed(1);


    // Fetching TAF and METAR data:
    var myHeaders = new Headers();
    myHeaders.append("X-API-Key", "bcad5819aedc44a7aa9b4705be");

    var requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
    };

    fetch("/api/taf/EFHK")
    .then(response => response.json())
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

    fetch("/api/decocedmetar/EFHK")
    .then(response => response.json())
    .then(result => {

        const metarWindDir = result.data[0].wind && result.data[0].wind.degrees || 0;
        const metarWindSpd = result.data[0].wind && result.data[0].wind.speed_kts || 0;

        if (metarWindSpd == 0) {
            document.getElementById("metWind").textContent = "RWY 04L TDZ CALM END CALM";
        }
        else if (metarWindDir == 0) {
            document.getElementById("metWind").textContent = "RWY 04L TDZ VRB " + metarWindSpd + "KT END VRB " + metarWindSpd + "KT";
        }
        else {
            document.getElementById("metWind").textContent = `RWY 04L TDZ ${result.data[0].wind.degrees}/${result.data[0].wind.speed_kts}KT END ${result.data[0].wind.degrees}/${result.data[0].wind.speed_kts}KT`;
        }

        let allConditionsText = '';

        if (result.data[0].conditions) {
            result.data[0].conditions.forEach(condition => {
                allConditionsText += `${condition.code} `;
            });
        }

        let allCloudsText = '';
        result.data[0].clouds.forEach((cloud, index) => {
            // All clouds
            allCloudsText += cloud.code + " " + cloud.base_feet_agl + "FT ";
            // Get elements
            const feetElement = document.getElementById(`metCurrentCloud_alt${index + 1}`);
            const codeElement = document.getElementById(`metCurrentCloud_id${index + 1}`);
            const allCloudsElement = document.getElementById('metClouds');

            // Update fields
            if (allCloudsText.includes("CAVOK")) {
                if (allCloudsElement) allCloudsElement.textContent = "";
                if (feetElement) feetElement.textContent = "";
                if (codeElement) codeElement.textContent = "";
                document.getElementById("metWx").textContent = "CAVOK";
            } else {
                if (feetElement) feetElement.textContent = cloud.base_feet_agl;
                if (codeElement) codeElement.textContent = cloud.code;
                if (allCloudsElement) allCloudsElement.textContent = allCloudsText;
                document.getElementById("metWx").textContent = allConditionsText;
            }
            
        });
    })
    .catch(error => console.log('error', error));
}

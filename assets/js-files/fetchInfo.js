const runwaysRCC = ['04L', '04R', '15'];

async function fetchInformation(){

    try {
        const response = await fetch('/dataEFHK');
        const result = await response.json();
        for (let record of result.records) {

            // Runway Condition Codes (RCC) on Main page
            if (record.fields['Name'] === 'rwycc_all_rwys') {
                const RWYCCWindows = document.getElementById('RWYCC_windows');
                const RCRIndicators = document.getElementById('RCRIndicators');
                
                if (record.fields['content'] === "...") RWYCCWindows.style.display = "none"; // no RCC reported (...)

                else {
                    RWYCCWindows.style.display = "block";

                    let content, showRCRIndicators = false, indicatorSrc = '';
                    
                    if ((record.fields['information'] === 'AUTO') && ((wawa >= 22 && wawa <= 25) || wawa >= 40)) {
                        content = "5" + "\u00A0".repeat(2) + "•";
                    } 
                    else {
                        content = record.fields['content'];
                        if (record.fields['rwycc_upgr_dngr'] === "↑") { // upgraded
                            indicatorSrc = './src/upgraded.png';
                            showRCRIndicators = true;
                        } else if (record.fields['rwycc_upgr_dngr'] === "↓") { // downgraded
                            indicatorSrc = './src/downgraded.png';
                            showRCRIndicators = true;
                        } else {
                            content += "\u00A0".repeat(2) + "•"; // normal
                        }
                    }

                    const images = document.querySelectorAll('image[id^="rcrIndicator"]');
                    
                    if (showRCRIndicators) {
                        images.forEach(image => {
                            image.setAttribute('href', indicatorSrc);
                        });
                        RCRIndicators.style.display = "block";
                    } else {
                        images.forEach(image => {
                            image.setAttribute('href', "");
                        });
                        RCRIndicators.style.display = "none";
                    }

                    // check if runway is closed --> RCC displayed as "0 dngr"
                    let matchClosedRunway = [];
                    try {
                        const { records } = await (await fetch('/dataEFHK')).json();
                        for (let rec of records) {
                            for (let runway of ['04L', '04R', '15']) {
                                if (rec.fields['Name'] === `rwy_${runway}_clsd` && rec.fields['content'] == 1) {
                                    matchClosedRunway.push(runway);
                                }
                            }
                        }
                    } catch (error) {
                        console.log('Error in match closed runway:', error);
                    }
                    
                    runwaysRCC.forEach(runway => { // set RCC values to HTML page
                        let runwayContent = matchClosedRunway.includes(runway) ? "0" : content;
                        for (let i = 1; i <= 3; i++) {
                            const rcrIndicatorID = `rcrIndicator${(runwaysRCC.indexOf(runway) * 3) + i}`;
                            document.getElementById(`${runway}_RWYCC_${i}`).textContent = runwayContent;
                            if (runwayContent == "0") {
                                document.getElementById("RCRIndicators").style.display = "block";
                                document.getElementById(rcrIndicatorID).style.display = "block";
                                document.getElementById(rcrIndicatorID).setAttribute('href', './src/downgraded.png');
                            }
                        }
                    });
                }
            }
            
            // if warnings exist:
            if (record.fields['Name'] === 'warnings') {
                if(record.fields['content'] == "..."){
                    if (atisType == 0) {
                        document.getElementById('infoWindow4').style.display = "block";
                        document.getElementById('infoWindow4_line2').textContent = "TWR IS CLOSED";
                    } else {
                        document.getElementById('infoWindow4').style.display = "none";
                        document.getElementById('infoWindow4_line2').textContent = "";
                    }
                    document.getElementById('infoWindow4_line1').textContent = "";
                    document.getElementById('metWarnings').textContent = "NO ACTUAL WARNINGS";
                }
                else{
                    document.getElementById('infoWindow4').style.display = "block";
                    document.getElementById('infoWindow4_line1').textContent = "MET WARNINGS EXIST";
                    document.getElementById('metWarnings').textContent = record.fields['content'];
                    if (atisType == 0) {
                        document.getElementById('infoWindow4_line2').textContent = "TWR IS CLOSED";
                    } else {
                        document.getElementById('infoWindow4_line2').textContent = "";
                    }
                }
            }
            if (record.fields['Name'] === 'warnings_line_2') {
                document.getElementById('metWarnings2').textContent = record.fields['content'];
            }
        }
    } catch (error) {
        console.log('Error in setMetarData function:', error);
    } finally {
        document.getElementById("loadingIcon").style.display = "none";
    }
}

// SNOWTAMs:
async function loadSnowtam() {
    let observationTime = "0000";
    let observationTime2 = "NO_SNOWTAM";
    try {
        const response = await fetch('/snowtam');
        const data = await response.json();
        // Extract the observation time
        let match = data.data.match(/ (\d{8}) /);
        observationTime = match ? match[0] : null;
        observationTime2 = observationTime ? observationTime.slice(-5) : "OUTDATED";

        // Insert linechanges to SNOWTAM text
        let finalSnowtam = data.data.replace(/ (\d{8}) /g, '<br>$1 ');
        finalSnowtam = finalSnowtam.replace(/(\s)([4-9]\d*|100)(\s)/g, '$1$2<br><br>');
        finalSnowtam = finalSnowtam.replace(/SNOWTAM<br> EFHK/g, 'SNOWTAM EFHK<br>');
        document.getElementById('snowtamLine1').innerHTML = "(" + finalSnowtam + ")";
    } catch (error) {
        console.error('Error fetching data:', error);
    }

    let currentDate = new Date();
    let year = currentDate.getUTCFullYear().toString();
    let month = (currentDate.getUTCMonth() + 1).toString().padStart(2, '0');
    let day = currentDate.getUTCDate().toString().padStart(2, '0');
    let formattedDate = year + month + day;

    // example id: EFHK_20230715_1048_45811
    let snowtamId = "EFHK_" + formattedDate + "_" + observationTime2;

    document.getElementById("snowtamId").innerHTML = snowtamId;
    document.getElementById("snowtamTime1").innerHTML = observationTime;
    document.getElementById("snowtamTime2").innerHTML = observationTime;

    fetch('/dataEFHK')
    .then(response => response.json())
    .then(result => {
        for (let record of result.records) {
            // taxiway and apron conditions (SNOWTAM page)
            // EXTRA! WINTER ONLY BELOW. CORRECT HTML TABLES IN DISCORD!
            /*
            if (record.fields['Name'] === 'twyConditions') { 
                for (let i = 1; i <= 6; i++) {
                    document.getElementById(`twyCond${i}`).textContent = record.fields['content'];
                }
            }
            if (record.fields['Name'] === 'apronConditions') { 
                for (let i = 1; i <= 9; i++) {
                    document.getElementById(`apronCond${i}`).textContent = record.fields['content'];
                }
            }
            */
            if (record.fields['Name'] === 'snowtamComments') {
                if (record.fields['content'] != null) {
                    document.getElementById("commentSnowtam").innerHTML = "COMMENT SNOWTAM:<br>" + record.fields['content'];
                } else {
                    document.getElementById("commentSnowtam").innerHTML = "COMMENT SNOWTAM:<br>NIL";
                }
            }
            if (record.fields['Name'] === 'taxiwayComments') {
                var elements = document.querySelectorAll(".commentTaxiway");
                var content = record.fields['content'] || "NIL";
            
                elements.forEach(function(element) {
                    element.innerHTML = content;
                });
            }
            if (record.fields['Name'] === 'apronComments') {
                var elements = document.querySelectorAll(".commentApron");
                var content = record.fields['content'] || "NIL";
            
                elements.forEach(function(element) {
                    element.innerHTML = content;
                });
            }
        }
        setConditionIcon(toggleContaminantIcon);
    })
    .catch(error => console.log('error', error));
}

async function loadTacticalMessages() {
    try {
        const response = await fetch('/messages');
        const messages = await response.json();

        // Process each message
        for (let i = 0; i < 3; i++) {
            const message = messages[i] ? messages[i].message : '';
            const lines = message.split('\n');

            // Determine the visibility of the infoWindow
            const infoWindow = document.getElementById(`infoWindow${i + 1}`);
            if (message.trim() === '') {
                // Hide infoWindow if message is empty
                infoWindow.style.display = 'none';
            } else {
                // Show infoWindow and populate text
                infoWindow.style.display = 'block';
                document.getElementById(`infoWindow${i + 1}_line1`).textContent = lines[0] || '';
                document.getElementById(`infoWindow${i + 1}_line2`).textContent = lines[1] || '';
                document.getElementById(`infoWindow${i + 1}_line3`).textContent = lines[2] || '';
            }
        }

    } catch (error) {
        console.error('Error fetching messages:', error);
    }

    console.log("Tactical messages loaded");
}

async function loadATSunits() {
    try {
        const response = await fetch('https://data.vatsim.net/v3/vatsim-data.json');
        const data = await response.json();

        // Define positions with their corresponding variations
        const positions = {
            "EFIN A": ["EFIN_A_CTR", "EFIN__A_CTR", "EFIN_A__CTR"],
            "EFIN C": ["EFIN_C_CTR", "EFIN__C_CTR", "EFIN_C__CTR"],
            "EFIN D": ["EFIN_D_CTR", "EFIN_CTR", "EFIN__CTR", "EFIN__D_CTR", "EFIN_D__CTR"],
            "RAD-E": ["EFHK_E_APP", "EFHK_E__APP", "EFHK__E_APP", "EFHK_APP", "EFHK__APP"],
            "RAD-W": ["EFHK_W_APP", "EFHK_W__APP", "EFHK__W_APP"],
            "ARR-E": ["EFHK_R_APP", "EFHK_R__APP", "EFHK__R_APP"],
            "ARR-W": ["EFHK_A_APP", "EFHK_A__APP", "EFHK__A_APP"],
            "TWR-E": ["EFHK_E_TWR", "EFHK_E__TWR", "EFHK__E_TWR", "EFHK_TWR", "EFHK__TWR"],
            "TWR-W": ["EFHK_W_TWR", "EFHK_W__TWR", "EFHK__W_TWR"],
            "GND": ["EFHK_GND", "EFHK__GND"],
            "CLD": ["EFHK_DEL", "EFHK__DEL"],
            "DEICE SUPER": ["EFHK_C_GND","EFHK_C__GND", "EFHK__C_GND"],
            "DEICE": ["EFHK_D_GND", "EFHK_D__GND", "EFHK__D_GND"]
        };

        // Creating table
        const table = document.createElement('table');
        table.id = 'atsunitsTable';

        // Creating table header
        const headerRow = table.insertRow();
        const th1 = document.createElement('th');
        th1.textContent = 'ROLE';
        const th2 = document.createElement('th');
        th2.textContent = 'FREQUENCY';
        const th3 = document.createElement('th');
        th3.textContent = 'ATCO NAME/ID';
        headerRow.appendChild(th1);
        headerRow.appendChild(th2);
        headerRow.appendChild(th3);

        // Function to add a row to the ATS-unit table
        function addRow(column1, column2, column3) {
            const row = table.insertRow();
            const cell1 = row.insertCell(0);
            const cell2 = row.insertCell(1);
            const cell3 = row.insertCell(2);

            cell1.textContent = column1;
            cell2.textContent = column2;
            cell3.textContent = column3;
        }

        // Track online status of key positions
        const onlinePositions = new Set();

        // Loop through positions in the order defined in the positions object
        for (const [role, variations] of Object.entries(positions)) {
            for (let item of data.controllers) {
                if (variations.includes(item.callsign)) {
                    addRow(role, item.frequency, item.name);
                    onlinePositions.add(role);
                }
            }
        }

        // Check if all required primary positions are online
        const requiredPrimaryPositions = ["RAD-E", "RAD-W", "ARR-E", "ARR-W", "TWR-E", "TWR-W", "GND"];
        const allRequiredOnline = requiredPrimaryPositions.every(pos => onlinePositions.has(pos));

        // Check the additional condition
        const atisInfo = document.getElementById('atisInfoFieldArr')?.innerHTML || '';
        if (!allRequiredOnline && (atisInfo.includes("ARR RWYS 04L AND 04R") || atisInfo.includes("ARR RWYS 22L AND 22R"))) {
            document.getElementById('simul-app-warning').style.display = 'block';
        } else {
            document.getElementById('simul-app-warning').style.display = 'none';
        }

        // Update the table container
        const container = document.getElementById('atsunitsTable');
        container.innerHTML = '';
        container.appendChild(table);
        
    } catch (error) {
        console.log('Error in loadATSunits function:', error);
    }    
}

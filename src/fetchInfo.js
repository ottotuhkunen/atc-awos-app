async function fetchInformation(){
    try {
        const response = await fetch('/dataEFHK');
        const result = await response.json();
        for (let record of result.records) {
            // information window 04L
            if (record.fields['Name'] === 'infowindow_04L line1') {
                if(record.fields['content'] == "..."){
                    document.getElementById('infoWindow1').style.display = "none";
                }
                else{
                    document.getElementById('infoWindow1').style.display = "block";
                    document.getElementById('infoWindow1_line1').textContent = record.fields['content'];
                }
            }
            if (record.fields['Name'] === 'infowindow_04L line2') {
                document.getElementById('infoWindow1_line2').textContent = record.fields['content'];
            }

            if (record.fields['Name'] === 'infowindow_04L line3') {
                document.getElementById('infoWindow1_line3').textContent = record.fields['content'];
            }

            // information window 22L
            if (record.fields['Name'] === 'infowindow_22L line1') {
                if(record.fields['content'] == "..."){
                    document.getElementById('infoWindow2').style.display = "none";
                }
                else{
                    document.getElementById('infoWindow2').style.display = "block";
                    document.getElementById('infoWindow2_line1').textContent = record.fields['content'];
                }
            }
            if (record.fields['Name'] === 'infowindow_22L line2') {
                document.getElementById('infoWindow2_line2').textContent = record.fields['content'];
            }

            if (record.fields['Name'] === 'infowindow_22L line3') {
                document.getElementById('infoWindow2_line3').textContent = record.fields['content'];
            }

            // information window 33
            if (record.fields['Name'] === 'infowindow_33 line1') {
                if(record.fields['content'] == "..."){
                    document.getElementById('infoWindow3').style.display = "none";
                }
                else{
                    document.getElementById('infoWindow3').style.display = "block";
                    document.getElementById('infoWindow3_line1').textContent = record.fields['content'];
                }
            }
            if (record.fields['Name'] === 'infowindow_33 line2') {
                document.getElementById('infoWindow3_line2').textContent = record.fields['content'];
            }

            if (record.fields['Name'] === 'infowindow_33 line3') {
                document.getElementById('infoWindow3_line3').textContent = record.fields['content'];
            }

            // Runway condition report (RWYCC)
            if (record.fields['Name'] === 'rwycc_all_rwys') {
                if(record.fields['content'] == "..."){
                    document.getElementById('RWYCC_windows').style.display = "none";
                }
                else if ((record.fields['information'] === 'AUTO') && ((wawa >= 22 && wawa <= 25) || wawa >= 40)) {
                    document.getElementById('RWYCC_windows').style.display = "block";
                    document.getElementById('04L_RWYCC_1').textContent = "5" + "\u00A0".repeat(1) + "•";
                    document.getElementById('04L_RWYCC_2').textContent = "5" + "\u00A0".repeat(1) + "•";
                    document.getElementById('04L_RWYCC_3').textContent = "5" + "\u00A0".repeat(1) + "•";
                    document.getElementById('04R_RWYCC_1').textContent = "5" + "\u00A0".repeat(1) + "•";
                    document.getElementById('04R_RWYCC_2').textContent = "5" + "\u00A0".repeat(1) + "•";
                    document.getElementById('04R_RWYCC_3').textContent = "5" + "\u00A0".repeat(1) + "•";
                    document.getElementById('15_RWYCC_1').textContent = "5" + "\u00A0".repeat(1) + "•";
                    document.getElementById('15_RWYCC_2').textContent = "5" + "\u00A0".repeat(1) + "•";
                    document.getElementById('15_RWYCC_3').textContent = "5" + "\u00A0".repeat(1) + "•";
                }
                else{
                    document.getElementById('RWYCC_windows').style.display = "block";

                    if(record.fields['rwycc_upgr_dngr'] == "↑"){
                        document.getElementById('04L_RWYCC_1').textContent = record.fields['content'];
                        document.getElementById('04L_RWYCC_2').textContent = record.fields['content'];
                        document.getElementById('04L_RWYCC_3').textContent = record.fields['content'];
                        document.getElementById('04R_RWYCC_1').textContent = record.fields['content'];
                        document.getElementById('04R_RWYCC_2').textContent = record.fields['content'];
                        document.getElementById('04R_RWYCC_3').textContent = record.fields['content'];
                        document.getElementById('15_RWYCC_1').textContent = record.fields['content'];
                        document.getElementById('15_RWYCC_2').textContent = record.fields['content'];
                        document.getElementById('15_RWYCC_3').textContent = record.fields['content'];

                        const images = document.querySelectorAll('image[id^="rcrIndicator"]');
                        images.forEach(image => {
                            image.setAttribute('href', './src/upgraded.png');
                        });
                        document.getElementById('RCRIndicators').style.display = "block";
                        
                    }
                    else if (record.fields['rwycc_upgr_dngr'] == "↓") {
                        document.getElementById('04L_RWYCC_1').textContent = record.fields['content'];
                        document.getElementById('04L_RWYCC_2').textContent = record.fields['content'];
                        document.getElementById('04L_RWYCC_3').textContent = record.fields['content'];
                        document.getElementById('04R_RWYCC_1').textContent = record.fields['content'];
                        document.getElementById('04R_RWYCC_2').textContent = record.fields['content'];
                        document.getElementById('04R_RWYCC_3').textContent = record.fields['content'];
                        document.getElementById('15_RWYCC_1').textContent = record.fields['content'];
                        document.getElementById('15_RWYCC_2').textContent = record.fields['content'];
                        document.getElementById('15_RWYCC_3').textContent = record.fields['content'];

                        const images = document.querySelectorAll('image[id^="rcrIndicator"]');
                        images.forEach(image => {
                            image.setAttribute('href', './src/downgraded.png');
                        });
                        document.getElementById('RCRIndicators').style.display = "block";
                    }
                    else {
                        document.getElementById('04L_RWYCC_1').textContent = record.fields['content'] + "\u00A0".repeat(1) + "•";
                        document.getElementById('04L_RWYCC_2').textContent = record.fields['content'] + "\u00A0".repeat(1) + "•";
                        document.getElementById('04L_RWYCC_3').textContent = record.fields['content'] + "\u00A0".repeat(1) + "•";
                        document.getElementById('04R_RWYCC_1').textContent = record.fields['content'] + "\u00A0".repeat(1) + "•";
                        document.getElementById('04R_RWYCC_2').textContent = record.fields['content'] + "\u00A0".repeat(1) + "•";
                        document.getElementById('04R_RWYCC_3').textContent = record.fields['content'] + "\u00A0".repeat(1) + "•";  
                        document.getElementById('15_RWYCC_1').textContent = record.fields['content'] + "\u00A0".repeat(1) + "•";
                        document.getElementById('15_RWYCC_2').textContent = record.fields['content'] + "\u00A0".repeat(1) + "•";
                        document.getElementById('15_RWYCC_3').textContent = record.fields['content'] + "\u00A0".repeat(1) + "•";
                        document.getElementById('RCRIndicators').style.display = "none";
                    }

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

async function loadATSunits() {
    try {
        const response = await fetch('https://data.vatsim.net/v3/vatsim-data.json');
        const data = await response.json();
    
        const table = document.createElement('table');
        table.id = 'atsunitsTable';

        // creating table header
        const headerRow = table.insertRow();
        const th1 = document.createElement('th');
        th1.textContent = 'Role';
        const th2 = document.createElement('th');
        th2.textContent = 'Frequency';
        const th3 = document.createElement('th');
        th3.textContent = 'ATCO';
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
    
        // Find ATS-units
        for (let item of data.controllers) {
            // Area control
            if (item.callsign === "EFIN_CTR" || item.callsign === "EFIN_D_CTR" || item.callsign === "EFIN_D__CTR" || item.callsign === "EFIN_C_CTR") {
                addRow("EFIN", item.frequency, item.name);
            }
            // Radar
            else if (item.callsign === "EFHK_E_APP" || item.callsign === "EFHK_APP" || item.callsign === "EFHK_E__APP") {
                addRow("RAD-E", item.frequency, item.name);
            }
            else if (item.callsign === "EFHK_W_APP" || item.callsign === "EFHK_W__APP") {
                addRow("RAD-W", item.frequency, item.name);
            }
            // Arrival
            else if (item.callsign === "EFHK_R_APP" || item.callsign === "EFHK_R__APP") {
                addRow("ARR-E", item.frequency, item.name);
            }
            else if (item.callsign === "EFHK_A_APP" || item.callsign === "EFHK_A__APP") {
                addRow("ARR-W", item.frequency, item.name);
            }
            // Tower
            else if (item.callsign === "EFHK_E_TWR" || item.callsign === "EFHK_TWR" || item.callsign === "EFHK_E__TWR") {
                addRow("TWR-E", item.frequency, item.name);
            }
            else if (item.callsign === "EFHK_W_TWR" || item.callsign === "EFHK_W__TWR") {
                addRow("TWR-W", item.frequency, item.name);
            }
            // Ground
            else if (item.callsign === "EFHK_GND" || item.callsign === "EFHK__GND") {
                addRow("GND", item.frequency, item.name);
            }
            // Ground 2
            else if (item.callsign === "EFHK_DEL" || item.callsign === "EFHK__DEL") {
                addRow("CLD", item.frequency, item.name);
            }
            // De-icing
            else if (item.callsign === "EFHK_D_GND" || item.callsign === "EFHK_C_GND") {
                addRow("DEICE", "133.850", item.name);
            }
        }
    
        // Append the table to the HTML element with id "atsunitsTable"
        const container = document.getElementById('atsunitsTable');
        container.innerHTML = '';
        container.appendChild(table);
    } catch (error) {
        console.log('Error in loadATSunits function:', error);
    }    
}

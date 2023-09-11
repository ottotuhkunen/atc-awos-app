function fetchInformation(){
    fetch('/dataEFHK')
    .then(response => response.json())

    .then(result => {
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
                    document.getElementById('04R_RWYCC_1').textContent = "3" + "\u00A0".repeat(1) + "⇩";
                    document.getElementById('04R_RWYCC_2').textContent = "3" + "\u00A0".repeat(1) + "⇩";
                    document.getElementById('04R_RWYCC_3').textContent = "3" + "\u00A0".repeat(1) + "⇩";
                    document.getElementById('15_RWYCC_1').textContent = "5" + "\u00A0".repeat(1) + "•";
                    document.getElementById('15_RWYCC_2').textContent = "5" + "\u00A0".repeat(1) + "•";
                    document.getElementById('15_RWYCC_3').textContent = "5" + "\u00A0".repeat(1) + "•";
                }
                else{
                    document.getElementById('RWYCC_windows').style.display = "block";

                    if (JSON.parse(sessionStorage.getItem("04L_closed"))) {
                        document.getElementById('04L_RWYCC_1').textContent = "//" + "\u00A0".repeat(1) + "•";
                        document.getElementById('04L_RWYCC_2').textContent = "//" + "\u00A0".repeat(1) + "•";
                        document.getElementById('04L_RWYCC_3').textContent = "//" + "\u00A0".repeat(1) + "•";
                    } else {
                        document.getElementById('04L_RWYCC_1').textContent = record.fields['content'] + "\u00A0".repeat(1) + record.fields['rwycc_upgr_dngr'];
                        document.getElementById('04L_RWYCC_2').textContent = record.fields['content'] + "\u00A0".repeat(1) + record.fields['rwycc_upgr_dngr'];
                        document.getElementById('04L_RWYCC_3').textContent = record.fields['content'] + "\u00A0".repeat(1) + record.fields['rwycc_upgr_dngr'];
                    }
                    if (JSON.parse(sessionStorage.getItem("04R_closed"))) {
                        document.getElementById('04R_RWYCC_1').textContent = "//" + "\u00A0".repeat(1) + "•";
                        document.getElementById('04R_RWYCC_2').textContent = "//" + "\u00A0".repeat(1) + "•";
                        document.getElementById('04R_RWYCC_3').textContent = "//" + "\u00A0".repeat(1) + "•";
                    } else {
                        // NOTAM: RWY 04R/22L SLIPPERY WHEN WET
                        if (record.fields['content'] == 5) {
                            document.getElementById('04R_RWYCC_1').textContent = "3" + "\u00A0".repeat(1) + "•";
                            document.getElementById('04R_RWYCC_2').textContent = "3" + "\u00A0".repeat(1) + "•";
                            document.getElementById('04R_RWYCC_3').textContent = "3" + "\u00A0".repeat(1) + "•";  
                        } else {
                            document.getElementById('04R_RWYCC_1').textContent = record.fields['content'] + "\u00A0".repeat(1) + record.fields['rwycc_upgr_dngr'];
                            document.getElementById('04R_RWYCC_2').textContent = record.fields['content'] + "\u00A0".repeat(1) + record.fields['rwycc_upgr_dngr'];
                            document.getElementById('04R_RWYCC_3').textContent = record.fields['content'] + "\u00A0".repeat(1) + record.fields['rwycc_upgr_dngr'];  
                        }
                    }
                    if (JSON.parse(sessionStorage.getItem("15_closed"))) {
                        document.getElementById('15_RWYCC_1').textContent = "//" + "\u00A0".repeat(1) + "•";
                        document.getElementById('15_RWYCC_2').textContent = "//" + "\u00A0".repeat(1) + "•";
                        document.getElementById('15_RWYCC_3').textContent = "//" + "\u00A0".repeat(1) + "•";
                    } else {
                        document.getElementById('15_RWYCC_1').textContent = record.fields['content'] + "\u00A0".repeat(1) + record.fields['rwycc_upgr_dngr'];
                        document.getElementById('15_RWYCC_2').textContent = record.fields['content'] + "\u00A0".repeat(1) + record.fields['rwycc_upgr_dngr'];
                        document.getElementById('15_RWYCC_3').textContent = record.fields['content'] + "\u00A0".repeat(1) + record.fields['rwycc_upgr_dngr'];  
                    }
                }
            }
            // if warnings exist:
            if (record.fields['Name'] === 'warnings') {
                if(record.fields['content'] == "..."){
                    document.getElementById('infoWindow4').style.display = "none";
                    document.getElementById('metWarnings').textContent = "NO ACTUAL WARNINGS";
                }
                else{
                    document.getElementById('infoWindow4').style.display = "block";
                    document.getElementById('infoWindow4_line1').textContent = "MET WARNINGS EXIST";
                    document.getElementById('metWarnings').textContent = record.fields['content'];
                }
            }
            if (record.fields['Name'] === 'warnings_line_2') {
                document.getElementById('metWarnings2').textContent = record.fields['content'];
            }
        }
    })
    .catch(error => console.log('error', error));
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

        // Insert linechanges
        let finalSnowtam = data.data.replace(/ (\d{8}) /g, '<br>$1 ');

        document.getElementById('snowtamLine1').innerHTML = "(" + finalSnowtam + ")";
    } catch (error) {
        console.error('Error fetching data:', error);
    }

    let currentDate = new Date();
    let year = currentDate.getUTCFullYear().toString(); // gets the full year as four digits
    let month = (currentDate.getUTCMonth() + 1).toString().padStart(2, '0');  // +1 because months are 0-indexed in JS
    let day = currentDate.getUTCDate().toString().padStart(2, '0');
    let formattedDate = year + month + day;

    // example id: EFHK_20230715_1048_45811
    let snowtamId = "EFHK_" + formattedDate + "_" + observationTime2;

    document.getElementById("snowtamId").innerHTML = snowtamId;
    document.getElementById("snowtamTime1").innerHTML = observationTime;
    document.getElementById("snowtamTime2").innerHTML = observationTime;
}
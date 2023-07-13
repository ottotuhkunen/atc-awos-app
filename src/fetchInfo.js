var baseUrl = "https://api.airtable.com/v0/appGAYI2wFvY7jZVG/Table%201";

var requestOptions = {
    method: 'GET',
    headers: {
        'Authorization': 'Bearer patdi7Qmwc4DabdNb.2bd05fae548b7ec31be6a80e2500e78c499b0cf2b5a1b5c893211538d962eb0d'
    },
};

function fetchInformation(){
    fetch(baseUrl, requestOptions)
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
                else{
                    document.getElementById('RWYCC_windows').style.display = "block";

                    if (JSON.parse(sessionStorage.getItem("04L_closed"))) {
                        document.getElementById('04L_RWYCC_1').textContent = "0" + "\u00A0".repeat(3) + "⇩"
                        document.getElementById('04L_RWYCC_2').textContent = "0" + "\u00A0".repeat(3) + "⇩"
                        document.getElementById('04L_RWYCC_3').textContent = "0" + "\u00A0".repeat(3) + "⇩"

                    } else {
                        document.getElementById('04L_RWYCC_1').textContent = record.fields['content'] + "\u00A0".repeat(3) + record.fields['rwycc_upgr_dngr'];
                        document.getElementById('04L_RWYCC_2').textContent = record.fields['content'] + "\u00A0".repeat(3) + record.fields['rwycc_upgr_dngr'];
                        document.getElementById('04L_RWYCC_3').textContent = record.fields['content'] + "\u00A0".repeat(3) + record.fields['rwycc_upgr_dngr'];
                    }

                    if (JSON.parse(sessionStorage.getItem("04R_closed"))) {
                        document.getElementById('04R_RWYCC_1').textContent = "0" + "\u00A0".repeat(3) + "⇩"
                        document.getElementById('04R_RWYCC_2').textContent = "0" + "\u00A0".repeat(3) + "⇩"
                        document.getElementById('04R_RWYCC_3').textContent = "0" + "\u00A0".repeat(3) + "⇩"

                    } else {
                        document.getElementById('04R_RWYCC_1').textContent = record.fields['content'] + "\u00A0".repeat(3) + record.fields['rwycc_upgr_dngr'];
                        document.getElementById('04R_RWYCC_2').textContent = record.fields['content'] + "\u00A0".repeat(3) + record.fields['rwycc_upgr_dngr'];
                        document.getElementById('04R_RWYCC_3').textContent = record.fields['content'] + "\u00A0".repeat(3) + record.fields['rwycc_upgr_dngr'];    
                    }

                    if (JSON.parse(sessionStorage.getItem("15_closed"))) {
                        document.getElementById('15_RWYCC_1').textContent = "0" + "\u00A0".repeat(3) + "⇩"
                        document.getElementById('15_RWYCC_2').textContent = "0" + "\u00A0".repeat(3) + "⇩"
                        document.getElementById('15_RWYCC_3').textContent = "0" + "\u00A0".repeat(3) + "⇩"

                    } else {
                        document.getElementById('15_RWYCC_1').textContent = record.fields['content'] + "\u00A0".repeat(3) + record.fields['rwycc_upgr_dngr'];
                        document.getElementById('15_RWYCC_2').textContent = record.fields['content'] + "\u00A0".repeat(3) + record.fields['rwycc_upgr_dngr'];
                        document.getElementById('15_RWYCC_3').textContent = record.fields['content'] + "\u00A0".repeat(3) + record.fields['rwycc_upgr_dngr'];  
                    }
                }
            }
            // if warnings exist:
            if (record.fields['Name'] === 'warnings') {
                if(record.fields['content'] == "..."){
                    document.getElementById('infoWindow4').style.display = "none";
                    document.getElementById('metWarnings').textContent = "NO ACTUAL WARNINGS";
                    document.getElementById('metrepHeader').style.color = "black";

                }
                else{
                    document.getElementById('infoWindow4').style.display = "block";
                    document.getElementById('infoWindow4_line1').textContent = "MET WARNINGS EXIST";
                    document.getElementById('metWarnings').textContent = record.fields['content'];
                    document.getElementById('metrepHeader').style.color = "red";
                }
            }
        }
    })
    .catch(error => console.log('error', error));
}


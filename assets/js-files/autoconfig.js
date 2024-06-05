
function loadAutoConfig() {
    saveConfig();
    loadConfig();
}

function fetchRwyStatus(){
    fetch("/dataEFHK")
    .then(response => response.json())

    .then(result => {
        for (let record of result.records) {
            // load runway 04R open/closed status
            if (record.fields['Name'] === 'rwy_04R_clsd') {
                // closed
                if(record.fields['content'] == 1){

                    document.getElementById("bringToFront04R22L").style.display = "none";
                    document.getElementById("rwy04R").style.fill = "#d81715";
                    document.getElementById("04R_number").style.fill = "#dad7d4";
                    document.getElementById("22L_number").style.fill = "#dad7d4";
                    sessionStorage.setItem("04R_closed", true);
                }
                // open
                else{
                    if (document.getElementById("rwy04R").style.fill == "rgb(216, 23, 21)") {
                        document.getElementById("rwy04R").style.fill = "#B5B5B5";
                        document.getElementById("04R_number").style.fill = "#DADADA";
                        document.getElementById("22L_number").style.fill = "#DADADA";

                    }
                    sessionStorage.setItem("04R_closed", false);
                }
            }
            // load runway 15 open/closed status
            if (record.fields['Name'] === 'rwy_15_clsd') {
                // closed
                if(record.fields['content'] == 1){


                    document.getElementById("bringToFront04R22L").style.display = "block";
                    document.getElementById("rwy15").style.fill = "#d81715";
                    document.getElementById("15_number").style.fill = "#dad7d4";
                    document.getElementById("33_number").style.fill = "#dad7d4";
                    sessionStorage.setItem("15_closed", true);
                }
                // open
                else{
                    if (document.getElementById("rwy15").style.fill == "rgb(216, 23, 21)") {
                        document.getElementById("rwy15").style.fill = "#B5B5B5";
                        document.getElementById("15_number").style.fill = "#DADADA";
                        document.getElementById("33_number").style.fill = "#DADADA";

                    }
                    sessionStorage.setItem("15_closed", false);
                }
            }
            // load runway 04L open/closed status
            if (record.fields['Name'] === 'rwy_04L_clsd') {
                // closed
                if(record.fields['content'] == 1){


                    document.getElementById("rwy04L").style.fill = "#d81715";
                    document.getElementById("04L_number").style.fill = "#dad7d4";
                    document.getElementById("22R_number").style.fill = "#dad7d4";
                    sessionStorage.setItem("04L_closed", true);
                }
                // open
                else{
                    if (document.getElementById("rwy04L").style.fill == "rgb(216, 23, 21)") {
                        document.getElementById("rwy04L").style.fill = "#B5B5B5";
                        document.getElementById("04L_number").style.fill = "#DADADA";
                        document.getElementById("22R_number").style.fill = "#DADADA";

                    }
                    sessionStorage.setItem("04L_closed", false);
                }
            }
        }
    })
    .catch(error => console.log('error', error));
}
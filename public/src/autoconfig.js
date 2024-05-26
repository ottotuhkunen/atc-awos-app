
function loadAutoConfig() {
    saveConfig();
    loadConfig();
}

var baseUrl = "https://api.airtable.com/v0/appGAYI2wFvY7jZVG/Table%201";

var requestOptions = {
    method: 'GET',
    headers: {
        'Authorization': 'Bearer patdi7Qmwc4DabdNb.2bd05fae548b7ec31be6a80e2500e78c499b0cf2b5a1b5c893211538d962eb0d'
    },
};

function fetchRwyStatus(){
    fetch(baseUrl, requestOptions)
    .then(response => response.json())

    .then(result => {
        for (let record of result.records) {
            // load runway 04R open/closed status
            if (record.fields['Name'] === 'rwy_04R_clsd') {
                // closed
                if(record.fields['content'] == 1){
                    var depBox04R = document.getElementById("checkboxDep04R");
                    var arrBox04R = document.getElementById("checkboxArr04R");
                    var depBox22L = document.getElementById("checkboxDep22L");
                    var arrBox22L = document.getElementById("checkboxArr22L");
                    depBox04R.checked && depBox04R.click();
                    arrBox04R.checked && arrBox04R.click();
                    depBox22L.checked && depBox22L.click();
                    arrBox22L.checked && arrBox22L.click();
                    document.getElementById("checkboxDep04R").disabled = true;
                    document.getElementById("checkboxArr04R").disabled = true;
                    document.getElementById("checkboxDep22L").disabled = true;
                    document.getElementById("checkboxArr22L").disabled = true;
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
                        document.getElementById("checkboxDep04R").disabled = false;
                        document.getElementById("checkboxArr04R").disabled = false;
                        document.getElementById("checkboxDep22L").disabled = false;
                        document.getElementById("checkboxArr22L").disabled = false;
                    }
                    sessionStorage.setItem("04R_closed", false);
                }
            }
            // load runway 15 open/closed status
            if (record.fields['Name'] === 'rwy_15_clsd') {
                // closed
                if(record.fields['content'] == 1){
                    var depBox15 = document.getElementById("checkboxDep15");
                    var arrBox15 = document.getElementById("checkboxArr15");
                    var depBox33 = document.getElementById("checkboxDep33");
                    var arrBox33 = document.getElementById("checkboxArr33");
                    depBox15.checked && depBox33.click();
                    arrBox15.checked && arrBox33.click();
                    depBox33.checked && depBox33.click();
                    arrBox33.checked && arrBox33.click();
                    document.getElementById("checkboxDep15").disabled = true;
                    document.getElementById("checkboxArr15").disabled = true;
                    document.getElementById("checkboxDep33").disabled = true;
                    document.getElementById("checkboxArr33").disabled = true;
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
                        document.getElementById("checkboxDep15").disabled = false;
                        document.getElementById("checkboxArr15").disabled = false;
                        document.getElementById("checkboxDep33").disabled = false;
                        document.getElementById("checkboxArr33").disabled = false;
                    }
                    sessionStorage.setItem("15_closed", false);
                }
            }
            // load runway 04L open/closed status
            if (record.fields['Name'] === 'rwy_04L_clsd') {
                // closed
                if(record.fields['content'] == 1){
                    var depBox04L = document.getElementById("checkboxDep04L");
                    var arrBox04L = document.getElementById("checkboxArr04L");
                    var depBox22R = document.getElementById("checkboxDep22R");
                    var arrBox22R = document.getElementById("checkboxArr22R");
                    depBox04L.checked && depBox04L.click();
                    arrBox04L.checked && arrBox04L.click();
                    depBox22R.checked && depBox22R.click();
                    arrBox22R.checked && arrBox22R.click();
                    document.getElementById("checkboxDep04L").disabled = true;
                    document.getElementById("checkboxArr04L").disabled = true;
                    document.getElementById("checkboxDep22R").disabled = true;
                    document.getElementById("checkboxArr22R").disabled = true;
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
                        document.getElementById("checkboxDep04L").disabled = false;
                        document.getElementById("checkboxArr04L").disabled = false;
                        document.getElementById("checkboxDep22R").disabled = false;
                        document.getElementById("checkboxArr22R").disabled = false;
                    }
                    sessionStorage.setItem("04L_closed", false);
                }
            }
        }
    })
    .catch(error => console.log('error', error));
}
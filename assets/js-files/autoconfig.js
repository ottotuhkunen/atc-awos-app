
function loadAutoConfig() {
    saveConfig();
    loadConfig();
}

let background04R = document.getElementById("rwy04R");
let background15 = document.getElementById("rwy15");
let background04L = document.getElementById("rwy04L");


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
                    background04R.classList.add('closedBackground');
                    document.getElementById("04R_number").classList.add('closedNumbers');
                    document.getElementById("22L_number").classList.add('closedNumbers');
                    sessionStorage.setItem("04R_closed", true);
                }
                // open
                else{
                    background04R.classList.remove('closedBackground');
                    document.getElementById("04R_number").classList.remove('closedNumbers');
                    document.getElementById("22L_number").classList.remove('closedNumbers');
                    sessionStorage.setItem("04R_closed", false);
                }
            }
            // load runway 15 open/closed status
            if (record.fields['Name'] === 'rwy_15_clsd') {
                // closed
                if(record.fields['content'] == 1){
                    document.getElementById("bringToFront04R22L").style.display = "block";
                    background15.classList.add('closedBackground');
                    document.getElementById("15_number").classList.add('closedNumbers');
                    document.getElementById("33_number").classList.add('closedNumbers');
                    sessionStorage.setItem("15_closed", true);
                }
                // open
                else{
                    background15.classList.remove('closedBackground');
                    document.getElementById("15_number").classList.remove('closedNumbers');
                    document.getElementById("33_number").classList.remove('closedNumbers');
                    sessionStorage.setItem("15_closed", false);
                }
            }
            // load runway 04L open/closed status
            if (record.fields['Name'] === 'rwy_04L_clsd') {
                // closed
                if(record.fields['content'] == 1){
                    background04L.classList.add('closedBackground');
                    document.getElementById("04L_number").classList.add('closedNumbers');
                    document.getElementById("22R_number").classList.add('closedNumbers');
                    sessionStorage.setItem("04L_closed", true);
                }
                // open
                else{
                    background04L.classList.remove('closedBackground');
                    document.getElementById("04L_number").classList.remove('closedNumbers');
                    document.getElementById("22R_number").classList.remove('closedNumbers');
                    sessionStorage.setItem("04L_closed", false);
                }
            }
        }
    })
    .catch(error => console.log('error', error));
}
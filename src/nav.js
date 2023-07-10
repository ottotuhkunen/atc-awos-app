function metrep(){
    document.getElementById("menuTriangle1").style.display = "none";
    document.getElementById("menuTriangle2").style.display = "block";
    //document.getElementById("menuTriangle3").style.display = "none";
    //document.getElementById("menuTriangle4").style.display = "none";
    document.getElementById("mainButton").classList = "mainbuttons mainbuttonInactive"; 
    //document.getElementById("metrepButton").classList = "mainbuttons mainbuttonActive"; 
    //document.getElementById("adSelectionButton").classList = "mainbuttons mainbuttonInactive"; 
    document.getElementById("setupButton").classList = "mainbuttons mainbuttonInactive";
}

function setup(){
    document.getElementById("atisDiv").style.display = "none";
    document.getElementById("mainSvg").style.display = "none";
    document.getElementById("setupDiv").style.display = "block";
    document.getElementById("menuTriangle1").style.display = "none";
    document.getElementById("menuTriangle2").style.display = "block";
    //document.getElementById("menuTriangle3").style.display = "none";
    //document.getElementById("menuTriangle4").style.display = "block";
    document.getElementById("mainButton").classList = "mainbuttons mainbuttonInactive"; 
    //document.getElementById("metrepButton").classList = "mainbuttons mainbuttonInactive"; 
    //document.getElementById("adSelectionButton").classList = "mainbuttons mainbuttonInactive"; 
    document.getElementById("setupButton").classList = "mainbuttons mainbuttonActive"; 
}

function openDepATIS(){
    openAtisWindow(1);
}

function openArrATIS(){
    openAtisWindow(2);
}

function openAtisWindow(atisType){
    if (atisType == 1) {
        document.getElementById("atisDeporArr").innerHTML = "DEPARTURE ATIS";
    }else {
        document.getElementById("atisDeporArr").innerHTML = "ARRIVAL ATIS";
    }

    document.getElementById("atisDiv").style.display = "block";
    document.getElementById("menuTriangle1").style.display = "none";
    document.getElementById("menuTriangle2").style.display = "none";
    document.getElementById("mainSvg").style.display = "none";
    document.getElementById("setupDiv").style.display = "none";
}

function openRWYCC(runway) {
    /*
    if (runway == "04L") {
        window.location.href = "rwycc/index.html";
    }
    else if (runway == "15") {
        window.location.href = "rwycc/index.html";
        document.getElementById("main_rwy_id").textContent = "RWY 15"
        document.getElementById("rwy_condition_report_header").textContent = "RUNWAY 15 CONDITION REPORT AT 00:00 UTC"
    }
    else if (runway == "04R") {
        window.location.href = "rwycc/index.html";
    }
    */

    var url = "rwycc/index.html?runway=" + encodeURIComponent(runway);
    window.location.href = url;
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
        document.getElementById("rwy_condition_report_header").textContent = "RUNWAY 04L CONDITION REPORT AT" + getRWYCCTime();
        document.getElementById("rwy_condition_report_header2").textContent = "RUNWAY 22R CONDITION REPORT AT" + getRWYCCTime();
    }
    else if (runway == "15") {
        document.getElementById("main_rwy_id").textContent = "RWY 15";
        document.getElementById("lfc_title_rwy1").textContent = "RWY 15";
        document.getElementById("lfc_title_rwy2").textContent = "RWY 33";
        document.getElementById("other_rwy_id").textContent = "RWY 33";
        document.getElementById("rwy_title").textContent = "15";
        document.getElementById("rwy_title2").textContent = "EFHK 15";
        document.getElementById("rwy_condition_report_header").textContent = "RUNWAY 15 CONDITION REPORT AT" + getRWYCCTime();
        document.getElementById("rwy_condition_report_header2").textContent = "RUNWAY 33 CONDITION REPORT AT" + getRWYCCTime();
    }
    else if (runway == "04R") {
        document.getElementById("main_rwy_id").textContent = "RWY 04R";
        document.getElementById("lfc_title_rwy1").textContent = "RWY 04R";
        document.getElementById("lfc_title_rwy2").textContent = "RWY 22L";
        document.getElementById("other_rwy_id").textContent = "RWY 22L";
        document.getElementById("rwy_title").textContent = "04R";
        document.getElementById("rwy_title2").textContent = "EFHK 04R";
        document.getElementById("rwy_condition_report_header").textContent = "RUNWAY 04R CONDITION REPORT AT" + getRWYCCTime();
        document.getElementById("rwy_condition_report_header2").textContent = "RUNWAY 22L CONDITION REPORT AT" + getRWYCCTime();
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


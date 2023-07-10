function getDate(){
    var dateUtc = new Date();
    var day = dateUtc.getUTCDate();
    var month = dateUtc.getUTCMonth() + 1;
    var year = dateUtc.getUTCFullYear();
    if ( day < 10 ) { day = "0" + day; }
    if ( month < 10 ) { month = "0" + month; }
    var fullDate = day + "." + month + "." + year;

    var h = dateUtc.getUTCHours();
    var m = dateUtc.getUTCMinutes();
    var s = dateUtc.getUTCSeconds();

    if ( s < 10 ) { s = "0" + s; }
    if ( m < 10 ) { m = "0" + m; }
    if ( h < 10 ) { h = "0" + h; }

    var time = h + ":" + m;
    var seconds = ":" + s;
    
    document.getElementById("dateField").innerHTML= fullDate;
    document.getElementById("timeField").innerHTML= time;
    document.getElementById("secondField").innerHTML= seconds;
    setTimeout(getDate, 1000);
}

function getDate2(){
    var dateUtc = new Date();
    var h = dateUtc.getUTCHours();

    console.log(h);

    if (h > 19 || h < 2) {
        document.getElementById("checkboxDep15").disabled = true;
        document.getElementById("checkboxArr15").disabled = true;
        document.getElementById("checkboxDep33").disabled = true;
        document.getElementById("checkboxArr33").disabled = true;
        document.getElementById("bringToFront04R22L").style.display = "block";
        document.getElementById("rwy15").style.fill = "#d81715";
        document.getElementById("15_number").style.fill = "#dad7d4";
        document.getElementById("33_number").style.fill = "#dad7d4";
    }
    else {
        document.getElementById("checkboxDep15").disabled = false;
        document.getElementById("checkboxArr15").disabled = true;
        document.getElementById("checkboxDep33").disabled = true;
        document.getElementById("checkboxArr33").disabled = true;
        if (document.getElementById("rwy15").style.fill == "#d81715") {
            document.getElementById("rwy15").style.fill = "#B5B5B5";
            document.getElementById("15_number").style.fill = "#DADADA";
            document.getElementById("33_number").style.fill = "#DADADA";
        }
    }

    setTimeout(getDate, 120000);
}
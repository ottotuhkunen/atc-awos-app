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
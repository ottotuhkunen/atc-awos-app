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
    }
    else {
        document.getElementById("atisDeporArr").innerHTML = "ARRIVAL ATIS";
    }

    document.getElementById("atisDiv").style.display = "block";
    document.getElementById("menuTriangle1").style.display = "none";
    document.getElementById("menuTriangle2").style.display = "none";
    document.getElementById("mainSvg").style.display = "none";
    document.getElementById("setupDiv").style.display = "none";


}


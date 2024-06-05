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
    
    document.getElementById("dateValue").textContent= fullDate;
    document.getElementById("timeValue").textContent= time;
    document.getElementById("secondsValue").textContent= seconds;
    setTimeout(getDate, 1000);
}


document.addEventListener('DOMContentLoaded', function() {
    const themeToggle = document.getElementById('modeSelector');
    let currentTheme = localStorage.getItem('theme') || 'light';

    updateTheme(currentTheme);

    // Toggle theme on button click
    themeToggle.addEventListener('click', function() {
        if (currentTheme === 'light') {
            currentTheme = 'dark';
        } else {
            currentTheme = 'light';
        }
        updateTheme(currentTheme);
        localStorage.setItem('theme', currentTheme);
        // window.location.reload();
    });

    function updateTheme(theme) {
        document.getElementById('master-style').href = `src/master-${theme}.css`;
        document.getElementById('runway-style').href = `src/runway-${theme}.css`;
        document.documentElement.setAttribute('data-theme', theme);
    }
});

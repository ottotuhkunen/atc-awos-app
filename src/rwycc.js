let runwayName;

async function setRWYCC(runwayId) {
    // set runways
    document.getElementById("rwyNumber").textContent = "EFHK " + runwayId;
    document.getElementById("rwyNumber3").textContent = runwayId;

    runwayName = runwayId;

    manualRWYCC();

    // try to load SNOWTAM if available

    /*
    try {
        const response = await fetch('/snowtam');
        const data = await response.json();

        if (data.data === "SNOWTAM NIL") {
            manualRWYCC();
        } else {
            // SNOWTAM available
            // assesment time + reported time
            let assesmentTimeData = data.data.match(/ (\d{8}) /);
            assesmentTimeData = assesmentTimeData ? assesmentTimeData[0] : null;

            // Insert linechanges
            let finalSnowtam = data.data.replace(/ (\d{8}) /g, '<br>$1 ');

            document.getElementById('snowtamLine1').innerHTML = "(" + finalSnowtam + ")";
        }
    } catch (error) {
        console.error('Error fetching data:', error);
    }

    */

    /*
        Data to be added according to ID:

        Same for each runway third:

        --coverage_1                    100%
        --rwyccValue_1                  3
        --coveragePercent1              first tspan: 100%       second tspan: 1mm
        --(lfc_1)                       LFC - no data!
        --ldg_1                         LDG 3
        --rcam_1                        RCAM 3
        --contaminantText1              SLIPPERY WET 1mm
        --pattern1,2,3                  (display block when contaminants)

        contaminant icons:              contaminantWet1/2/3, (contaminantDry1/2/3), (contaminantSnow1/2/3)

        assesment part:

        --rwycc1,2,3                    RWYCC #5
        --contaminantTypeSimple1,2,3    DRY / WET etc.
        --contaminantType1,2,3          DRY / WET etc.
        --depth1,2,3                    1 MM
        --depth1_1,2_1,3_1              1 MM
        --coverage1,2,3                 100%
        --coverage1_1,2_1,3_1           100%
        --assesmentTime                 13.09.2023    16:18 UTC
        --reportedTime                  13.09.2023    16:18 UTC
        --to_signif_cont                THIN RWYCC 3/3/3.
        --rwyNumber                     EFHK 04R
        --rwyNumber2                    RUNWAY 04R
        --rwyNumber3                    04R
        --rwyWidth                      60 m
    */
}

let toggleContaminantIcon = 0; // 1=sun 2=wet 3=snow

function manualRWYCC() {
    // always same:
    document.getElementById('coverage_1').textContent = "100%";
    document.getElementById('coverage_2').textContent = "100%";
    document.getElementById('coverage_3').textContent = "100%";
    document.getElementById('coverage1').textContent = "100%";
    document.getElementById('coverage2').textContent = "100%";
    document.getElementById('coverage3').textContent = "100%";
    document.getElementById('coverage1_1').textContent = "100%";
    document.getElementById('coverage2_1').textContent = "100%";
    document.getElementById('coverage3_1').textContent = "100%";

    // assesment time + reported time
    const formatDate = date => `${String(date.getDate()).padStart(2, '0')}.${String(date.getMonth() + 1).padStart(2, '0')}.${date.getFullYear()}`;
    const today = new Date();
    document.getElementById("assesmentTime").textContent = `${formatDate(today)}\u00A0\u00A0\u00A0\u00A0\u00A0 NIL`;
    document.getElementById("reportedTime").textContent = `${formatDate(today)}\u00A0\u00A0\u00A0\u00A0\u00A0 NIL`;

    // RWYCC values
    fetch('/dataEFHK')
    .then(response => response.json())
    .then(result => {
        for (let record of result.records) {
            if (record.fields['Name'] === 'rwycc_all_rwys') {
                document.getElementById('rwyccValue_1').textContent = record.fields['content'];
                document.getElementById('rwyccValue_2').textContent = record.fields['content'];
                document.getElementById('rwyccValue_3').textContent = record.fields['content'];
                document.getElementById('ldg_1').textContent = "LDG " + record.fields['content'];
                document.getElementById('ldg_2').textContent = "LDG " + record.fields['content'];
                document.getElementById('ldg_3').textContent = "LDG " + record.fields['content'];
                document.getElementById('rcam_1').textContent = "RCAM " + record.fields['content'];
                document.getElementById('rcam_2').textContent = "RCAM " + record.fields['content'];
                document.getElementById('rcam_3').textContent = "RCAM " + record.fields['content'];
                document.getElementById('rwycc1').textContent = "RWYCC #" + record.fields['content'];
                document.getElementById('rwycc2').textContent = "RWYCC #" + record.fields['content'];
                document.getElementById('rwycc3').textContent = "RWYCC #" + record.fields['content'];

                // check if RWYCC 6 (DRY) ==> no depth reported
                if (record.fields['content'] == 6) {
                    document.getElementById('depth1').textContent = "NR MM";
                    document.getElementById('depth2').textContent = "NR MM";
                    document.getElementById('depth3').textContent = "NR MM";
                    document.getElementById('depth1_1').textContent = "NR MM";
                    document.getElementById('depth2_1').textContent = "NR MM";
                    document.getElementById('depth3_1').textContent = "NR MM";
                    document.getElementById('to_signif_cont').textContent = "";

                    document.getElementById('contaminantText1').textContent = "DRY";
                    document.getElementById('contaminantText2').textContent = "DRY";
                    document.getElementById('contaminantText3').textContent = "DRY";
                    document.getElementById('contaminantTypeSimple1').textContent = "DRY";
                    document.getElementById('contaminantTypeSimple2').textContent = "DRY";
                    document.getElementById('contaminantTypeSimple3').textContent = "DRY";
                    document.getElementById('contaminantType1').textContent = "DRY";
                    document.getElementById('contaminantType2').textContent = "DRY";
                    document.getElementById('contaminantType3').textContent = "DRY";

                    let tspans1 = document.querySelectorAll('#coveragePercent1 > tspan');
                    let tspans2 = document.querySelectorAll('#coveragePercent2 > tspan');
                    let tspans3 = document.querySelectorAll('#coveragePercent3 > tspan');
                    [tspans1[0].textContent, tspans1[1].textContent] = ['100%', 'NRmm'];
                    [tspans2[0].textContent, tspans2[1].textContent] = ['100%', 'NRmm'];
                    [tspans3[0].textContent, tspans3[1].textContent] = ['100%', 'NRmm'];

                    toggleContaminantIcon = 1; // sun icon

                } else {
                    document.getElementById('depth1').textContent = "1 MM";
                    document.getElementById('depth2').textContent = "1 MM";
                    document.getElementById('depth3').textContent = "1 MM";
                    document.getElementById('depth1_1').textContent = "1 MM";
                    document.getElementById('depth2_1').textContent = "1 MM";
                    document.getElementById('depth3_1').textContent = "1 MM";
                    document.getElementById('to_signif_cont').textContent = "THIN RWYCC " + (record.fields['content'] + "/").repeat(3) + ".";
                    document.getElementById('pattern1').style.display = "block";
                    document.getElementById('pattern2').style.display = "block";
                    document.getElementById('pattern3').style.display = "block";
                    let tspans1 = document.querySelectorAll('#coveragePercent1 > tspan');
                    let tspans2 = document.querySelectorAll('#coveragePercent2 > tspan');
                    let tspans3 = document.querySelectorAll('#coveragePercent3 > tspan');
                    [tspans1[0].textContent, tspans1[1].textContent] = ['100%', '1mm'];
                    [tspans2[0].textContent, tspans2[1].textContent] = ['100%', '1mm'];
                    [tspans3[0].textContent, tspans3[1].textContent] = ['100%', '1mm'];
                }
            }
            if (record.fields['Name'] === 'contaminants')  {
                if (record.fields['content']) {
                    document.getElementById('contaminantText1').textContent = record.fields['content'] + " 1mm";
                    document.getElementById('contaminantText2').textContent = record.fields['content'] + " 1mm";
                    document.getElementById('contaminantText3').textContent = record.fields['content'] + " 1mm";
                    document.getElementById('contaminantTypeSimple1').textContent = record.fields['content'];
                    document.getElementById('contaminantTypeSimple2').textContent = record.fields['content'];
                    document.getElementById('contaminantTypeSimple3').textContent = record.fields['content'];
                    document.getElementById('contaminantType1').textContent = record.fields['content'];
                    document.getElementById('contaminantType2').textContent = record.fields['content'];
                    document.getElementById('contaminantType3').textContent = record.fields['content'];

                    if (record.fields['content'] != "WET" && record.fields['content'] != "SLIPPERY WET" && record.fields['content'] != "STANDING WATER") {
                        toggleContaminantIcon = 3; // snow icon
                    } else {
                        toggleContaminantIcon = 2; // wet icon
                    }
                }
            }
            // runway width (RWYCC page)
            if (record.fields['Name'] === 'rwyWidth') {
                if (record.fields['content']) {
                    document.getElementById('rwyWidth').textContent = record.fields['content'] + " m";
                    if (record.fields['content'] === 60) {
                        document.getElementById('reducedRunwayWidth').textContent = "NIL";
                    } else {
                        document.getElementById('reducedRunwayWidth').textContent = record.fields['content'];
                    }
                    
                }
            }
        }
        setConditionIcon(toggleContaminantIcon);
        document.getElementById("loadingIconRWYCC").style.display = "none";
    })
    .catch(error => console.log('error', error));

    loadFromSnowtam();

}

function setConditionIcon(contaminantType) {
    const configurations = {
        0: {
            dry: 'none',
            wet: 'none',
            snow: 'none'
        },
        1: {
            dry: 'block',
            wet: 'none',
            snow: 'none'
        },
        2: {
            dry: 'none',
            wet: 'block',
            snow: 'none'
        },
        3: {
            dry: 'none',
            wet: 'none',
            snow: 'block'
        }
    };
    
    const config = configurations[contaminantType];
    
    if (config) {
        ['1', '2', '3'].forEach(num => {
            document.getElementById(`contaminantDry${num}`).style.display = config.dry;
            document.getElementById(`contaminantWet${num}`).style.display = config.wet;
            document.getElementById(`contaminantSnow${num}`).style.display = config.snow;
        });
    }    
}

async function loadFromSnowtam() {
    try {
        const response = await fetch('/snowtam');
        const data = await response.json();

        // snow bank distance from centerline (m)
        let matchSnowbankDistance = (/SNOW BANK LR(\d{2})/g).exec(data.data);

        if (matchSnowbankDistance) {
            let snowbankDistance = parseInt(matchSnowbankDistance[1], 10);
            document.getElementById("snbanks_left1").textContent = snowbankDistance + " m";
            document.getElementById("snbanks_right1").textContent = snowbankDistance + " m";
            document.getElementById("snowbanksDistanceText").textContent = snowbankDistance + " / " + snowbankDistance;
            document.getElementById("snowBackground1").style.display = "block";
            document.getElementById("snowBackground2").style.display = "block";
            document.getElementById("snowBackground3").style.display = "block";
            document.getElementById("snowBackground4").style.display = "block";
            document.getElementById("snowBackground5").style.display = "block";
            document.getElementById("snowBackground6").style.display = "block";
        } else {
            document.getElementById("snbanks_left1").textContent = "";
            document.getElementById("snbanks_right1").textContent = "";
            document.getElementById("snowbanksDistanceText").textContent = "NIL / NIL";
            document.getElementById("snowBackground1").style.display = "none";
            document.getElementById("snowBackground2").style.display = "none";
            document.getElementById("snowBackground3").style.display = "none";
            document.getElementById("snowBackground4").style.display = "none";
            document.getElementById("snowBackground5").style.display = "none";
            document.getElementById("snowBackground6").style.display = "none";
        }

        // snow bank height (cm)
        let matchSnowbankHeight = (/SNBANK HEIGHT LR(\d+)CM/g).exec(data.data);

        if (matchSnowbankHeight) {
            let snowbankHeight = matchSnowbankHeight[1];
            document.getElementById("snbanksHeightText1").textContent = snowbankHeight;
            document.getElementById("snbanksHeightText2").textContent = snowbankHeight;
            document.getElementById("snowbanksHeightText").textContent = snowbankHeight + " / " + snowbankHeight;
            document.getElementById("snowBanksBackground1").style.display = "block";
            document.getElementById("snowBanksBackground2").style.display = "block";
            document.getElementById("snbanksHeight1").style.display = "block";
            document.getElementById("snbanksHeight2").style.display = "block";
        } else {
            document.getElementById("snbanksHeightText1").textContent = "";
            document.getElementById("snbanksHeightText2").textContent = "";
            document.getElementById("snowbanksHeightText").textContent = "NIL / NIL";
            document.getElementById("snowBanksBackground1").style.display = "none";
            document.getElementById("snowBanksBackground2").style.display = "none";
            document.getElementById("snbanksHeight1").style.display = "none";
            document.getElementById("snbanksHeight2").style.display = "none";
        }

        // check if runway not in use
        let matchClosedRunway = (/RWY (\d{2}[LR]?) NOT IN USE/g).exec(data.data);
        let matchChemicallyTreated = (/RWY (\d{2}[LR]?) CHEMICALLY TREATED/g).exec(data.data);
        
        if (matchClosedRunway && matchClosedRunway[1] === runwayName) {
            // runway is closed
            document.getElementById("rwyNumber2").textContent = "RUNWAY " + runwayName + " NOT IN USE";
            document.getElementById("rwyNumber2").style.fill = "red";
        } else {
            document.getElementById("rwyNumber2").textContent = "RUNWAY " + runwayName;
            document.getElementById("rwyNumber2").style.fill = "black";
        }

        if (matchChemicallyTreated && matchChemicallyTreated[1] === runwayName) {
            document.getElementById("chemicallyTreated").textContent = "YES";
        } else {
            document.getElementById("chemicallyTreated").textContent = "NO";
        }

    } catch (error) {
        console.error('Error fetching data:', error);
    }

}
async function setRWYCC(runwayId) {
    // set runways
    document.getElementById("rwyNumber").textContent = "EFHK " + runwayId;
    document.getElementById("rwyNumber2").textContent = "RUNWAY " + runwayId;
    document.getElementById("rwyNumber3").textContent = runwayId;

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
                    toggleContaminantIcon = 2; // wet icon
                }
            }
            if (record.fields['Name'] === 'contaminants')  {
                if (record.fields['content']) {
                    document.getElementById('contaminantText1').textContent = record.fields['content'] + " mm";
                    document.getElementById('contaminantText2').textContent = record.fields['content'] + " mm";
                    document.getElementById('contaminantText3').textContent = record.fields['content'] + " mm";
                    document.getElementById('contaminantTypeSimple1').textContent = record.fields['content'];
                    document.getElementById('contaminantTypeSimple2').textContent = record.fields['content'];
                    document.getElementById('contaminantTypeSimple3').textContent = record.fields['content'];
                    document.getElementById('contaminantType1').textContent = record.fields['content'];
                    document.getElementById('contaminantType2').textContent = record.fields['content'];
                    document.getElementById('contaminantType3').textContent = record.fields['content'];
                    if (record.fields['content'] != "WET" || record.fields['content'] != "SLIPPERY WET" || record.fields['content'] != "STANDING WATER") {
                        toggleContaminantIcon = 3; // snow icon
                    }
                } else {
                    document.getElementById('contaminantText1').textContent = "WET 1mm";
                    document.getElementById('contaminantText2').textContent = "WET 1mm";
                    document.getElementById('contaminantText3').textContent = "WET 1mm";
                    document.getElementById('contaminantTypeSimple1').textContent = "WET";
                    document.getElementById('contaminantTypeSimple2').textContent = "WET";
                    document.getElementById('contaminantTypeSimple3').textContent = "WET";
                    document.getElementById('contaminantType1').textContent = "WET";
                    document.getElementById('contaminantType2').textContent = "WET";
                    document.getElementById('contaminantType3').textContent = "WET";
                    toggleContaminantIcon = 2; // wet icon
                }
            }

            if (record.fields['Name'] === 'rwyWidth') {
                document.getElementById('rwyWidth').textContent = record.fields['content'] + " m";
                document.getElementById('reducedRunwayWidth').textContent = record.fields['content'] + " meters";
            } else {
                document.getElementById('rwyWidth').textContent = "60 m";
                document.getElementById('reducedRunwayWidth').textContent = "NIL";
            }
        }
        setConditionIcon(toggleContaminantIcon);
    })
    .catch(error => console.log('error', error));
    
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
function windComponentCalculator(windSpeed, windDirection, runway) {
       var crosswind = 0;
       var tailwind = 0;
       
       if (windSpeed < 1) {
              document.getElementById("04L_components").textContent = "";
              document.getElementById("04R_components").textContent = "";
              document.getElementById("15_components").textContent = "";
              document.getElementById("33_components").textContent = "";
              document.getElementById("22L_components").textContent = "";
              document.getElementById("22R_components").textContent = "";
       }
       
       else {
              if (runway == "arrow04L") {
                     // NO TAILWIND COMPONENT
                     if (windDirection >= 10 && windDirection <= 130 || windDirection >= 310){ 
                            crosswind = windSpeed * (Math.sin((38 - windDirection) * Math.PI / 180));
                            crosswind = crosswind.toString().replace('-','');
                            document.getElementById("04L_components").textContent = "\xa0\xa0\xa0 X" + Math.round(crosswind);
                     }
                     // TAILWIND EXISTS
                     else { 
                            crosswind = windSpeed * (Math.sin((38 - windDirection) * Math.PI / 180));
                            crosswind = crosswind.toString().replace('-','');
                            tailwind = windSpeed * (Math.cos((38 - windDirection) * Math.PI / 180));
                            tailwind = tailwind.toString().replace('-','');
                            document.getElementById("04L_components").textContent = "T" + Math.round(tailwind) + " X" + Math.round(crosswind);
                     }
              }
              if (runway == "arrow04R") {
                     // NO TAILWIND COMPONENT
                     if (windDirection >= 10 && windDirection <= 130 || windDirection >= 310){ 
                            crosswind = windSpeed * (Math.sin((38 - windDirection) * Math.PI / 180));
                            crosswind = crosswind.toString().replace('-','');
                            document.getElementById("04R_components").textContent = "\xa0\xa0\xa0 X" + Math.round(crosswind);
                     }
                     // TAILWIND EXISTS
                     else { 
                            crosswind = windSpeed * (Math.sin((38 - windDirection) * Math.PI / 180));
                            crosswind = crosswind.toString().replace('-','');
                            tailwind = windSpeed * (Math.cos((38 - windDirection) * Math.PI / 180));
                            tailwind = tailwind.toString().replace('-','');
                            document.getElementById("04R_components").textContent = "T" + Math.round(tailwind) + " X" + Math.round(crosswind);
                     }
              }
              if (runway == "arrow22L") {
                     // NO TAILWIND COMPONENT
                     if (windDirection >= 130 && windDirection <= 310){ 
                            crosswind = windSpeed * (Math.sin((218 - windDirection) * Math.PI / 180));
                            crosswind = crosswind.toString().replace('-','');
                            document.getElementById("22L_components").textContent = "\xa0\xa0\xa0 X" + Math.round(crosswind);
                     }
                     // TAILWIND EXISTS
                     else { 
                            crosswind = windSpeed * (Math.sin((218 - windDirection) * Math.PI / 180));
                            crosswind = crosswind.toString().replace('-','');
                            tailwind = windSpeed * (Math.cos((218 - windDirection) * Math.PI / 180));
                            tailwind = tailwind.toString().replace('-','');
                            document.getElementById("22L_components").textContent = "T" + Math.round(tailwind) + " X" + Math.round(crosswind);
                     }
              }
              if (runway == "arrow22R") {
                     // NO TAILWIND COMPONENT
                     if (windDirection >= 130 && windDirection <= 310){ 
                            crosswind = windSpeed * (Math.sin((218 - windDirection) * Math.PI / 180));
                            crosswind = crosswind.toString().replace('-','');
                            document.getElementById("22R_components").textContent = "\xa0\xa0\xa0 X" + Math.round(crosswind);
                     }
                     // TAILWIND EXISTS
                     else { 
                            crosswind = windSpeed * (Math.sin((218 - windDirection) * Math.PI / 180));
                            crosswind = crosswind.toString().replace('-','');
                            tailwind = windSpeed * (Math.cos((218 - windDirection) * Math.PI / 180));
                            tailwind = tailwind.toString().replace('-','');
                            document.getElementById("22R_components").textContent = "T" + Math.round(tailwind) + " X" + Math.round(crosswind);
                     }
              }
              if (runway == "arrow15") {
                     // NO TAILWIND COMPONENT
                     if (windDirection >= 60 && windDirection <= 240){ 
                            crosswind = windSpeed * (Math.sin((144 - windDirection) * Math.PI / 180));
                            crosswind = crosswind.toString().replace('-','');
                            document.getElementById("15_components").textContent = "\xa0\xa0\xa0 X" + Math.round(crosswind);
                     }
                     // TAILWIND EXISTS
                     else { 
                            crosswind = windSpeed * (Math.sin((144 - windDirection) * Math.PI / 180));
                            crosswind = crosswind.toString().replace('-','');
                            tailwind = windSpeed * (Math.cos((144 - windDirection) * Math.PI / 180));
                            tailwind = tailwind.toString().replace('-','');
                            document.getElementById("15_components").textContent = "T" + Math.round(tailwind) + " X" + Math.round(crosswind);
                     }
              }
              if (runway == "arrow33") {
                     // NO TAILWIND COMPONENT
                     if (windDirection >= 240 && windDirection <= 360 || windDirection <= 60){ 
                            crosswind = windSpeed * (Math.sin((324 - windDirection) * Math.PI / 180));
                            crosswind = crosswind.toString().replace('-','');
                            document.getElementById("33_components").textContent = "\xa0\xa0\xa0 X" + Math.round(crosswind);
                     }
                     // TAILWIND EXISTS
                     else { 
                            crosswind = windSpeed * (Math.sin((324 - windDirection) * Math.PI / 180));
                            crosswind = crosswind.toString().replace('-','');
                            tailwind = windSpeed * (Math.cos((324 - windDirection) * Math.PI / 180));
                            tailwind = tailwind.toString().replace('-','');
                            document.getElementById("33_components").textContent = "T" + Math.round(tailwind) + " X" + Math.round(crosswind);
                     }
              }
              
       }
}
<script>

</script>
<div class="comp_front9" id="frontContainer">
        <img class="dr-icon" alt="" src="./public/dr@2x.png" />


        <div class="medical-center">Medical Center</div>
        <div class="health-safety">Health Safety</div>
        <div class="taglline">taglline</div>
    </div>
<style>

</style>

<html lang=”en’>

<head>
    <meta charset="utf-8" />
    <meta name="viewport" content="initial-scale=1, width=device-width" />



    <link rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Abhaya Libre ExtraBold:wght@400&display=swap" />
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Abhaya Libre Medium:wght@400&display=swap" />
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Actor:wght@400&display=swap" />


    <style>
        body {
            margin: 0;
            line-height: normal;
        }


        :root {
            /* fonts */
            --font-actor: Actor;
            --font-abril-fatface: "Abril Fatface";
            --font-abhaya-libre-medium: "Abhaya Libre Medium";
            --font-abhaya-libre-extrabold: "Abhaya Libre ExtraBold";


            /* font sizes */
            --font-size-sm: 14px;


            /* Colors */
            --color-gray-100: #0f0f0f;
        }


        /* front css */
        .dr-icon {
            position: absolute;
            top: 1px;
            left: 1px;
            border-radius: 30px;
            width: 149px;
            height: 199px;
            object-fit: cover;
        }


        .health-safety,
        .medical-center {
            position: absolute;
            top: 20px;
            right: 17px;
        }


        .health-safety {
            top: 49px;
            font-size: 20px;
            font-family: var(--font-abhaya-libre-medium);
            color: #0f0f0f;
        }


        .taglline {
            position: absolute;
            top: 83px;
            right: 84px;
            font-size: 14px;
            font-family: var(--font-actor);
            text-align: left;
        }


        .front9 {
            position: relative;
            border-radius: 12px;
            background-color: #f0c540;
            width: 300px;
            height: 200px;
            overflow: hidden;
            text-align: right;
            font-size: 25px;
            color: var(--color-gray-100);
            font-family: var(--font-abhaya-libre-extrabold);
        }


        /* back css */
        .medical-center1 {
            position: absolute;
            top: 16px;
            left: calc(50% - 79px);
            font-size: 25px;
            font-family: var(--font-abhaya-libre-extrabold);
            color: #1e1e1e;
            text-align: right;
        }


        .call-now-123-456-7890,
        .health-safety1 {
            position: absolute;
            font-family: var(--font-abhaya-libre-medium);
        }


        .health-safety1 {
            top: 38px;
            left: calc(50% - 51px);
            font-size: 20px;
            text-align: right;
        }


        .call-now-123-456-7890 {
            bottom: 18px;
            left: calc(50% - 65px);
        }


        .heart-with-pulse {
            position: absolute;
            top: 17px;
            right: 22px;
            width: 41px;
            height: 45px;
            object-fit: cover;
        }


        .emergency-services {
            position: absolute;
            top: calc(50% - 18px);
            left: calc(50% - 64px);
        }


        .get-a-free,
        .halth-screening {
            position: absolute;
            top: calc(50% + 4px);
            left: calc(50% - 52px);
        }


        .get-a-free {
            top: calc(50% + 26px);
            left: calc(50% - 72px);
        }


        .hospital-3-icon,
        .organ-transplantation-icon,
        .stethoscope-icon {
            position: absolute;
            top: calc(50% + 5px);
            left: calc(50% - 74px);
            width: 20px;
            height: 20px;
            object-fit: cover;
        }


        .hospital-3-icon,
        .organ-transplantation-icon {
            top: calc(50% + 26px);
            left: calc(50% - 94px);
        }


        .hospital-3-icon {
            top: calc(50% - 19px);
            left: calc(50% - 84px);
        }


        .back9 {
            position: relative;
            border-radius: 12px;
            background-color: #f0c540;
            width: 300px;
            height: 200px;
            overflow: hidden;
            text-align: left;
            font-size: var(--font-size-sm);
            color: var(--color-gray-100);
            font-family: var(--font-abril-fatface);
        }
    </style>
</head>


<body>
    
    <div class="back9" id="backContainer">
        <div class="medical-center1">Medical Center</div>
        <div class="health-safety1">Health Safety</div>
        <div class="call-now-123-456-7890">Call Now +123-456-7890</div>
        <img class="heart-with-pulse" alt="" src="./public/heart-with-pulse@2x.png" />


        <div class="emergency-services">Emergency Services</div>
        <div class="halth-screening">Halth Screening</div>
        <div class="get-a-free">Get a free Consultation</div>
        <img class="stethoscope-icon" alt="" src="./public/stethoscope@2x.png" />


        <img class="organ-transplantation-icon" alt="" src="./public/organ-transplantation@2x.png" />


        <img class="hospital-3-icon" alt="" src="./public/hospital-3@2x.png" />
    </div>


    <script>
        var frontContainer = document.getElementById("frontContainer");
        var backContainer = document.getElementById("backContainer");



        frontContainer.style.display = "block";
        backContainer.style.display = "none";


        if (frontContainer && backContainer) {
            frontContainer.addEventListener("click", function (e) {
                frontContainer.style.display = "none"; // Hide the frontContainer
                backContainer.style.display = "block"; // Show the backContainer
            });


            backContainer.addEventListener("click", function (e) {
                frontContainer.style.display = "block"; // Hide the frontContainer
                backContainer.style.display = "none"; // Show the backContainer
            });



        }
    </script>
</body>


</html>

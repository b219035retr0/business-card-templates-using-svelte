<!--
-----------------------------------------
// filename: Front1.svelte
// created: 2023-10-26
-->
<script>

</script>
<div class="comp_front1" id="frontContainer">
        <img class="front1-child" alt="" src="./public/rectangle-1.svg" />


        <div class="chocobella">Chocobella</div>
        <b class="cakes-cookies">Cakes & Cookies</b>
    </div>
<style>

</style>

<!--
-----------------------------------------
// filename: App.svelte
// created: 2023-10-26
-->


<html lang="en">


<head>
    <meta charset="utf-8" />
    <meta name="viewport" content="initial-scale=1, width=device-width" />


    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Island Moments:wght@400&display=swap" />
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Josefin Slab:wght@700&display=swap" />


    <style>


        /* global css */
        body {
            margin: 0;
            line-height: normal;
        }


        :root {
            /* fonts */
            --font-josefin-sans: "Josefin Sans";
            --font-josefin-slab: "Josefin Slab";
            --font-island-moments: "Island Moments";


            /* Colors */
            --color-black: #000;
        }


        /* front css */
        .front1-child {
            position: absolute;
            top: calc(50% - 41px);
            left: calc(50% - 150px);
            width: 300px;
            height: 89px;
        }


        .cakes-cookies,
        .chocobella {
            position: absolute;
            top: calc(50% - 28px);
            left: calc(50% - 62px);
            display: inline-block;
            width: 128px;
            height: 36px;
        }


        .cakes-cookies {
            top: calc(50% + 8px);
            left: calc(50% - 42px);
            font-size: 12px;
            font-family: var(--font-josefin-slab);
            width: 84px;
            height: 6px;
        }


        .front1 {
            position: relative;
            border-radius: 12px;
            width: 300px;
            height: 200px;
            overflow: hidden;
            background-image: url(./public/front@3x.png);
            background-size: cover;
            background-repeat: no-repeat;
            background-position: top;
            cursor: pointer;
            text-align: center;
            font-size: 40px;
            color: var(--color-black);
            font-family: var(--font-island-moments);
        }



        /* back css */


        .back1-child {
            position: absolute;
            top: 0;
            left: 0;
            width: 192px;
            height: 200px;
        }


        .cakes-cookies1,
        .chocobella1 {
            position: absolute;
            top: 22px;
            left: 17px;
            display: inline-block;
            width: 128px;
            height: 36px;
        }


        .cakes-cookies1 {
            top: 58px;
            left: 26px;
            font-size: 12px;
            font-family: var(--font-josefin-slab);
            width: 84px;
            height: 6px;
        }


        .p {
            margin: 0;
        }


        .chocobellafriends-colony-nag-container1 {
            position: absolute;
            top: 123px;
            left: 25px;
            font-size: 10px;
            font-family: var(--font-josefin-sans);
            color: #1e1e1e;
            text-align: left;
            display: inline-block;
            width: 167px;
            text-shadow: 0 4px 4px rgba(0, 0, 0, 0.25);
        }


        .back1 {
            position: relative;
            border-radius: 12px;
            width: 300px;
            height: 200px;
            overflow: hidden;
            background-image: url(./public/back@3x.png);
            background-size: cover;
            background-repeat: no-repeat;
            background-position: top;
            cursor: pointer;
            text-align: center;
            font-size: 40px;
            color: var(--color-black);
            font-family: var(--font-island-moments);
        }
    </style>
</head>


<body>
    <!-- front -->
    


    <!-- back -->
    <div class="back1" id="backContainer">
        <img class="back1-child" alt="" src="./public/rectangle-2.svg" />


        <div class="chocobella1">Chocobella</div>
        <b class="cakes-cookies1">Cakes & Cookies</b>
        <div class="chocobellafriends-colony-nag-container1">
            <p class="p">+123-456-7890</p>
            <p class="p">Chocobella,Friends Colony, Nagpur</p>
            <p class="p">chocobella@gmail.com</p>
            <p class="p">www.chocobella.com</p>
        </div>
    </div>


    <!-- flip js -->
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

<!DOCTYPE html>
<html lang="fr">
<head>
    <title>Projet WebGL : Chicken World</title>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, user-scalable=no, minimum-scale=1.0, maximum-scale=1.0">
    <link type="text/css" rel="stylesheet" href="main.css">
    <style>
        #blocker {
            position: absolute;
            width: 100%;
            height: 100%;
        }

        #instructions {
            width: 100%;
            height: 100%;

            display: -webkit-box;
            display: -moz-box;
            display: box;

            -webkit-box-orient: horizontal;
            -moz-box-orient: horizontal;
            box-orient: horizontal;

            -webkit-box-pack: center;
            -moz-box-pack: center;
            box-pack: center;

            -webkit-box-align: center;
            -moz-box-align: center;
            box-align: center;

            color: #ffffff;
            text-align: center;
            font-family: Arial;
            font-size: 14px;
            line-height: 24px;

            cursor: pointer;
        }
    </style>
</head>
<body>

<div class="page-bg">
    <div class="preloader">
        <div class="preloader-box">
            <div>L</div>
            <div>O</div>
            <div>A</div>
            <div>D</div>
            <div>I</div>
            <div>N</div>
            <div>G</div>
        </div>
    </div>
    <button style="--content: 'Lancer';">
        <div class="left"></div>
        Lancer
        <div class="right"></div>
    </button>
</div>












<div id="game">

		<div id="blocker">
            <div id="instructions">
                <span style="font-size:36px">Cliquez pour jouer </span>
                <br /><br />
                Bouger: WASD ou FLECHES<br/>
                Sauter: ESPACE<br/>
                Regarder: SOURIS
            </div>
        </div>

		<script type="module" src="src/js/main.js"></script>
		<script type="text/javascript" src="src/js/dat.gui.min.js"></script>
    </div>




	</body>
</html>

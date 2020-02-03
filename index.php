<!DOCTYPE html>
<html lang="fr">
    <head>
        <title>Projet WebGL : Chicken World</title>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, user-scalable=no, minimum-scale=1.0, maximum-scale=1.0">
        <link type="text/css" rel="stylesheet" href="main.css">

    </head>

    <body>

        <div class="page-bg">

            <button>
                Lancer
            </button>

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

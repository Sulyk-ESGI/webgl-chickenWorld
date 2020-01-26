import * as THREE from './three.module.js';
import Stats from './stats.module.js';
import { GUI } from './dat.gui.module.js';
import { GLTFLoader } from './GLTFLoader.js'
import { FlyControls } from './FlyControls.js';

var container, stats;
var camera, scene,controls, renderer;
var MARGIN = 0;
var SCREEN_HEIGHT = window.innerHeight - MARGIN * 2;
var SCREEN_WIDTH = window.innerWidth;
var d = new THREE.Vector3();
var clock = new THREE.Clock();

init();
animate();

function init() {
    // Création d'une div dans le dom, et ajout du container
    container = document.createElement('div');
    document.body.appendChild(container);

    // Création de la scène
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0xCCE0FF);
    scene.fog = new THREE.Fog( 0xcce0ff, 400, 2000 );

    // Création de notre caméra
    camera = new THREE.PerspectiveCamera( 25, SCREEN_WIDTH / SCREEN_HEIGHT, 50, 1e7 );
    // Définition de la position de la caméra
        camera.position.z = 500;
        camera.position.y = 150;
        camera.position.x = 10;
        camera.rotation.y = 10;

    renderer = new THREE.WebGLRenderer( { antialias: true } );
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( SCREEN_WIDTH, SCREEN_HEIGHT );
    document.body.appendChild( renderer.domElement );

    //Controls
    controls = new FlyControls( camera, renderer.domElement );
    controls.movementSpeed = 1000;
    controls.domElement = renderer.domElement;
    controls.rollSpeed = Math.PI / 24;
    controls.autoForward = false;
    controls.dragToLook = false;


    setLights();

    grounds();

    rendered();

    setStatsModule();

    loadIle();

    loadHouse();

    loadboat();

    loadtree();

    loadChiken();

    for (var i = 0; i < 10; i++)
    {
        loadcrystal((0+(i-0.5)),25.9,(-10+(i*0.1)));
    }

    // Evenement resize relié à la fonction onWindowResize
    // window.addEventListener('resize', onWindowResize, false);
}

/**
 * Fonction d'ajout de lumière
 */
function setLights() {
    // Ajout d'une lumière ambiante à notre scène
    scene.add(new THREE.AmbientLight(0x666666));
    // Ajout d'une lumière directionnelle d'intensité 1
    var light = new THREE.DirectionalLight(0xdfebff, 1);

    /**
     * Position de là où pointe la lumière (x, y, z)
     * Activation des ombres pour la lumière
     * Propriétés des ombres (width / height)
     */
    light.position.set(50, 200, 100);
    light.castShadow = true;
    light.shadow.mapSize.width = 1024;
    light.shadow.mapSize.height = 1024;

    var d = 300;
    light.shadow.camera.left = -d;
    light.shadow.camera.right = d;
    light.shadow.camera.top = d;
    light.shadow.camera.bottom = -d;
    light.shadow.camera.far = 1000;
    scene.add(light);
}

/**
 * Fonction de création du sol
 */
function grounds() {
    // Pré-chargement d'une texture
    var loader = new THREE.TextureLoader();
    // Chargement de la texture du sol
    var groundTexture = loader.load('src/textures/water.png');
    // Activation du mode wrap pour la répétition de la texture
    groundTexture.wrapS = groundTexture.wrapT = THREE.RepeatWrapping;
    // Paramtère de répétition de la texture
    groundTexture.repeat.set(10,10);
    // Gestion du flou
    groundTexture.anisotropy = 16;
    // Encodage avec sRGBEncoding pour une image plus nette
    groundTexture.encoding = THREE.sRGBEncoding;
    // Liaison material <=> texture
    var groundMaterial = new THREE.MeshLambertMaterial({map: groundTexture});
    // Création de notre mesh
    var mesh = new THREE.Mesh(new THREE.PlaneBufferGeometry( 20000, 20000 ), groundMaterial);
    // Définition de la position Y de notre plateau
    mesh.position.y = -250;
    // Ajout d'une rotation en x
    mesh.rotation.x = -Math.PI / 2;
    // Activation des ombres sur le sol
    mesh.receiveShadow = true;
    // Ajout à la scène
    scene.add(mesh);
}

/**
 * Fonction de paramètrage du rendered
 */
function rendered() {
    // Paramètre du rendered
    renderer = new THREE.WebGLRenderer( { antialias: true } );
    renderer.setPixelRatio( window.devicePixelRatio );
    // Définition de la taille de notre rendered par les dimensions de notre fenêtre
    renderer.setSize(window.innerWidth, window.innerHeight);
    // Ajout des elements dom à notre container
    container.appendChild( renderer.domElement );
    // Encodage de la sortie avec sRGBEncoding
    renderer.outputEncoding = THREE.sRGBEncoding;
    // Activation des ombres globales
    renderer.shadowMap.enabled = true;
}

/**
 * Fonction de paramètrage de l'Orbit Control
 */


/**
 * Fonction d'initialisation du module stats
 */
function setStatsModule() {
    // Utilisation du module stats et ajout dans notre container
    stats = new Stats();
    container.appendChild(stats.dom);
}

/**
 * Affichage du model 3D de la maison
 */
function loadIle() {
    var loader = new GLTFLoader();
    loader.load(
        // Chemin de la ressource
        './src/objects/terrain/scene.gltf',
        // called when the resource is loaded
        function (gltf) {
            gltf.scene.traverse( function ( child ) {

                if ( child.isMesh ) {

                    child.castShadow = true;
                    child.receiveShadow = true;

                }

            } );
            scene.add(gltf.scene);

            gltf.animations; // Array<THREE.AnimationClip>
            gltf.scene; // THREE.Scene
            gltf.scenes; // Array<THREE.Scene>
            gltf.cameras; // Array<THREE.Camera>
            gltf.asset; // Object

           /* gltf.scene.rotation.y = -300;
            gltf.scene.position.x = 500;
            gltf.scene.position.z = -750;
            gltf.scene.position.y = -150;*/
        },

        // Fonction appelée lors du chargement
        function (xhr) {
            console.log((xhr.loaded / xhr.total * 100) + '% loaded ile');
        },

        // Fonction appelée lors d'une quelconque erreur
        function (error) {
            console.log('Une erreur est survenue');
            console.log(error)
        }
    );

}

function loadtree() {
    var loader = new GLTFLoader();
    loader.load(
        // Chemin de la ressource
        './src/objects/tree/scene.gltf',
        // called when the resource is loaded
        function (gltf) {
            scene.add(gltf.scene);

            gltf.animations; // Array<THREE.AnimationClip>
            gltf.scene; // THREE.Scene
            gltf.scenes; // Array<THREE.Scene>
            gltf.cameras; // Array<THREE.Camera>
            gltf.asset; // Object

            gltf.scene.rotation.y = 0;
            gltf.scene.position.x = 1800;
            gltf.scene.position.z = -600;
            gltf.scene.position.y = -500;
        },

        // Fonction appelée lors du chargement
        function (xhr) {
            console.log((xhr.loaded / xhr.total * 100) + '% loaded tree');
        },

        // Fonction appelée lors d'une quelconque erreur
        function (error) {
            console.log('Une erreur est survenue');
            console.log(error)
        }
    );
}

function loadChiken() {
    var loader = new GLTFLoader();
    loader.load(
        // Chemin de la ressource
        './src/objects/chicken/scene.gltf',
        // called when the resource is loaded
        function (gltf) {
            scene.add(gltf.scene);

            gltf.animations; // Array<THREE.AnimationClip>
            gltf.scene.scale.set(2,2,2); // THREE.Scene
            gltf.scenes; // Array<THREE.Scene>
            gltf.cameras; // Array<THREE.Camera>
            gltf.asset; // Object

            gltf.scene.rotation.y = 10;
            gltf.scene.position.x = 10; //longeur
            gltf.scene.position.z = 50;//profondeur
            gltf.scene.position.y = 26; //hauteur
        },

        // Fonction appelée lors du chargement
        function (xhr) {
            console.log((xhr.loaded / xhr.total * 100) + '% loaded poulet');
        },

        // Fonction appelée lors d'une quelconque erreur
        function (error) {
            console.log('Une erreur est survenue sur le poulet');
            console.log(error)
        }
    );
}

function loadboat() {
    var loader = new GLTFLoader();
    loader.load(
        // Chemin de la ressource
        './src/objects/boat/scene.gltf',
        // called when the resource is loaded
        function (gltf) {
            gltf.scene.traverse( function ( child ) {

                if ( child.isMesh ) {

                    child.castShadow = true;
                    child.receiveShadow = true;

                }

            } );
            scene.add(gltf.scene);

            gltf.animations; // Array<THREE.AnimationClip>
            gltf.scene.scale.set(0.1,0.1,0.1); // THREE.Scene
            gltf.scenes; // Array<THREE.Scene>
            gltf.cameras; // Array<THREE.Camera>
            gltf.asset; // Object


            gltf.scene.rotation.y = 0;
            gltf.scene.position.x = 0;
            gltf.scene.position.z = 130;
            gltf.scene.position.y = 12;
        },

        // Fonction appelée lors du chargement
        function (xhr) {
            console.log((xhr.loaded / xhr.total * 100) + '% loaded tree');
        },

        // Fonction appelée lors d'une quelconque erreur
        function (error) {
            console.log('Une erreur est survenue');
            console.log(error)
        }
    );
}

function loadcrystal(Px,Py,Pz) {
    var loader = new GLTFLoader();
    loader.load(
        // Chemin de la ressource
        './src/objects/crystal/scene.gltf',
        // called when the resource is loaded
        function (gltf) {
            scene.add(gltf.scene);

            gltf.animations; // Array<THREE.AnimationClip>
            gltf.scene.scale.set(2,2,2); // THREE.Scene
            gltf.scenes; // Array<THREE.Scene>
            gltf.cameras; // Array<THREE.Camera>
            gltf.asset; // Object

            gltf.scene.rotation.y = 80;
            gltf.scene.position.x = Px;
            gltf.scene.position.z = Pz;
            gltf.scene.position.y = Py;
        },

        // Fonction appelée lors du chargement
        function (xhr) {
            console.log((xhr.loaded / xhr.total * 100) + '% loaded house');
        },

        // Fonction appelée lors d'une quelconque erreur
        function (error) {
            console.log('Une erreur est survenue');
            console.log(error)
        }
    );
}

function loadHouse() {
    var loader = new GLTFLoader();
    loader.load(
        // Chemin de la ressource
        './src/objects/house/scene.gltf',
        // called when the resource is loaded
        function (gltf) {
            scene.add(gltf.scene);

            gltf.animations; // Array<THREE.AnimationClip>
            gltf.scene.scale.set(1.5,1.5,1.5); // THREE.Scene
            gltf.scenes; // Array<THREE.Scene>
            gltf.cameras; // Array<THREE.Camera>
            gltf.asset; // Object

            gltf.scene.rotation.y =  90 * Math.PI / 180;
            gltf.scene.position.x = 17;
            gltf.scene.position.z = 72;
            gltf.scene.position.y = 30.29;
        },

        // Fonction appelée lors du chargement
        function (xhr) {
            console.log((xhr.loaded / xhr.total * 100) + '% loaded house');
        },

        // Fonction appelée lors d'une quelconque erreur
        function (error) {
            console.log('Une erreur est survenue');
            console.log(error)
        }
    );

}

function loader(objectName,Px,Py,Pz,scale) {
    var loader = new GLTFLoader();
    loader.load(
        // Chemin de la ressource
        './src/objects/'+objectName+'/scene.gltf',
        // called when the resource is loaded
        function (gltf) {
            gltf.scene.traverse( function ( child ) {
                if ( child.isMesh ) {
                    child.castShadow = true;
                    child.receiveShadow = true;
                }
            } );
            scene.add(gltf.scene);

            gltf.animations; // Array<THREE.AnimationClip>
            gltf.scene.scale.set(scale,scale,scale); // THREE.Scene
            gltf.scenes; // Array<THREE.Scene>
            gltf.cameras; // Array<THREE.Camera>
            gltf.asset; // Object

            gltf.scene.rotation.y = 0;
            gltf.scene.position.x = Px;
            gltf.scene.position.z = Pz;
            gltf.scene.position.y = Py;
        },

        // Fonction appelée lors du chargement
        function (xhr) {
            console.log((xhr.loaded / xhr.total * 100) + '% loaded tree');
        },

        // Fonction appelée lors d'une quelconque erreur
        function (error) {
            console.log('Une erreur est survenue');
            console.log(error)
        }
    );
}

/**
 * Fonction d'évenement, lancée en cas de resize de la fenêtre
 */
/*function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight );
}*/

/**
 * Fonction d'animation du monde
 */
function animate() {
    requestAnimationFrame( animate );
    render();
    stats.update();

}

/**
 * Fonction de rendu
 */
function render() {
    var delta = clock.getDelta();
    renderer.render(scene, camera);
    controls.movementSpeed = 0.33 * d;
    controls.update( delta );
}
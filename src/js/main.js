import * as THREE from '../../build/three.module.js';
import  Stats from './stats.module.js';
import { GLTFLoader } from './GLTFLoader.js'


import { PointerLockControls } from '../jsm/controls/PointerLockControls.js';

var camera, scene, renderer, controls;
var stats;
var container;
var objects = [];

var raycaster;
var spotLight, lightHelper,lightHelper2, shadowCameraHelper, light, shadow;

var moveForward = false;
var moveBackward = false;
var moveLeft = false;
var moveRight = false;
var canJump = false;

var prevTime = performance.now();
var velocity = new THREE.Vector3();
var direction = new THREE.Vector3();
//var vertex = new THREE.Vector3();
//var color = new THREE.Color();



/////////////////////////////////////////
// 		Paramètres des contrôles   	   //
/////////////////////////////////////////
const gui = new dat.GUI();
var params = {
    movSpeed: 50,

};

gui.add(params, 'movSpeed').name('Speed').min(0).max(60).step(1);



init();
animate();

function init() {

    // Création d'une div dans le dom, et ajout du container
    container = document.createElement('div');
    document.body.appendChild(container);

    renderer = new THREE.WebGLRenderer();
    renderer.shadowMap.enabled = true;

    camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 1, 30500 );
    camera.position.y = 0;
    camera.position.x= 150;
    camera.position.z= 500;
    camera.rotation.y= 4;
    camera.rotation.x = 0;
    camera.rotation.z = 0;

    //Creation de la scene
    // Pré-chargement d'une texture

    scene = new THREE.Scene();


    //Fog
    scene.fog = new THREE.Fog( 0x00001a, 0, 24500 );

    /*
     * CREATION DE LA SKYBOX
     */

    let materialArray = [];
    let texture_ft = new THREE.TextureLoader().load( './src/textures/ame_nebula/purplenebula_ft.jpg');
    let texture_bk = new THREE.TextureLoader().load( './src/textures/ame_nebula/purplenebula_bk.jpg');
    let texture_up = new THREE.TextureLoader().load( './src/textures/ame_nebula/purplenebula_up.jpg');
    let texture_dn = new THREE.TextureLoader().load( './src/textures/ame_nebula/purplenebula_dn.jpg');
    let texture_rt = new THREE.TextureLoader().load( './src/textures/ame_nebula/purplenebula_rt.jpg');
    let texture_lf = new THREE.TextureLoader().load( './src/textures/ame_nebula/purplenebula_lf.jpg');

    materialArray.push(new THREE.MeshBasicMaterial( { map: texture_ft }));
    materialArray.push(new THREE.MeshBasicMaterial( { map: texture_bk }));
    materialArray.push(new THREE.MeshBasicMaterial( { map: texture_up }));
    materialArray.push(new THREE.MeshBasicMaterial( { map: texture_dn }));
    materialArray.push(new THREE.MeshBasicMaterial( { map: texture_rt }));
    materialArray.push(new THREE.MeshBasicMaterial( { map: texture_lf }));

    for (let i = 0; i < 6; i++)
        materialArray[i].side = THREE.BackSide;

    let skyboxGeo = new THREE.BoxGeometry( 30000, 30000, 30000);
    let skybox = new THREE.Mesh( skyboxGeo, materialArray );

    scene.add( skybox );

    /**
     * Position de là où pointe la lumière (x, y, z)
     * Activation des ombres pour la lumière
     * Propriétés des ombres (width / height)
     */

    //Light test + helper

    var ambient = new THREE.AmbientLight( 0xFFEFB1, 0.5 );
    scene.add( ambient );

    //House light
    spotLight = new THREE.SpotLight( 0xffffff, 1.9 );
    spotLight.position.set( -10, 10, 2 );
    spotLight.angle = Math.PI ;
    spotLight.penumbra = 0.05;
    spotLight.decay = 1.8;
    spotLight.distance = 2000;

    //First light of boat
    var spotLight2 = new THREE.SpotLight( 0xff9900, 1.6 );
    spotLight2.position.set( 1550, 140, -350 );
    spotLight2.angle = Math.PI
    spotLight2.penumbra = 0.05;
    spotLight2.decay = 1.8;
    spotLight2.distance = 1500;

    //Second light of boat
    var spotLight3 = new THREE.SpotLight( 0xff9900, 1.6 );
    spotLight3.position.set( 1850, 150, -500 );
    spotLight3.angle = Math.PI;
    spotLight3.penumbra = 0.05;
    spotLight3.decay = 1.8;
    spotLight3.distance = 1500;

    //LightHouse Light
    var spotLight4 = new THREE.SpotLight( 0xffffb3, 40 );
    spotLight4.position.set( 6050, 5700, -9900 );
    spotLight4.angle = 0.05;
    spotLight4.penumbra = 0;
    spotLight4.decay = 1.0;
    spotLight4.distance = 13500;

    //lightHouse
    var spotLight5 = new THREE.SpotLight( 0xffffb3, 10 );
    spotLight5.position.set( 5050, 4700, -9000 );
    spotLight5.angle = Math.PI;
    spotLight5.penumbra = 0;
    spotLight5.decay = 1.0;
    spotLight5.distance = 10500;

    //

    spotLight.castShadow = true;
    spotLight.shadow.mapSize.width = 1024;
    spotLight.shadow.mapSize.height = 1024;
    spotLight.shadow.camera.near = 10;
    spotLight.shadow.camera.far = 200;

    //light taret
    var targetObject5 = new THREE.Object3D();
    targetObject5.position.set(100,100,100);
    scene.add(targetObject5);

    spotLight5.target = targetObject5;


    scene.add( spotLight );
    scene.add( spotLight2 );
    scene.add( spotLight3 );
    scene.add( spotLight4 );
    scene.add( spotLight5 );


    // Light Array helper
    lightHelper = new THREE.SpotLightHelper( spotLight );
    //scene.add( lightHelper );

    lightHelper2 = new THREE.SpotLightHelper( spotLight4 );
    scene.add( lightHelper2 );



    //


    controls = new PointerLockControls( camera, document.body );

    var blocker = document.getElementById( 'blocker' );
    var instructions = document.getElementById( 'instructions' );

    instructions.addEventListener( 'click', function () {

        controls.lock();

    }, false );

    controls.addEventListener( 'lock', function () {

        instructions.style.display = 'none';
        blocker.style.display = 'none';

    } );

    controls.addEventListener( 'unlock', function () {

        blocker.style.display = 'block';
        instructions.style.display = '';

    } );

    scene.add( controls.getObject() );

    var onKeyDown = function ( event ) {

        switch ( event.keyCode ) {

            case 38: // up
            case 87: // w
                moveForward = true;
                break;

            case 37: // left
            case 65: // a
                moveLeft = true;
                break;

            case 40: // down
            case 83: // s
                moveBackward = true;
                break;

            case 39: // right
            case 68: // d
                moveRight = true;
                break;

            case 32: // space
                if ( canJump === true ) velocity.y += 450;
                canJump = false;
                break;

        }

    };

    var onKeyUp = function ( event ) {

        switch ( event.keyCode ) {

            case 38: // up
            case 87: // w
                moveForward = false;
                break;

            case 37: // left
            case 65: // a
                moveLeft = false;
                break;

            case 40: // down
            case 83: // s
                moveBackward = false;
                break;

            case 39: // right
            case 68: // d
                moveRight = false;
                break;

        }

    };

    document.addEventListener( 'keydown', onKeyDown, false );
    document.addEventListener( 'keyup', onKeyUp, false );

    raycaster = new THREE.Raycaster( new THREE.Vector3());
    //scene.add(new THREE.ArrowHelper(raycaster.ray.direction, raycaster.ray.origin, 100000, 0xff0000) );


    renderer = new THREE.WebGLRenderer( { antialias: true } );
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );
    document.body.appendChild( renderer.domElement );


    //

    setStatsModule();
    render();
    grounds();
    loadIle();
    loadHouse();
    loadtree();
    loadboat();
    loadLightHouse();

    //

    window.addEventListener( 'resize', onWindowResize, false );

}

function render() {

    lightHelper.update();
    lightHelper2.update();

    renderer.render( scene, camera );

}

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
            gltf.scene.scale.set(30,30,30); // THREE.Scene
            gltf.scenes; // Array<THREE.Scene>
            gltf.cameras; // Array<THREE.Camera>
            gltf.asset; // Object

            gltf.scene.rotation.y = -300;
             gltf.scene.position.x = -200;
             gltf.scene.position.z = -10;
             gltf.scene.position.y = -830;
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

function grounds() {

    // Pré-chargement d'une texture
    var loader = new THREE.TextureLoader();
    // Chargement de la texture du sol
    var groundTexture = loader.load('src/textures/waterTest.jpg');
    // Activation du mode wrap pour la répétition de la texture
    groundTexture.wrapS = groundTexture.wrapT = THREE.RepeatWrapping;
    groundTexture.color = 0x1F4F4F;
    // Paramtère de répétition de la texture
    groundTexture.repeat.set(10,10);
    // Gestion du flou
    groundTexture.anisotropy = 30;
    // Encodage avec sRGBEncoding pour une image plus nette
    groundTexture.encoding = THREE.sRGBEncoding;
    // Liaison material <=> texture
    var groundMaterial = new THREE.MeshLambertMaterial({map: groundTexture});
    // Création de notre mesh
    var mesh = new THREE.Mesh(new THREE.PlaneBufferGeometry( 30000, 30000), groundMaterial);
    // Définition de la position Y de notre plateau
    mesh.position.y = -250;
    // Ajout d'une rotation en x
    mesh.rotation.x = -Math.PI / 2;
    // Activation des ombres sur le sol
    mesh.receiveShadow = true;
    // Ajout à la scène
    scene.add(mesh);
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
            gltf.scenes; // Array<THREE.Scene>
            gltf.scene.scale.set(120,120,120); // THREE.Scene
            gltf.cameras; // Array<THREE.Camera>
            gltf.asset; // Object

            gltf.scene.rotation.y =  90 * Math.PI / 1;
            gltf.scene.position.x = -100;
            gltf.scene.position.z = -250;
            gltf.scene.position.y = 299;
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
            gltf.scene.scale.set(10,10,10); // THREE.Scene
            gltf.scene.rotation.y = 0;
            gltf.scene.position.x = 12500;
            gltf.scene.position.z = -2200;
            gltf.scene.position.y = -3500;
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
            gltf.scene.scale.set(15,15,15); // THREE.Scene
            gltf.scenes; // Array<THREE.Scene>
            gltf.cameras; // Array<THREE.Camera>
            gltf.asset; // Object


            gltf.scene.rotation.y = 4;
            gltf.scene.position.x = 2200;
            gltf.scene.position.z = 1500;
            gltf.scene.position.y = -500;
        },

        // Fonction appelée lors du chargement
        function (xhr) {
            console.log((xhr.loaded / xhr.total * 100) + '% loaded boat');
        },

        // Fonction appelée lors d'une quelconque erreur
        function (error) {
            console.log('Une erreur est survenue');
            console.log(error)
        }
    );

}

function loadLightHouse() {
    var loader = new GLTFLoader();
    loader.load(
        // Chemin de la ressource
        './src/objects/village_lighthouse_team_creepy/scene.gltf',
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
            gltf.scene.scale.set(3,3,3); // THREE.Scene
            gltf.scenes; // Array<THREE.Scene>
            gltf.cameras; // Array<THREE.Camera>
            gltf.asset; // Object


            gltf.scene.rotation.y = 0;
            gltf.scene.position.x = -10000;
            gltf.scene.position.z = -9000;
            gltf.scene.position.y = -900;
        },

        // Fonction appelée lors du chargement
        function (xhr) {
            console.log((xhr.loaded / xhr.total * 100) + '% loaded lightHouse');
        },

        // Fonction appelée lors d'une quelconque erreur
        function (error) {
            console.log('Une erreur est survenue');
            console.log(error)
        }
    );

}
/**
 * Fonction d'initialisation du module stats
 */
function setStatsModule() {
    // Utilisation du module stats et ajout dans notre container
    stats = new Stats();
    container.appendChild(stats.dom);
}

function onWindowResize() {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize( window.innerWidth, window.innerHeight );

}

function animate() {

    requestAnimationFrame( animate );


    if ( controls.isLocked === true ) {

        raycaster.ray.origin.copy( controls.getObject().position );

        var intersections = raycaster.intersectObjects( objects );

        var onObject = intersections.length > 0;

        var time = performance.now();
        var delta = ( time - prevTime + params.movSpeed) / 400 ; //Seed

        velocity.x -= velocity.x * 10.0 * delta ;
        velocity.z -= velocity.z * 10.0 * delta ;

        velocity.y -= 9.8 * 90.0 * ( ( time - prevTime ) / 500 ); // 100.0 = mass

        direction.z = Number( moveForward ) - Number( moveBackward );
        direction.x = Number( moveRight ) - Number( moveLeft );
        direction.normalize(); // this ensures consistent movements in all directions

        if ( moveForward || moveBackward ) velocity.z  -= direction.z * 400.0 * delta;
        if ( moveLeft || moveRight ) velocity.x -= direction.x * 400.0 * delta;

        if ( onObject === true ) {

            velocity.y = Math.max( 0, velocity.y );
            canJump = true;

        }

        controls.moveRight( - velocity.x * delta );
        controls.moveForward( - velocity.z * delta );

        controls.getObject().position.y += ( velocity.y * delta ); // new behavior

        if ( controls.getObject().position.y < 10 ) {

            velocity.y = 0;
            controls.getObject().position.y = 10;

            canJump = true;

        }

        prevTime = time;

    }


    stats.update();
    renderer.render( scene, camera );

}
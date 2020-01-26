import * as THREE from '../../build/three.module.js';
import  Stats from './stats.module.js';

import { GLTFLoader } from './GLTFLoader.js'


import { PointerLockControls } from '../jsm/controls/PointerLockControls.js';

var camera, scene, renderer, controls;
var stats;
var container;
var objects = [];

var raycaster;

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

init();
animate();

function init() {



    // Création d'une div dans le dom, et ajout du container
    container = document.createElement('div');
    document.body.appendChild(container);

    camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 2000 );
    camera.position.y = 0;
    camera.position.x= 150;
    camera.position.z= 500;
    camera.rotation.y= 1;
    camera.rotation.x = 0;
    camera.rotation.z = 0;


    scene = new THREE.Scene();
    scene.background = new THREE.Color(0xCCE0FF);
    scene.fog = new THREE.Fog( 0xffffff, 0, 2500 );

    // Draw a line from pointA in the given direction at distance 100
    var pointA = new THREE.Vector3( 0, 0, 0 );
    var direction = new THREE.Vector3( 10000, 0, 0 );
    direction.normalize();

    var distance = 100; // at what distance to determine pointB

    var pointB = new THREE.Vector3();
    pointB.addVectors ( pointA, direction.multiplyScalar( distance ) );

    var geometry = new THREE.Geometry();
    geometry.vertices.push( pointA );
    geometry.vertices.push( pointB );
    var material = new THREE.LineBasicMaterial( { color : 0xff0000 } );
    var line = new THREE.Line( geometry, material );
    scene.add ( line );







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
    scene.add(new THREE.ArrowHelper(raycaster.ray.direction, raycaster.ray.origin, 100000, 0xff0000) );

    // floor //
    //


    // floorGeometry.rotateX( - Math.PI / 2 );
    //
    // // vertex displacement
    //
    // var position = floorGeometry.attributes.position;
    //
    // position = floorGeometry.attributes.position;
    // var colors = [];
    //
    // for ( var i = 0, l = position.count; i < l; i ++ ) {
    //
    //     color.setHSL( Math.random() * 0.5 + 0.3, 0.2, Math.random() * 0.25 + 0.75 );
    //     colors.push( color.r, color.g, color.b );
    //
    // }
    //
    // floorGeometry.setAttribute( 'color', new THREE.Float32BufferAttribute( colors, 3 ) );
    //
    // var floorMaterial = new THREE.MeshBasicMaterial( { vertexColors: THREE.VertexColors } );
    //
    //var floor = new THREE.Mesh( floorGeometry );
    //scene.add( floor );

    //

    renderer = new THREE.WebGLRenderer( { antialias: true } );
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );
    document.body.appendChild( renderer.domElement );


    //

    setStatsModule();

    grounds();
    loadIle();

    //

    window.addEventListener( 'resize', onWindowResize, false );

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
            gltf.scene.scale.set(10,10,10); // THREE.Scene
            gltf.scenes; // Array<THREE.Scene>
            gltf.cameras; // Array<THREE.Camera>
            gltf.asset; // Object

            gltf.scene.rotation.y = -300;
             gltf.scene.position.x = -800;
             gltf.scene.position.z = -90;
             gltf.scene.position.y = -150;
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
        var delta = ( time - prevTime ) / 1000;

        velocity.x -= velocity.x * 10.0 * delta;
        velocity.z -= velocity.z * 10.0 * delta;

        velocity.y -= 9.8 * 100.0 * delta; // 100.0 = mass

        direction.z = Number( moveForward ) - Number( moveBackward );
        direction.x = Number( moveRight ) - Number( moveLeft );
        direction.normalize(); // this ensures consistent movements in all directions

        if ( moveForward || moveBackward ) velocity.z -= direction.z * 400.0 * delta;
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
var PARTICLE_DURATION  = 3; // seconds
var MAX_PARTICLE_COUNT = 5000;
var ALIVE              = 1;
var DEAD               = 0;
var particle_count     = 0;

var camera;
var scene;
var renderer;
var clock;
var timescale;
var stats;
var particles = {};

var mouseDown = false;
var firehoseId;
var hoverElement;

var particleGeometry;
var internet_traffic_source = document.querySelector('.internet-traffic-source');

var width = window.innerWidth;
var height = window.innerHeight;
var widthHalf = width / 2, heightHalf = height / 2;
var locationCoOrds = {};

/**
 * Given a screen position (THREE.Vector2), convert that screen-space
 * coordinate into 3D world coordinate space.
 */
function toWorldCoords(position) {
    var vector = new THREE.Vector3();
    if (position) {
        var vector = new THREE.Vector3(position.x, position.y, 1);
        vector.x = ( vector.x - widthHalf ) / widthHalf;
        vector.y = ( vector.y - heightHalf ) / -heightHalf;
        vector.unproject( camera );
    }
    return vector;
}

/**
 * Given a world-space coordinate (THREE.Vector3), conver it into 2D screen
 * coordinate space.
 */
function toScreenCoords(object) {
    var vector = new THREE.Vector3();
    var projector = new THREE.Projector();
    vector.setFromMatrixPosition( object.matrixWorld )
    vector.project( camera );

    vector.x = ( vector.x * widthHalf ) + widthHalf;
    vector.y = - ( vector.y * heightHalf ) + heightHalf;

    return vector;
}

init();
animate();

function init() {

    // camera

    camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 1, 1000 );
    camera.position.z = 1000;

    // clock

    clock = new THREE.Clock();

    // stats

    stats = new Stats();
    stats.domElement.style.position = 'absolute';
    stats.domElement.style.bottom = '0px';
    stats.domElement.style.right = '0px';
    stats.domElement.style.zIndex = 100;
    document.body.appendChild( stats.domElement );

    // scene and renderer

    scene = new THREE.Scene();

    renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        canvas: document.querySelector('canvas#traffic'),
    });
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );
    renderer.setClearColor( 0x000000, 0 );

    document.body.appendChild( renderer.domElement );

    //

    initParticles(particles);

    window.addEventListener( 'click', onClick, false );

    // window.addEventListener( 'mouseup', onMouseUp, false );
    // window.addEventListener( 'mousedown', onMouseDown, false );
    // window.addEventListener( 'mousemove', onMouseMove, false );

}

function initParticles(particles) {
    uniforms = {
        texture:   { type: "t", value: new THREE.TextureLoader().load('./assets/img/traffic-dot.png') },
        TIMER_MAX: { type: "f", value: PARTICLE_DURATION },
        size:      { type: "f", value: 14 },
    };
    var shaderMaterial = new THREE.ShaderMaterial( {
        uniforms:       uniforms,
        vertexShader:   document.getElementById( 'vertexshader' ).textContent,
        fragmentShader: document.getElementById( 'fragmentshader' ).textContent,
        blending:       THREE.AdditiveBlending,
        depthTest:      false,
        transparent:    true,
        alphaTest: 0.5,
    });
    var radius       = 800;
    particleGeometry = new THREE.BufferGeometry();
    var alive        = new Float32Array( MAX_PARTICLE_COUNT );
    var positions    = new Float32Array( MAX_PARTICLE_COUNT * 3 );
    var endPositions = new Float32Array( MAX_PARTICLE_COUNT * 3 );
    var startColors  = new Float32Array( MAX_PARTICLE_COUNT * 3 );
    var endColors    = new Float32Array( MAX_PARTICLE_COUNT * 3 );
    var timer        = new Float32Array( MAX_PARTICLE_COUNT );
    for ( var i = 0, i3 = 0; i < MAX_PARTICLE_COUNT; i ++, i3 += 3 ) {
        positions[ i3 + 0 ] = 0;
        positions[ i3 + 1 ] = 0;
        positions[ i3 + 2 ] = 1;
        endPositions[ i3 + 0 ] = 0;
        endPositions[ i3 + 1 ] = 0;
        endPositions[ i3 + 2 ] = 1;
        alive[i] = 0;
        timer[i] = 0;
    }
    particleGeometry.addAttribute( 'alive', new THREE.BufferAttribute( alive, 1 ) );
    particleGeometry.addAttribute( 'position', new THREE.BufferAttribute( positions, 3 ) );
    particleGeometry.addAttribute( 'endPosition', new THREE.BufferAttribute( endPositions, 3 ) );
    particleGeometry.addAttribute( 'startColor', new THREE.BufferAttribute( startColors, 3 ) );
    particleGeometry.addAttribute( 'endColor', new THREE.BufferAttribute( endColors, 3 ) );
    particleGeometry.addAttribute( 'timer', new THREE.BufferAttribute( timer, 1 ) );
    particleSystem = new THREE.Points( particleGeometry, shaderMaterial );
    scene.add( particleSystem );
}

function findAvailableParticle() {
    return particleGeometry.attributes.alive.array.indexOf(0);
}

function sendParticle(data) {

    var start_pos   = toWorldCoords(data.from);
    var end_pos     = toWorldCoords(data.to);
    var start_color = data.fromColor;
    var end_color   = data.toColor;
    var i1          = findAvailableParticle();
    var i3          = i1 * 3;

    // update particle attributes
    particleSystem.geometry.attributes.position.array[i3+0] = start_pos.x;
    particleSystem.geometry.attributes.position.array[i3+1] = start_pos.y;
    particleSystem.geometry.attributes.position.array[i3+2] = 1;

    particleSystem.geometry.attributes.endPosition.array[i3+0] = end_pos.x;
    particleSystem.geometry.attributes.endPosition.array[i3+1] = end_pos.y;
    particleSystem.geometry.attributes.endPosition.array[i3+2] = 1;

    particleSystem.geometry.attributes.startColor.array[i3+0] = start_color.r;
    particleSystem.geometry.attributes.startColor.array[i3+1] = start_color.g;
    particleSystem.geometry.attributes.startColor.array[i3+2] = start_color.b;

    particleSystem.geometry.attributes.endColor.array[i3+0] = end_color.r;
    particleSystem.geometry.attributes.endColor.array[i3+1] = end_color.g;
    particleSystem.geometry.attributes.endColor.array[i3+2] = end_color.b;

    particleSystem.geometry.attributes.timer.array[i1] = PARTICLE_DURATION;

    particleSystem.geometry.attributes.alive.array[i1] = ALIVE;
    particle_count += 1;
}

function updateParticles() {
    particleGeometry.attributes.alive.needsUpdate = true;
    particleGeometry.attributes.position.needsUpdate = true;
    particleGeometry.attributes.endPosition.needsUpdate = true;
    particleGeometry.attributes.timer.needsUpdate = true;
    particleGeometry.attributes.startColor.needsUpdate = true;
    particleGeometry.attributes.endColor.needsUpdate = true;

    updateParticleTimers();
}

function updateParticleTimers() {
    particleGeometry.attributes.timer.array.forEach(updateParticleTimer);
}

function updateParticleTimer(v, i, a) {
    if (v !== 0) {
        a[i] = v - timescale;
        if (a[i] <= 0) {
            a[i] = 0;
            particleSystem.geometry.attributes.alive.array[i] = DEAD;
            particle_count -= 1;
        }
    }
}

function eventPoint(evt) {
    return {
        x: evt.clientX,
        y: evt.clientY,
    };
}

function centerPoint(el) {
    var coords = el.getBoundingClientRect();
    return {
        x: ( coords.left + coords.right ) / 2,
        y: ( coords.top + coords.bottom ) / 2,
    };
}

function drawParticle(evt) {
  const { x, y } = eventPoint(evt);
  var geometry = new THREE.CircleGeometry( 5 );
  var material = new THREE.MeshBasicMaterial( { color: 0xffff00 } );
  var circle = new THREE.Mesh( geometry, material );
  scene.add( circle );
  const vector = toWorldCoords(evt);
  circle.position.set(vector.x, vector.y, 0);
}

function updateLocation(evt) {
  const { x, y } = eventPoint(evt);
  locationCoOrds.x = x;
  locationCoOrds.y = y;
}

function onClick(evt) {
    drawParticle(evt);
    const startLocation = locationCoOrds.x ? locationCoOrds : centerPoint(internet_traffic_source);
    sendParticle({
        from      : startLocation, // centerPoint(internet_traffic_source),
        to        : eventPoint(evt),
        fromColor : getColor(locationCoOrds.x), // TODO: set correct color here
        toColor   : getColor( evt.target ),
    });
    updateLocation(evt);
}

function mapColor(value) {
  if (value >= 0 && value <= 300) {
    return 'rgb(0, 255, 0)';
  }
  if (value > 300 && value <= 500) {
    return 'rgb(0, 0, 255)';
  }
  if (value > 500) {
    return 'rgb(255, 0, 0)';
  }
  return 'rgb(255, 255, 255)';
}

function getColor(element) {
    const color = mapColor(element);
    return new THREE.Color(color);
}

function animate() {

    requestAnimationFrame( animate );

    timescale = clock.getDelta();

    // moveInternet();

    updateParticles();

    stats.update();

    renderer.render( scene, camera );

}

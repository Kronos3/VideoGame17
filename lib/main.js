$( document ).ready(function() {
    for (var i=0; i != 50; i++) {
        $( "<img src=\"resources/textures/Star.png\" class=\"pos\">" ).appendTo( ".stars" )
    }
    
    for (var i = 0; i != $('.stars > img').length; i++) {
        setup_pos ($('.stars > img').get(i), (Math.random() * (-0.08 - 0.08) + 0.08).toFixed(4),(Math.random() * (-0.120 - 0.12) + 0.12).toFixed(4));
        $($('.stars > img').get(i)).css ("top", (Math.random() * (100 - 0) + 0).toFixed(0) + "%");
        $($('.stars > img').get(i)).css ("left", (Math.random() * (100 - 0) + 0).toFixed(0) + "%");
    }
    setup_pos($('#mars').get(0), .02, .02);
    setup_pos($('#moon').get(0), -.08, .04);
    setup_pos($('.menu').get(0), -.02, .02);
    
    document.onmousemove = handleMouseMove;
    function handleMouseMove(event) {
        var dot, eventDoc, doc, body, pageX, pageY;
        event = event || window.event;
        
        if (event.pageX == null && event.clientX != null) {
            eventDoc = (event.target && event.target.ownerDocument) || document;
            doc = eventDoc.documentElement;
            body = eventDoc.body;

            event.pageX = event.clientX +
              (doc && doc.scrollLeft || body && body.scrollLeft || 0) -
              (doc && doc.clientLeft || body && body.clientLeft || 0);
            event.pageY = event.clientY +
              (doc && doc.scrollTop  || body && body.scrollTop  || 0) -
              (doc && doc.clientTop  || body && body.clientTop  || 0 );
        }
        for (var j=0; j != $('.scene').length; j++) {
            if ($($('.scene').get(j)).css('display') != 'none') {
                
                for (var i = 0; i != $($('.scene').get(j)).find('.pos').length; i++) {
                    set_pos ($($('.scene').get(j)).find('.pos').get(i), event.pageX, event.pageY);
                }
                for (var i = 0; i != $($('.scene').get(j)).find('.rot').length; i++) {
                    set_rot ($($('.scene').get(j)).find('.rot').get(i), event.pageX, event.pageY);
                }
            }
            
        }
    }
});

function set_pos (e, x, y) { // Use negative for inverse
    $(e).css("transform", "matrix(1, 0, 0, 1, " + $(e).data ('xfactor') * x + " , " + $(e).data ('yfactor') * y + ")");
}

function set_rot (e, x, y) { // Use negative for inverse
    $(e).css("transform", "rotateY(" + x * $(e).data ('xfactor') + "deg)" + "rotateX(" + y * $(e).data ('yfactor') + "deg)");
}

function setup_pos (e, x_scale, y_scale) {
    $(e).data ('xfactor', x_scale);
    $(e).data ('yfactor', y_scale);
}

function next_scene () {
    e = $('.scene.view');
    j = e.next()
    e.toggleClass ("view");
    j.toggleClass ("view");
    g = j.getClasses ();
    g.splice(g.indexOf('view'), 1);
    g.splice(g.indexOf('scene'), 1);
    eval("load_" + g[0] + "()");
}

function load_scene0 () {
    return;
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function print_blackbox (e, _sleep) {
    var b = 0;
    await sleep (_sleep);
    for (var i = 0; i != e.length; i++) {
        $('.blackbox-logs > div > div').append ('<span>' + e[i][0] + '</span>');
        if (typeof e[i][2] != 'undefined') {
            console.log (e[i][2]);
            e[i][2]();
        }
        await sleep(e[i][1]);
    }
}

async function init_blackbox () {
    $('.blackbox-logs').css('display', 'block');
    $('.blackbox-logs').bind("DOMSubtreeModified", function () {
        $('.blackbox-logs > div').scrollTop($('.blackbox-logs > div')[0].scrollHeight); 
    });
    
    $('.blackbox-logs > div').scrollTop($('.blackbox-logs > div')[0].scrollHeight);
    var blackbox_logs = [["Doing preflight checks", 2300],
                            ["Preparing snacks", 200],
                            ["Calculating flight path", 700],
                            ["Launch in 10s", 1000],
                            ["Launch in 9s", 1000],
                            ["Launch in 8s", 1000], 
                            ["Launch in 7s", 1000],
                            ["Launch in 6s", 1000],
                            ["Launch in 5s", 1000],
                            ["Launch in 4s", 1000],
                            ["Launch in 3s", 1000],
                            ["Main Engine On", 300, function (){$('#__rocket').toggleClass('engine');}],
                            ["Launch in 2s", 700],
                            ["Launch in 1s", 1000],
                            ["Launch", 0],
                            ];
    await print_blackbox (blackbox_logs, 2000);
    $('.scene1').ready(function () {
        $('#__rocket').toggleClass ('__launch');
        $('.intro').toggleClass('launch');
    });
}

async function load_scene1 () {
    
    var dataText = [ "year", "Some text about the story", "some more text about the story", "we can have infinite of these", "they can also be very long. and save multiple sentences. This is just a placeholder"];
    // type one text in the typwriter
    // keeps calling itself until the text is finished
    window.skip = false;
    document.querySelector(".scene.scene1").addEventListener("click", function () {window.skip = true});
    /*bleep = new Audio ('resources/sounds/d.wav');
    bleep.onended = function() {
        this.currentTime = 0;
        setTimeout(function() {bleep.play()}, 1200);
    };
    bleep.play();*/
    $('.intro').css('display', 'none');
    function typeWriter(text, i, fnCallback) {
        // chekc if text isn't finished yet
        if (i < (text.length)) {
            // add next character to h1
            document.querySelector("h1.anim-typewriter").innerHTML = text.substring(0, i+1) +'<span aria-hidden="true"></span>';
    
            // wait for a while and call this function again for next character
            if (!window.skip) {
                setTimeout(function() {
                    typeWriter(text, i + 1, fnCallback)
                }, (Math.random() * (140 - 60) + 60).toFixed(0));
            }
            else {
                typeWriter(text, i + 1, fnCallback);
            }
        }
        // text finished, call callback if there is a callback function
        else if (typeof fnCallback == 'function') {
            // call callback after timeout
            setTimeout(fnCallback, 1800);
        }
    }
    // start a typewriter animation for a text in the dataText array
    async function StartTextAnimation(i) {
        if (typeof dataText[i] == 'undefined'){
            //init_physics_scene1 ();
            //bleep.onended = function () {return;};
            //bleep.pause();
            $('.intro').css('display', 'block');
            await init_blackbox ();
            print_blackbox([["Atmo exit reached", 200],
                            ["Engine shutdown", 200, function (){$('#__rocket').toggleClass('engine');}],
                            ["Switch to RCS", 200],
                            ["Engage linear docking", 200]], 6600);
            return;
        }
        if (i < dataText[i].length) {
            // text exists! start typewriter animation
            typeWriter(dataText[i], 0, function(){
                // after callback (and whole text has been animated), start next text
                window.skip = false;
                StartTextAnimation(i + 1);
            });
        }
    }
    // start the text animation
    StartTextAnimation(0);
}

jQuery.fn.getClasses = function(){
  var ca = this.attr('class');
  var rval = [];
  if(ca && ca.length && ca.split){
    ca = jQuery.trim(ca); /* strip leading and trailing spaces */
    ca = ca.replace(/\s+/g,' '); /* remove doube spaces */
    rval = ca.split(' ');
  }
  return rval;
}

function init_physics_scene1 () {
    var world = new p2.World({
        gravity:[0, 0]
    });
    
    // Create an empty dynamic body
    var rocketBody = new p2.Body({
        mass: 5,
        position: [0, 10]
    });
    var RocketVertices = [
                            [0,100],
                            [-22,-31],
                            [0,-100],
                            [-18,-38],
                            [0,-12],
                            [18,0],
                            [0,-19],
                            [44,0],
                            [0,19],
                            [18,0],
                            [0,12],
                            [-18,38],
                            [0,100],
                            [-22,31]
                         ];
    var rocketShape = new Convex({ vertices: RocketVertices });
    rocketBody.addShape(rocketShape);
    
    // ...and add the body to the world.
    // If we don't add it to the world, it won't be simulated.
    world.addBody(rocketBody);
    
    // To animate the bodies, we must step the world forward in time, using a fixed time step size.
    // The World will run substeps and interpolate automatically for us, to get smooth animation.
    var fixedTimeStep = 1 / 60; // seconds
    var maxSubSteps = 10; // Max sub steps to catch up with the wall clock
    var lastTime;
    
    // Animation loop
    function animate(time){
        requestAnimationFrame(animate);
    
        // Compute elapsed time since last render frame
        var deltaTime = lastTime ? (time - lastTime) / 1000 : 0;
    
        // Move bodies forward in time
        world.step(fixedTimeStep, deltaTime, maxSubSteps);
    
        // Render the circle at the current interpolated position
        renderCircleAtPosition(circleBody.interpolatedPosition);
    
        lastTime = time;
    }
    
    // Start the animation loop
    requestAnimationFrame(animate);
}

var game = new Phaser.Game(window.innerWidth, window.innerHeight, Phaser.CANVAS, 'T17', { preload: preload, create: create, update:update }, true);

function preload() {
    game.load.image('rocket', 'resources/textures/Rocket-L.png');
    game.load.image('rocket-thrust', 'resources/textures/Rocket-L-T.png');
}

function create() {
    game.physics.startSystem(Phaser.Physics.P2JS);
    cursors = game.input.keyboard.createCursorKeys();
    ship = game.add.sprite(32, game.world.height - 150, 'rocket');
    game.physics.p2.enable(ship);
};


function check_update () {
    if ($(game.canvas).css ('display') == 'none') {
        return false;
    }
    else {
        return true;
    }
}

function update() {
    //bullets.forEachAlive(moveBullets,this);  //make bullets accelerate to ship
    
    ship.key = 'rocket';
    ship.loadTexture('rocket', 0);
    if (check_update()) {
        if (cursors.left.isDown) {ship.body.rotateLeft(30);}   //ship movement
        else if (cursors.right.isDown){ship.body.rotateRight(30);}
        else {ship.body.setZeroRotation();}
        if (cursors.up.isDown){
            ship.body.thrust(200);
            ship.key = 'rocket-thrust';
            ship.loadTexture('rocket-thrust', 0);
        }
    }
};

$(window).resize(function() { window.resizeGame(); } );
function resizeGame() {
    var height = $(window).height();
    var width = $(window).width();
    game.width = width;
    game.height = height;
    game.renderer.resize(width, height);
}

function enable () {
    $(game.canvas).css ('display', 'block');
}

function disable () {
    $(game.canvas).css ('display', 'none');
}

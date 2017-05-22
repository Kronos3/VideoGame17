"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var game_1 = require("./game");
var ship_1 = require("./ship");
var ship_2 = require("./ship");
var wrapper_1 = require("./wrapper");
$(document).ready(function () {
    for (var i = 0; i != 50; i++) {
        $("<img src=\"resources/textures/Star.png\" class=\"pos\">").appendTo(".stars");
    }
    for (var i = 0; i != $('.stars > img').length; i++) {
        setup_pos($('.stars > img').get(i), (Math.random() * (-0.08 - 0.08) + 0.08).toFixed(4), (Math.random() * (-0.120 - 0.12) + 0.12).toFixed(4));
        $($('.stars > img').get(i)).css("top", (Math.random() * (100 - 0) + 0).toFixed(0) + "%");
        $($('.stars > img').get(i)).css("left", (Math.random() * (100 - 0) + 0).toFixed(0) + "%");
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
                (doc && doc.scrollTop || body && body.scrollTop || 0) -
                (doc && doc.clientTop || body && body.clientTop || 0);
        }
        for (var j = 0; j != $('.scene').length; j++) {
            if ($($('.scene').get(j)).css('display') != 'none') {
                for (var i = 0; i != $($('.scene').get(j)).find('.pos').length; i++) {
                    set_pos($($('.scene').get(j)).find('.pos').get(i), event.pageX, event.pageY);
                }
                for (var i = 0; i != $($('.scene').get(j)).find('.rot').length; i++) {
                    set_rot($($('.scene').get(j)).find('.rot').get(i), event.pageX, event.pageY);
                }
            }
        }
    }
    initGame();
});
// Global variables
var game;
window.GAME = null;
function initGame() {
    game = new game_1.MainGame(DoGame);
    window.GAME = game;
    var testControlBindings = [
        {
            key: Phaser.Keyboard.SPACEBAR,
            callback: function () {
                console.log('pressed space');
            }
        },
        {
            key: Phaser.Keyboard.SHIFT,
            callback: function () {
                console.log('pressed shift');
            }
        }
    ];
    game.addControlScheme(testControlBindings);
    var story = [
        ['2061', 'The International Space Exploration Administration (ISEA) is coming off their recent success of their manned mission to Mars.', 'Now, they have set their sights on the next stepping stone in the solar system: Jupiter\'s moons.', 'The ISEA believes that landing a spacecraft near Jupiter will reveal new information about the gas giants and the remainder of the solar system.', 'However, this journey will encounter new challenges that will threaten the lives of the astronauts and the reputation of the ISEA.'],
    ];
    window.MAIN = new wrapper_1.Wrapper(window.GAME, story);
}
;
function set_pos(e, x, y) {
    $(e).css("transform", "matrix(1, 0, 0, 1, " + $(e).data('xfactor') * x + " , " + $(e).data('yfactor') * y + ")");
}
function set_rot(e, x, y) {
    $(e).css("transform", "rotateY(" + x * $(e).data('xfactor') + "deg)" + "rotateX(" + y * $(e).data('yfactor') + "deg)");
}
function setup_pos(e, x_scale, y_scale) {
    $(e).data('xfactor', x_scale);
    $(e).data('yfactor', y_scale);
}
function DoGame(game) {
    var levels = [
        {
            name: "intro",
            game: window.GAME,
            objects: [
                {
                    name: "stars",
                    assets: "Stars",
                    position: {
                        x: function () { return 0; },
                        y: function () { return 0; }
                    }
                },
                {
                    name: "stars2",
                    assets: "Stars",
                    position: {
                        x: function () { return 0; },
                        y: function () { return 1600; }
                    }
                },
                {
                    name: "sky",
                    assets: "Sky",
                    position: {
                        x: function () { return 0; },
                        y: function () { return window.GAME.game.world.height - 820; }
                    }
                },
                {
                    name: "mountains",
                    assets: "Mountain-E",
                    position: {
                        x: function () { return 0; },
                        y: function () { return 0; }
                    }
                },
                {
                    name: 'backdrop',
                    assets: "Fore",
                    position: {
                        x: function () { return 0; },
                        y: function () { return window.GAME.game.world.height - 120; }
                    }
                },
                {
                    name: "Launch-L",
                    assets: "Launch-L",
                    physics: "Launch-L",
                    static: true,
                    position: {
                        x: function () { return window.GAME.game.world.width / 2; },
                        y: function () { return window.GAME.game.world.height - 96; }
                    }
                },
            ],
            frame: function () {
                window.GAME.getLevel('intro').getObject('mountains').pObject.y = (window.GAME.game.world.height - 520) + 0.3 * (window.GAME.game.world.height - window.GAME.game.camera.view.bottom);
                window.GAME.gravity = 100 * window.GAME.getGravity();
            }
        }
    ];
    for (var _i = 0, levels_1 = levels; _i < levels_1.length; _i++) {
        var iter = levels_1[_i];
        game.addLevel(iter);
    }
    var artemis_pos = {
        x: function () { return window.GAME.game.world.width / 2 + 70; },
        y: function () { return window.GAME.game.world.height - 60; },
    };
    game.getLevel('global').addObject(new ship_2.Ship(game, 'Artemis', artemis_pos, [
        'rocket',
        'rocket-thrust',
        'rocket-L-L',
        'rocket-L-R'
    ]));
    game.controls[0].addBinding(ship_1.ShipBinding(game, game.getLevel('global').getObject('Artemis')));
    game.setGravity(100, 0.1);
}

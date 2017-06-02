"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var game_1 = require("./game");
var ship_1 = require("./ship");
var ship_2 = require("./ship");
var ship_3 = require("./ship");
var ship_4 = require("./ship");
var wrapper_1 = require("./wrapper");
var background_1 = require("./background");
var astroid_1 = require("./astroid");
function getlength(number) {
    return number.toString().length;
}
function genImgList(startFrame, endFrame, numlen, prefix, suffix) {
    if (numlen === void 0) { numlen = 4; }
    if (prefix === void 0) { prefix = 'resources/blender/earth_holo/'; }
    if (suffix === void 0) { suffix = '.png'; }
    var out = [];
    for (var i = startFrame; i != endFrame; i++) {
        out.push(prefix + Array(numlen - getlength(i) + 1).join('0') + i.toString() + suffix);
    }
    return out;
}
function GIF(images, element, repeat) {
    if (repeat === void 0) { repeat = true; }
    var n = 0;
    var preLOAD = [];
    images.forEach(function (element) {
        var temp = new Image();
        temp.onload = function () {
            preLOAD.push(temp);
        };
        temp.src = element;
    });
    var task = new background_1.Task(function () {
        console.log(n);
        $(element).attr('src', images[n]);
        if (repeat && n == images.length) {
            n = 0;
            return;
        }
        n++;
    }, true, 60);
    task.start();
}
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
    difDone();
    initDif();
    initGame();
});
var shipStats = {
    easy: {
        mass: '30%',
        thrust: '60%',
        angAcc: '80%'
    },
    medium: {
        mass: '50%',
        thrust: '50%',
        angAcc: '70%'
    },
    hard: {
        mass: '100%',
        thrust: '100%',
        angAcc: '30%'
    },
};
function setStats(e_stats, so) {
    $(e_stats[0]).children('.bar').children('span').css('width', so.mass);
    $(e_stats[1]).children('.bar').children('span').css('width', so.thrust);
    $(e_stats[2]).children('.bar').children('span').css('width', so.angAcc);
}
function initDif() {
    $('.difficulty > .dif-choice').toArray().forEach(function (element) {
        element.addEventListener("click", function () {
            $('.dif-choice.active').removeClass('active');
            $(element).addClass('active');
            $('.stats').removeClass('left');
            $('.stats').removeClass('middle');
            $('.stats').removeClass('right');
            var stats = $('.stats > div').toArray();
            if ($(element).attr('id') == 'easy') {
                $('.stats').addClass('left');
                setStats(stats, shipStats.easy);
            }
            else if ($(element).attr('id') == 'medium') {
                $('.stats').addClass('middle');
                setStats(stats, shipStats.medium);
            }
            else if ($(element).attr('id') == 'hard') {
                $('.stats').addClass('right');
                setStats(stats, shipStats.hard);
            }
        });
    });
}
// Global variables
var game;
window.GAME = null;
function initGame() {
    game = new game_1.MainGame(DoGame);
    window.GAME = game;
    var testControlBindings = [];
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
                        y: function () { return window.GAME.game.world.height - 520; }
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
            },
            done: function () {
                return false; //(<any>window).GAME.getLevel ('intro').getObject('Artemis').getAltitude() > 4000;
            },
            init: function (___this) {
                window.GAME.setGravity(100, 0.1);
            }
        },
        {
            name: "belt1",
            game: window.GAME,
            objects: [
                {
                    name: "stars",
                    assets: "Stars",
                    position: {
                        x: function () { return 0; },
                        y: function () { return 0; },
                        width: 9200,
                        height: 9200
                    },
                    repeat: true
                },
            ],
            frame: function () {
            },
            done: function () {
                return false; //(<any>window).GAME.getLevel ('intro').getObject('Artemis').getAltitude() > 4000;
            },
            init: function (___this) {
                window.GAME.setGravity(0, 0.1);
                ___this.game.game.world.setBounds(0, 0, 9200, 9200);
                ___this.getObject('ship').pos = {
                    x: function () { return 70; },
                    y: function () { return window.GAME.game.world.centerY; }
                };
                ___this.getObject('ship').reset(false);
                window.GAME.uicontroller.setPlanet('ceres');
                // Initialize the Astroid belt;
                ___this.astroidbelt = new astroid_1.AstroidBelt(window.GAME, ___this);
                for (var i = 0; i != 200; i++) {
                    ___this.astroidbelt.spawn();
                }
            }
        },
    ];
    var missions = [
        [
            {
                title: 'Reach 4000m',
                description: 'Exit Earth\'s atmosphere',
                condition: function () {
                    if (window.GAME.getLevel('intro').getObject('ship') == null) {
                        return false;
                    }
                    return window.GAME.getLevel('intro').getObject('ship').getAltitude() > 4000;
                },
                onDone: function () {
                },
                update: function () {
                    if (window.GAME.getLevel('intro').getObject('ship') == null) {
                        window.GAME.pause();
                        return;
                    }
                    var a = parseInt(window.GAME.getLevel('intro').getObject('ship').getAltitude());
                    if (a < 0) {
                        a = 0;
                    }
                    $('.alt').text(a + 'M');
                    var x = (.95 * (a / 40));
                    if (x > 95) {
                        $('.alt').css('bottom', '95%');
                    }
                    else {
                        $('.alt').css('bottom', x + '%');
                    }
                }
            }
        ],
        [
            {
                title: 'Survive the astroid belt',
                description: 'Manuever around astroids in the belt',
                condition: function () {
                    return false;
                },
                onDone: function () {
                    ;
                },
                update: function () {
                    ;
                }
            }
        ]
    ];
    add_levels(levels, missions);
}
var shipClass;
function add_levels(levels, missions) {
    for (var iter in levels) {
        game.addLevel(levels[iter]);
        for (var _i = 0, _a = missions[iter]; _i < _a.length; _i++) {
            var miter = _a[_i];
            game.levelsequence.levels[iter].addMission(miter);
        }
    }
}
function difDone() {
    $('.finish-dif').get(0).addEventListener('click', function () {
        $('.difficulty').css('display', 'none');
        if ($('.dif-choice.active').attr('id') == 'easy') {
            shipClass = ship_2.Artemis;
        }
        else if ($('.dif-choice.active').attr('id') == 'medium') {
            shipClass = ship_3.Athena;
        }
        else if ($('.dif-choice.active').attr('id') == 'hard') {
            shipClass = ship_4.Vulcan;
        }
        initShip(window.GAME.getLevel('intro'));
        window.GAME.resume();
    });
    $('.mission-control-done').get(0).addEventListener('click', function () {
        window.GAME.wrapper.handleNext(true);
        window.GAME.closeMissionControl();
    });
}
function initShip(___this) {
    var buf = new shipClass(window.GAME, ___this);
    ___this.addObject(buf);
    window.GAME.addControlScheme([
        ship_1.ShipBinding(window.GAME, buf),
        {
            key: Phaser.KeyCode.R,
            callback: function () {
                buf.reset();
            },
            press: true
        }
    ]);
    window.GAME.game.camera.follow(buf.pObject);
    ___this.init(___this);
}
exports.initShip = initShip;

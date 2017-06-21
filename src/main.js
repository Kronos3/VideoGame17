"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/// <reference path="../imports/phaser.d.ts" />
var $ = require("jquery");
var game_1 = require("./game");
var ship_1 = require("./ship");
var ship_2 = require("./ship");
var ship_3 = require("./ship");
var ship_4 = require("./ship");
var wrapper_1 = require("./wrapper");
var astroid_1 = require("./astroid");
var rover_1 = require("./rover");
var rover_2 = require("./rover");
var rock_1 = require("./rock");
var UTIL = require("./util");
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
/*function GIF (images: string[], element: Element, repeat = true) {
    var n = 0;
    var preLOAD: HTMLImageElement[] = [];
    images.forEach(element => {
        var temp = new Image ();
        temp.onload = () => {
            preLOAD.push (temp);
        }
        temp.src = element;
    });
    var task = new Task (() => {
        console.log (n);
        $(element).attr('src', images[n]);
        if (repeat && n == images.length) {
            n = 0;
            return;
        }
        n++;
    }, true, 60);
    task.start();
}*/
$(document).ready(function () {
    for (var i = 0; i != 50; i++) {
        $("<img src=\"resources/textures/Intro/Star.png\" class=\"pos\">").appendTo(".stars");
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
    var story = [
        ['2061', 'The International Space Exploration Administration (ISEA) is coming off their recent success of their manned mission to Mars.', 'Now, they have set their sights on the next stepping stone in the solar system: Jupiter\'s moons.', 'The ISEA believes that landing a spacecraft near Jupiter will reveal new information about the gas giants and the remainder of the solar system.', 'However, this journey will encounter new challenges that will threaten the lives of the astronauts and the reputation of the ISEA.'],
        ['The journey to Jupiter was a success.',
            'Your ship is now in high orbit around Jupiter',
            'A maneuver was executed and you are now in orbit around Jupiter\'s vulcanic moon',
            'IO'
        ]
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
                        width: 18000,
                        height: 2500
                    },
                    repeat: true
                }
            ],
            frame: function () {
            },
            done: function () {
                return false; //(<any>window).GAME.getLevel ('intro').getObject('Artemis').getAltitude() > 4000;
            },
            init: function (___this) {
                window.GAME.setGravity(0, 0.1);
                ___this.game.game.world.setBounds(0, 0, 24000, 2500);
                ___this.getObject('ship').pos = {
                    x: function () { return 120; },
                    y: function () { return window.GAME.game.world.centerY; }
                };
                ___this.getObject('ship').reset(false);
                window.GAME.uicontroller.setPlanet('ceres');
                // Initialize the Astroid belt;
                ___this.astroidbelt = new astroid_1.AstroidBelt(window.GAME, ___this, 0);
                ___this.addFrame(___this.astroidbelt.frame);
            }
        },
        {
            name: "IO",
            game: window.GAME,
            objects: [
                {
                    name: "iogradient",
                    assets: "iogradient",
                    repeat: true,
                    position: {
                        x: function () { return 0; },
                        y: function () { return window.GAME.game.world.height - 600; },
                        width: 9400,
                        height: 600
                    },
                },
                {
                    name: "iobackdrop",
                    assets: "IOGround",
                    physics: "IO Ground",
                    static: true,
                    position: {
                        x: function () { return 2300; },
                        y: function () { return window.GAME.game.world.height - 110; }
                    },
                },
                {
                    name: "iobackdrop2",
                    assets: "IOGround",
                    physics: "IO Ground",
                    static: true,
                    position: {
                        x: function () { return 2300 + 4700; },
                        y: function () { return window.GAME.game.world.height - 110; }
                    },
                },
            ],
            frame: function () {
            },
            done: function () {
                return false; //(<any>window).GAME.getLevel ('intro').getObject('Artemis').getAltitude() > 4000;
            },
            init: function (___this) {
                window.GAME.setGravity(600, 0.1);
                ___this.game.game.world.setBounds(0, 0, 9200, 1500);
                ___this.getObject('ship').pos = {
                    x: function () { return 325; },
                    y: function () { return window.GAME.game.world.height - 200; }
                };
                var roverbuff = new rover_1.Rover(window.GAME, ___this, 'rover', 'Rover', {
                    x: function () { return 458; },
                    y: function () { return 1313; }
                }, [
                    'rover1'
                ]);
                ___this.addObject(roverbuff);
                ___this.getObject('ship').reset(false);
                window.GAME.uicontroller.setPlanet('io');
                window.GAME.addControlScheme([
                    rover_2.RoverBinding(window.GAME, roverbuff),
                    {
                        key: Phaser.KeyCode.R,
                        callback: function () {
                            roverbuff.reset();
                        },
                        press: true
                    }
                ]);
                window.GAME.controls[0].disable();
                ___this.getObject('ship').disable();
                ___this.getObject('iobackdrop').pObject.body.setMaterial(roverbuff.worldMaterial);
                ___this.getObject('iobackdrop').reset();
                ___this.getObject('iobackdrop2').pObject.body.setMaterial(roverbuff.worldMaterial);
                ___this.getObject('iobackdrop2').reset();
                ___this.getObject('iogradient').reset();
                roverbuff.reset();
                ___this.game.game.camera.follow(roverbuff.pObject);
                for (var i = 0; i != 30; i++) {
                    var type = UTIL.getRandomInt(0, 1);
                    var buf;
                    if (type) {
                        buf = new rock_1.Rock(___this.game, ___this, "rock{0}".format(i), "rock1", {
                            x: function () { return UTIL.getRandomInt(1200, window.GAME.game.world.width); },
                            y: function () { return window.GAME.game.world.height - 250; }
                        });
                    }
                    else {
                        buf = new rock_1.Rock(___this.game, ___this, "rock{0}".format(i), "rock2", {
                            x: function () { return UTIL.getRandomInt(1200, 4000); },
                            y: function () { return window.GAME.game.world.height - 250; }
                        });
                    }
                }
            }
        },
        {
            name: "Europa",
            game: window.GAME,
            objects: [
                {
                    name: "stars",
                    assets: "Stars",
                    position: {
                        x: function () { return 0; },
                        y: function () { return 0; },
                        width: 9200,
                        height: 4000
                    },
                    repeat: true
                },
                {
                    name: "eugradient",
                    assets: "eugradient",
                    repeat: true,
                    position: {
                        x: function () { return 0; },
                        y: function () { return window.GAME.game.world.height - 600; },
                        width: 9400,
                        height: 600
                    },
                },
                {
                    name: "EuropaBackDrop",
                    assets: "europa",
                    physics: "Europa",
                    static: true,
                    position: {
                        x: function () { return 2300; },
                        y: function () { return window.GAME.game.world.height - 110; }
                    },
                },
                {
                    name: "EuropaBackDrop1",
                    assets: "europa",
                    physics: "Europa",
                    static: true,
                    position: {
                        x: function () { return 2300 + 4700; },
                        y: function () { return window.GAME.game.world.height - 110; }
                    },
                }
            ],
            frame: function () {
            },
            done: function () {
                return false; //(<any>window).GAME.getLevel ('intro').getObject('Artemis').getAltitude() > 4000;
            },
            init: function (___this) {
                window.GAME.setGravity(600, 0.1);
                ___this.game.game.world.setBounds(0, 0, 9200, 4500);
                ___this.getObject('ship').pos = {
                    x: function () { return 70; },
                    y: function () { return window.GAME.game.world.height - 220; }
                };
                window.GAME.controls[1].disable();
                window.GAME.controls[0].enable();
                ___this.getObject('ship').reset(false);
                window.GAME.uicontroller.setPlanet('europa');
                ___this.getObject('EuropaBackDrop').reset();
                ___this.getObject('EuropaBackDrop1').reset();
                ___this.getObject('eugradient').reset();
                ___this.getObject('ship').follow();
            }
        },
    ];
    var missions = [
        {
            title: 'Reach 4000m',
            description: 'Exit Earth\'s atmosphere',
            html: "\
                <div class=\"altitude\">\
                    <p>Reach 4000m</p>\
                    <span class=\"alt\">0m</span>\
                    <span class=\"alt-line\"></span>\
                </div>",
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
                var a = parseInt(window.GAME.levelsequence.getCurrent().getObject('ship').getAltitude());
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
        },
        {
            title: 'Survive the astroid belt',
            description: 'Manuever around astroids in the belt',
            html: '\
                <div>\
                <p>Survive the asteroid belt</p>\
                <p>--><p>\
                </div>',
            condition: function () {
                return window.GAME.levelsequence.getCurrent().getObject('ship').pObject.x > 9500;
            },
            onDone: function () {
                ;
            },
            update: function () {
                ;
            }
        },
        {
            title: 'Collect surface samples',
            description: 'Collect surface samples on IO to analyze composition of ground.',
            html: '\
                <div>\
                <p>Collect surface samples</p>\
                <p class=\"alt\">Return to ship before fuel runs out.</p>\
                <p id="rocknum">Rocks: <span>0</span></p>\
                </div>',
            condition: function () {
                if (window.GAME.levelsequence.getCurrent().getObject('rover') == null) {
                    return false;
                }
                return window.GAME.levelsequence.getCurrent().getObject('rover').return;
            },
            onDone: function () {
                ;
            },
            update: function () {
                ;
            }
        },
        {
            title: 'Survey moon to generate map',
            description: 'Map will be used to create dropzones for colonization.',
            html: '\
                <div>\
                <p>Survey moon to generate map</p>\
                <p class=\"alt\">Then fly out of atmosphere before fuel runs out</p>\
                <p id="areas">Area surveyed: <span>0%</span></p>\
                </div>',
            condition: function () {
                if (window.GAME.levelsequence.getCurrent().getObject('ship') == null) {
                    return false;
                }
                return window.GAME.levelsequence.getCurrent().getObject('ship').getAltitude() > 4000;
            },
            onDone: function () {
                ;
            },
            update: function () {
                var v = $('#areas > span').text();
                var level = window.GAME.levelsequence.getCurrent();
                var p = level.getObject('ship').pObject.x / (level.game.game.world.width - 1200);
                if (p * 100 > 100) {
                    p = 1;
                }
                if (p * 100 > parseInt(v.substring(0, v.length - 1))) {
                    $('#areas > span').text('{0}%'.format((p * 100).toFixed(0)));
                }
            }
        }
    ];
    add_levels(levels, missions);
    game.missionControl.begin();
}
var shipClass;
function add_levels(levels, missions) {
    for (var iter in levels) {
        game.addLevel(levels[iter]);
    }
    for (var _i = 0, missions_1 = missions; _i < missions_1.length; _i++) {
        var miter = missions_1[_i];
        game.addMission(miter);
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
        initShip(window.GAME.levelsequence.getCurrent());
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
                window.GAME.levelsequence.getCurrent().getObject('ship').reset();
            },
            press: true
        }
    ]);
    window.GAME.game.camera.follow(buf.pObject);
    ___this.init(___this);
}
exports.initShip = initShip;

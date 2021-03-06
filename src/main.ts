/// <reference path="../imports/phaser.d.ts" />
import * as $ from 'jquery';
import {toggleControlScheme} from "./game"
import {MainGame} from "./game"
import {LevelConstructor} from "./level"
import {ShipBinding} from "./ship"
import {Ship} from "./ship"
import {Artemis} from "./ship"
import {Athena} from "./ship"
import {Vulcan} from "./ship"
import {TextDisplay} from "./type"
import {Wrapper} from "./wrapper"
import {Level} from "./level"
import {MissionConstructor} from "./mission"
import {AstroidBelt} from "./astroid"
import {GameSprite} from "./object"
import {DynamicSprite} from "./object"
import {Rover} from "./rover"
import {RoverBinding} from "./rover"
import {Rock} from "./rock"
import * as UTIL from './util'

function getlength(number) {
    return number.toString().length;
}

function genImgList (startFrame:number, endFrame: Number, numlen = 4, prefix = 'resources/blender/earth_holo/', suffix='.png') {
    var out: string[] = []
    for (var i = startFrame; i != endFrame; i++) {
        out.push (prefix + Array(numlen - getlength (i) + 1).join ('0') + i.toString() + suffix);
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

$( document ).ready(function() {
    for (var i=0; i != 50; i++) {
        $( "<img src=\"resources/textures/Intro/Star.png\" class=\"pos\">" ).appendTo( ".stars" )
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

    difDone ();

    initDif ();
    initGame ();
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
}

function setStats (e_stats, so) {
    $(e_stats[0]).children ('.bar').children ('span').css ('width', so.mass);
    $(e_stats[1]).children ('.bar').children ('span').css ('width', so.thrust);
    $(e_stats[2]).children ('.bar').children ('span').css ('width', so.angAcc);
}

function initDif () {
    $('.difficulty > .dif-choice').toArray().forEach(element => {
        element.addEventListener ("click", () => {
            $('.dif-choice.active').removeClass ('active');
            $(element).addClass ('active');
            $('.stats').removeClass ('left');
            $('.stats').removeClass ('middle');
            $('.stats').removeClass ('right');
            var stats = $('.stats > div').toArray ();
            if ($(element).attr('id') == 'easy') {
                $('.stats').addClass ('left');
                setStats (stats, shipStats.easy);
            }
            else if ($(element).attr('id') == 'medium') {
                $('.stats').addClass ('middle');
                setStats (stats, shipStats.medium);
            }
            else if ($(element).attr('id') == 'hard') {
                $('.stats').addClass ('right');
                setStats (stats, shipStats.hard);
            }
        });
    });
}

// Global variables
var game;
(<any>window).GAME = null;

function initGame () {
    game = new MainGame(DoGame);
    (<any>window).GAME = game;
    var story = [
        ['2061', 'The International Space Exploration Administration (ISEA) is coming off their recent success of their manned mission to Mars.', 'Now, they have set their sights on the next stepping stone in the solar system: Jupiter\'s moons.', 'The ISEA believes that landing a spacecraft near Jupiter will reveal new information about the gas giants and the remainder of the solar system.', 'However, this journey will encounter new challenges that will threaten the lives of the astronauts and the reputation of the ISEA.'],
        ['The journey to Jupiter was a success.',
        'Your ship is now in high orbit around Jupiter',
        'A maneuver was executed and you are now in orbit around Jupiter\'s vulcanic moon',
        'IO'
        ]
    ];
    (<any>window).MAIN = new Wrapper ((<any>window).GAME, story);
};

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

function DoGame (game: MainGame): void {
    var levels: LevelConstructor[] = [
        {
            name: "intro",
            game: (<any>window).GAME,
            objects: [
                {
                    name: "stars",
                    assets: "Stars",
                    position: {
                        x: ():number => {return 0},
                        y: ():number => {return 0}
                    }
                },
                {
                    name: "stars2",
                    assets: "Stars",
                    position: {
                        x: ():number => {return 0},
                        y: ():number => {return 1600}
                    }
                },
                {
                    name: "sky",
                    assets: "Sky",
                    position: {
                        x: ():number => {return 0},
                        y: ():number => {return (<any>window).GAME.game.world.height - 820}
                    }
                },
                {
                    name: "mountains",
                    assets: "Mountain-E",
                    position: {
                        x: ():number => {return 0},
                        y: ():number => {return (<any>window).GAME.game.world.height - 520}
                    }
                },
                {
                    name: 'backdrop',
                    assets: "Fore",
                    position: {
                        x: ():number => {return 0},
                        y: ():number => {return (<any>window).GAME.game.world.height - 120}
                    }
                },
                {
                    name: "Launch-L",
                    assets: "Launch-L",
                    physics: "Launch-L",
                    static: true,
                    position: {
                        x: ():number => {return (<any>window).GAME.game.world.width / 2},
                        y: ():number => {return (<any>window).GAME.game.world.height - 96}
                    }
                },
            ],
            frame: () => {
            },
            done: () => {
                return false; //(<any>window).GAME.getLevel ('intro').getObject('Artemis').getAltitude() > 4000;
            },
            init: (___this: Level) => {
                (<any>window).GAME.setGravity (100, 0.1);
            }
        },
        {
            name: "belt1",
            game: (<any>window).GAME,
            objects: [
                {
                    name: "stars",
                    assets: "Stars",
                    position: {
                        x: ():number => {return 0},
                        y: ():number => {return 0},
                        width: 18000,
                        height: 2500
                    },
                    repeat: true
                }
            ],
            frame: () => {
            },
            done: () => {
                return false; //(<any>window).GAME.getLevel ('intro').getObject('Artemis').getAltitude() > 4000;
            },
            init: (___this: Level) => {
                (<any>window).GAME.setGravity (0, 0.1);
                ___this.game.game.world.setBounds(0, 0, 24000, 2500);
                ___this.getObject ('ship').pos = {
                    x: ():number => {return 120},
                    y: ():number => {return (<any>window).GAME.game.world.centerY}
                };
                (<Ship>___this.getObject ('ship')).reset (false);
                (<any>window).GAME.uicontroller.setPlanet ('ceres');

                // Initialize the Astroid belt;
                (<any>___this).astroidbelt = new AstroidBelt ((<any>window).GAME, ___this, 0);
                ___this.addFrame ((<any>___this).astroidbelt.frame)
            }
        },
        {
            name: "IO",
            game: (<any>window).GAME,
            objects: [
                {
                    name: "iogradient",
                    assets: "iogradient",
                    repeat: true,
                    position: {
                        x: ():number => {return 0},
                        y: ():number => {return (<any>window).GAME.game.world.height - 600},
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
                        x: ():number => {return 2300},
                        y: ():number => {return (<any>window).GAME.game.world.height - 110}
                    },
                },
                {
                    name: "iobackdrop2",
                    assets: "IOGround",
                    physics: "IO Ground",
                    static: true,
                    position: {
                        x: ():number => {return 2300 + 4700},
                        y: ():number => {return (<any>window).GAME.game.world.height - 110}
                    },
                },
            ],
            frame: () => {
            },
            done: () => {
                return false; //(<any>window).GAME.getLevel ('intro').getObject('Artemis').getAltitude() > 4000;
            },
            init: (___this: Level) => {
                (<any>window).GAME.setGravity (600, 0.1);
                ___this.game.game.world.setBounds(0, 0, 9200, 1500);
                ___this.getObject ('ship').pos = {
                    x: ():number => {return 325},
                    y: ():number => {return (<any>window).GAME.game.world.height - 200}
                };

                var roverbuff = new Rover ((<any>window).GAME,
                    ___this, 'rover', 'Rover',
                    {
                        x: ():number => {return 458},
                        y: ():number => {return 1313}
                    }, [
                        'rover1'
                    ]);
                ___this.addObject (roverbuff);
                (<Ship>___this.getObject ('ship')).reset (false);
                (<any>window).GAME.uicontroller.setPlanet ('io');
                (<any>window).GAME.addControlScheme([
                    RoverBinding ((<any>window).GAME, roverbuff),
                    {
                        key: Phaser.KeyCode.R,
                        callback: () => {
                            roverbuff.reset();
                        },
                        press: true
                    }
                ]);
                (<any>window).GAME.controls[0].disable();
                (<Ship>___this.getObject ('ship')).disable ();
                ___this.getObject('iobackdrop').pObject.body.setMaterial(roverbuff.worldMaterial);
                ___this.getObject('iobackdrop').reset();
                ___this.getObject('iobackdrop2').pObject.body.setMaterial(roverbuff.worldMaterial);
                ___this.getObject('iobackdrop2').reset();
                ___this.getObject('iogradient').reset();
                roverbuff.reset();
                ___this.game.game.camera.follow(roverbuff.pObject);
                for (var i=0; i !=30; i++) {
                    var type = UTIL.getRandomInt (0,1);
                    var buf;
                    if (type) {
                        buf = new Rock (___this.game,
                         ___this, "rock{0}".format (i), 
                         "rock1",
                         {
                             x: () => {return UTIL.getRandomInt(1200, (<any>window).GAME.game.world.width)},
                             y: () => {return (<any>window).GAME.game.world.height - 250}
                         } )
                    }
                    else {
                        buf = new Rock (___this.game,
                         ___this, "rock{0}".format (i), 
                         "rock2",
                         {
                             x: () => {return UTIL.getRandomInt(1200, 4000)},
                             y: () => {return (<any>window).GAME.game.world.height - 250}
                         } )
                    }
                }
            }
        },
        {
            name: "Europa",
            game: (<any>window).GAME,
            objects: [
                {
                    name: "stars",
                    assets: "Stars",
                    position: {
                        x: ():number => {return 0},
                        y: ():number => {return 0},
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
                        x: ():number => {return 0},
                        y: ():number => {return (<any>window).GAME.game.world.height - 600},
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
                        x: ():number => {return 2300},
                        y: ():number => {return (<any>window).GAME.game.world.height - 110}
                    },
                },
                {
                    name: "EuropaBackDrop1",
                    assets: "europa",
                    physics: "Europa",
                    static: true,
                    position: {
                        x: ():number => {return 2300 + 4700},
                        y: ():number => {return (<any>window).GAME.game.world.height - 110}
                    },
                }
            ],
            frame: () => {
            },
            done: () => {
                return false; //(<any>window).GAME.getLevel ('intro').getObject('Artemis').getAltitude() > 4000;
            },
            init: (___this: Level) => {
                (<any>window).GAME.setGravity (600, 0.1);
                ___this.game.game.world.setBounds(0, 0, 9200, 4500);
                ___this.getObject ('ship').pos = {
                    x: ():number => {return 70},
                    y: ():number => {return (<any>window).GAME.game.world.height - 220}
                };
                (<any>window).GAME.controls[1].disable ();
                (<any>window).GAME.controls[0].enable();

                
                (<Ship>___this.getObject ('ship')).reset (false);
                (<any>window).GAME.uicontroller.setPlanet ('europa');
                ___this.getObject('EuropaBackDrop').reset();
                ___this.getObject('EuropaBackDrop1').reset();
                ___this.getObject('eugradient').reset();
                (<Ship>___this.getObject ('ship')).follow ();
            }
        },

    ]
    var missions: MissionConstructor [] = [
        {
            title: 'Reach 4000m',
            description: 'Exit Earth\'s atmosphere',
            html: "\
                <div class=\"altitude\">\
                    <p>Reach 4000m</p>\
                    <span class=\"alt\">0m</span>\
                    <span class=\"alt-line\"></span>\
                </div>",
            condition: () => {
                if ((<any>window).GAME.getLevel('intro').getObject('ship') == null){
                    return false;
                }
                return (<any>window).GAME.getLevel('intro').getObject('ship').getAltitude () > 4000;
            },
            onDone: () => {
            },
            update: () => {
                if ((<any>window).GAME.getLevel('intro').getObject('ship') == null){
                    (<any>window).GAME.pause ();
                    return;
                }
                var a = parseInt((<any>window).GAME.levelsequence.getCurrent().getObject('ship').getAltitude ());
                if (a < 0){
                    a = 0;
                }
                $('.alt').text (a + 'M');
                var x = (.95 * (a/40));
                if (x > 95) {
                    $('.alt').css ('bottom', '95%')
                }
                else {
                    $('.alt').css ('bottom', x + '%')
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
            condition: () => {
                return (<any>window).GAME.levelsequence.getCurrent().getObject('ship').pObject.x > 9500;
            },
            onDone: () => {
                ;
            },
            update: () => {
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
            condition: () => {
                if ((<any>window).GAME.levelsequence.getCurrent().getObject('rover') == null) {
                    return false;
                }
                return (<any>window).GAME.levelsequence.getCurrent().getObject('rover').return;
            },
            onDone: () => {
                ;
            },
            update: () => {
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
            condition: () => {
                if ((<any>window).GAME.levelsequence.getCurrent().getObject('ship') == null){
                    return false;
                }
                return (<any>window).GAME.levelsequence.getCurrent().getObject('ship').getAltitude () > 4000;
            },
            onDone: () => {
                ;
            },
            update: () => {
                var v = $('#areas > span').text();
                var level = (<any>window).GAME.levelsequence.getCurrent();
                var p = level.getObject('ship').pObject.x / (level.game.game.world.width - 1200);
                if (p * 100 > 100) {
                    p = 1;
                }
                if (p * 100 > parseInt(v.substring(0, v.length -1))) {
                    $('#areas > span').text('{0}%'.format ((p * 100).toFixed (0)));
                }
            }
        }
    ]

    add_levels (levels, missions);
    game.missionControl.begin ();
}

var shipClass;

function add_levels (levels, missions) {
    for (var iter in levels) {
        game.addLevel (levels[iter]);
        
    }
    for (var miter of missions) {
        game.addMission (miter);
    }
}

function difDone () {
    $('.finish-dif').get(0).addEventListener ('click', () => {
        $('.difficulty').css ('display', 'none');
        if ($('.dif-choice.active').attr('id') == 'easy') {
            shipClass = Artemis;
        }
        else if ($('.dif-choice.active').attr('id') == 'medium') {
            shipClass = Athena;
        }
        else if ($('.dif-choice.active').attr('id') == 'hard') {
            shipClass = Vulcan;
        }
        initShip ((<any>window).GAME.levelsequence.getCurrent ());
        (<any>window).GAME.resume ();
    });
    $('.mission-control-done').get (0).addEventListener ('click', () => {
        (<any>window).GAME.wrapper.handleNext(true);
        (<any>window).GAME.closeMissionControl ();
    })
}

export function initShip (___this: Level) {
    var buf = new shipClass (
        (<any>window).GAME,
        ___this
    );

    ___this.addObject (buf);
    (<any>window).GAME.addControlScheme ([
        ShipBinding((<any>window).GAME, <Ship>buf),
        {
            key: Phaser.KeyCode.R,
            callback: () => {
                (<any>window).GAME.levelsequence.getCurrent().getObject('ship').reset();
            },
            press: true
        }
    ]);
    (<any>window).GAME.game.camera.follow(buf.pObject);
    ___this.init (___this);
}
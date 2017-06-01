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
import {Task} from "./background"
import {Level} from "./level"
import {MissionContructor} from "./mission"
import {AstroidBelt} from "./astroid"

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

function GIF (images: string[], element: Element, repeat = true) {
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
}

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
    var testControlBindings = [];
    game.addControlScheme(testControlBindings);
    var story = [
        ['2061', 'The International Space Exploration Administration (ISEA) is coming off their recent success of their manned mission to Mars.', 'Now, they have set their sights on the next stepping stone in the solar system: Jupiter\'s moons.', 'The ISEA believes that landing a spacecraft near Jupiter will reveal new information about the gas giants and the remainder of the solar system.', 'However, this journey will encounter new challenges that will threaten the lives of the astronauts and the reputation of the ISEA.'],
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
                        width: 9200,
                        height: 9200
                    },
                    repeat: true
                },
                
            ],
            frame: () => {
            },
            done: () => {
                return false; //(<any>window).GAME.getLevel ('intro').getObject('Artemis').getAltitude() > 4000;
            },
            init: (___this: Level) => {
                (<any>window).GAME.setGravity (0, 0.1);
                ___this.game.game.world.setBounds(0, 0, 9200, 9200);
                ___this.getObject ('ship').pos = {
                    x: ():number => {return 70},
                    y: ():number => {return (<any>window).GAME.game.world.centerY}
                };
                (<Ship>___this.getObject ('ship')).reset (false);
                (<any>window).GAME.uicontroller.setPlanet ('ceres');

                // Initialize the Astroid belt;
                (<any>___this).astroidbelt = new AstroidBelt ((<any>window).GAME, ___this);
                for (var i=0; i!=160; i++) {
                    (<any>___this).astroidbelt.spawn ();
                }
            }
        },

    ]

    var missions: MissionContructor [][] = [
        [
            {
                title: 'Reach 4000m',
                description: 'Exit Earth\'s atmosphere',
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
                    var a = parseInt((<any>window).GAME.getLevel('intro').getObject('ship').getAltitude ());
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
            }
        ],
        [
            {
                title: 'Survive the astroid belt',
                description: 'Manuever around astroids in the belt',
                condition: () => {
                    return false;
                },
                onDone: () => {
                    ;
                },
                update: () => {
                    ;
                }
            }
        ]
    ]

    add_levels (levels, missions);
}

var shipClass;

function add_levels (levels, missions) {
    for (var iter in levels) {
        game.addLevel (levels[iter]);
        for (var miter of missions[iter]) {
            game.levelsequence.levels[iter].addMission (miter);
        }
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
        initShip ((<any>window).GAME.getLevel ('intro'));
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
                (<Ship>buf).reset();
            },
            press: true
        }
    ]);
    (<any>window).GAME.game.camera.follow(buf.pObject);
    ___this.init (___this);
}
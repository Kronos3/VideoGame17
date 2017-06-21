/// <reference path="../imports/phaser.d.ts" />
import {ControlScheme} from "./control"
import {KeyBinding} from "./control"
import {GameSprite} from "./object"
import {LevelSequence} from "./level"
import {Level} from "./level"
import {LevelConstructor} from "./level"
import {createLevel} from "./level"
import {UIController} from "./ui"
import * as UTIL from "./util"
import {Wrapper} from "./wrapper"
import * as $ from 'jquery';
import {MissionConstructor} from "./mission"
import {generateMission} from "./mission"
import {MissionControl} from "./mission"

export class toggleControlScheme extends ControlScheme {
    enabled: boolean;
    constructor (game: Phaser.Game, _bindings: KeyBinding[], captureInput = true, enabled = true) {
        super (game, _bindings, captureInput);
        this.enabled = enabled;
    }

    enable (){
        this.enabled = true;
    }

    disable (){
        this.enabled = false;
    }

    frame (_args?: any) {
        if (this.enabled) {
            super.frame (_args);
        }
    }
}

Object.defineProperty(Object.prototype, 'watch', {
    value: function(prop, handler){
        var setter = function(val){
            return val = handler.call(this, val);
        };
        Object.defineProperty(this, prop, {
            set: setter
        });
    }
});

export class MainGame {
    onReady: (game: MainGame) => void;
    constructor(onReady: (game: MainGame) => void) {
        this.game = new Phaser.Game(window.innerWidth, window.innerHeight, Phaser.CANVAS, 'T17', {preload: this.preload, create: this.create, update: this.update}, true);
        this.onReady = onReady;
        setTimeout (() => {
            this.isLoaded = true;
            $('.loading').css('display', 'none');
        }, 1000);
        this.uicontroller = new UIController ();
        this.missionControl = new MissionControl (this);
        this.gravityObjects = [];
    }

    game: Phaser.Game;
    cursor: Phaser.CursorKeys;
    controls: toggleControlScheme[] = [];
    levelsequence: LevelSequence = new LevelSequence ();
    assets: string[] = [];
    gravity: number;
    uicontroller: UIController;
    playerCollisionGroup: Phaser.Physics.P2.CollisionGroup;
    missionControl: MissionControl;


    addMission = (l: MissionConstructor) => {
        this.missionControl.addMission (generateMission (l));
    }

    addControlScheme = (bindings: KeyBinding[], captureInput = true) => {
        var temp: toggleControlScheme = new toggleControlScheme (this.game, bindings, captureInput);
        this.controls.push (temp);
    }

    addControlSchemeFromScheme = (scheme: toggleControlScheme) => {
        this.controls.push(scheme);
    }

    preload = () => {
        this.game.load.image('Artemis', '../resources/textures/Artemis/Artemis.png');
        this.game.load.image('ArtemisThrust', '../resources/textures/Artemis/ArtemisThrust.png');
        this.game.load.image('ArtemisL', '../resources/textures/Artemis/ArtemisL.png');
        this.game.load.image('ArtemisR', '../resources/textures/Artemis/ArtemisR.png');
        this.game.load.image('Launch-L', '../resources/textures/Level1/Launch-L.png');
        this.game.load.image('Fore', '../resources/textures/Level1/Foreground-L.png');
        this.game.load.image('Mountain-E', '../resources/textures/Level1/BG_1-L.png');
        this.game.load.image('Sky', '../resources/textures/Level1/Sky Gradient Color Overlay-L.png');
        this.game.load.image('Back', '../resources/textures/Level1/Background-L.png');
        this.game.load.image('Stars', '../resources/textures/Level1/stars.png');
        this.game.load.image('Athena', '../resources/textures/Athena/Athena.png');
        this.game.load.image('AthenaThrust', '../resources/textures/Athena/AthenaThrust.png');
        this.game.load.image('AthenaL', '../resources/textures/Athena/AthenaL.png');
        this.game.load.image('AthenaR', '../resources/textures/Athena/AthenaR.png');
        this.game.load.image('Vulcan', '../resources/textures/Vulcan/Vulcan.png');
        this.game.load.image('VulcanR', '../resources/textures/Vulcan/VulcanR.png');
        this.game.load.image('VulcanL', '../resources/textures/Vulcan/VulcanL.png');
        this.game.load.image('VulcanThrust', '../resources/textures/Vulcan/VulcanThrust.png');
        this.game.load.image('Meteor-Small', '../resources/textures/objects/Meteor_Small-L.png');
        this.game.load.image('Meteor', '../resources/textures/objects/Meteor-L.png');
        this.game.load.image('Meteor-Ice', '../resources/textures/objects/Ice.png');
        this.game.load.image('Meteor-3', '../resources/textures/objects/Meteor_03.png');
        this.game.load.image('ex1', '../resources/animated/explosion/Explosion_01.png');
        this.game.load.image('ex2', '../resources/animated/explosion/Explosion_02.png');
        this.game.load.image('ex3', '../resources/animated/explosion/Explosion_03.png');
        this.game.load.image('ex4', '../resources/animated/explosion/Explosion_04.png');
        this.game.load.image('ex5', '../resources/animated/explosion/Explosion_05.png');
        this.game.load.image('rover1', '../resources/textures/rover/01.png');
        this.game.load.image('IOGround', '../resources/textures/Level3/IOGround.png');
        this.game.load.image('rock1', '../resources/textures/Level3/IORock.png');
        this.game.load.image('rock2', '../resources/textures/Level3/IO Rock_02.png');
        this.game.load.image('europa', '../resources/textures/Level4/Europa.png');
        this.game.load.image('iogradient', '../resources/textures/Level3/io_gradient.png');
        this.game.load.physics('physicsData', '../resources/physics/mappings.json');
        this.game.load.atlasJSONHash ('rover', '../resources/animated/rover/rover.png', '../resources/animated/rover/rover.json')
    }

    pause = () => {
        this.game.paused = true;
    }

    resume = () => {
        this.game.paused = false;
    }

    hide = () => {
        $('#canvas-wrapper').css ('display', "none");
        this.pause ();
    }

    show = () => {
        $('#canvas-wrapper').css ('display', "block");
        this.resume ();
    }

    openMissionControl = () => {
            $('.scene-wrapper').removeClass ('title');
            $('.scene-wrapper').removeClass ('text');
            $('.scene-wrapper').addClass ('game');
            $('.mission-control').css ('display', 'block');
            this.pause ();
    }

    closeMissionControl = () => {
            $('.mission-control').css ('display', 'none');
            this.resume ();
    }

    create = () => {
        var mainCanvas = $(this.game.canvas);
        mainCanvas.detach();
        $('#canvas-wrapper').append (mainCanvas);
        this.game.world.setBounds(0, 0, this.game.width, 4600);
        this.game.physics.startSystem(Phaser.Physics.P2JS);
        this.cursor = this.game.input.keyboard.createCursorKeys();
        this.hide ();
        this.onReady (this);
        this.game.time.advancedTiming = true;
        this.game.time.desiredFps = 60;
        this.game.camera.bounds.top = 0;
        this.game.physics.p2.boundsCollidesWith = [];
        this.levelsequence.initGame ();
        this.playerCollisionGroup = this.game.physics.p2.createCollisionGroup();
    }

    gravityObjects: GameSprite[];
    addGravity = (t: GameSprite) => {
        this.gravityObjects.push (t);
    }

    player: GameSprite;
    isLoaded:boolean = false;
    wrapper: Wrapper;

    getGravity = () => { // Gravity at a distance
        return 1;
    }

    update = () => {
        // Control
        if (this.controls != undefined) {
            for (var iter of this.controls) {
                iter.frame ();
            }
        }
        
        if (this.levelsequence.getCurrent ().done ()) {
            this.wrapper.handleNext ();
            return;
        }
        
        // MissionControl
        this.missionControl.frame ();

        // Per-Level
        this.levelsequence.getCurrent ().frame ();

        // Gravity
        this.gravityObjects.forEach(element => {
            element.gravityAction();
        });
    }

    get_ratio = () => {
        return 60 / this.game.time.fps;
    }

    get_fps = () => {
        return this.game.time.fps;
    }

    resize = () => {
        //var height = $(window).height();
        //var width = $(window).width();
        //this.game.width = width;
        //this.game.height = height;
        //this.game.renderer.resize(width, height);
        this.levelsequence.levels.forEach(element => {
            element.resetPositions ();
        });
    }

    newLevel = (name: string): Level => {
        var level = new Level (this, name, () => {return false});
        this.levelsequence.addLevel (level);
        return level;
    }

    addLevel = (l: Level | LevelConstructor) => {
        if (l instanceof Level) {
            this.levelsequence.addLevel (l);
        }
        else {
            this.levelsequence.addLevel (createLevel (l));
        }
    }

    getLevel = (name: string): Level => {
        return this.levelsequence.getLevel (name);
    }

    setGravity = (value: number, restitution = 0.8) => {
        this.gravity = value;
        this.game.physics.p2.restitution = restitution;
    }

    loadAsset = (name: string, path: string) => {
        /*console.log (name + ':' + path)
        this.game.load.image (name, path);*/
    }
}

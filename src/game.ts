/// <reference path="../imports/phaser.d.ts" />
/// <reference path="../imports/watch.min.js" />
import {ControlScheme} from "./control"
import {KeyBinding} from "./control"
import {GameSprite} from "./object"
import {LevelSequence} from "./level"
import {Level} from "./level"
import {LevelConstructor} from "./level"
import {createLevel} from "./level"
import {UIController} from "./ui"
import * as UTIL from "./util"

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
        this.game = new Phaser.Game(window.innerWidth, window.innerHeight, Phaser.CANVAS, 'T17', {preload: this.preload, create: this.create, update: this.update, render: this.render}, true);
        this.newLevel ('global');
        this.onReady = onReady;
        setTimeout (() => {
            this.isLoaded = true;
            $('.loading').css('display', 'none');
        }, 1000);
        this.uicontroller = new UIController ();
    }

    game: Phaser.Game;
    cursor: Phaser.CursorKeys;
    controls: toggleControlScheme[] = [];
    levelsequence: LevelSequence = new LevelSequence ();
    assets: string[] = [];
    gravity: number;
    uicontroller: UIController;

    addControlScheme = (bindings: KeyBinding[], captureInput = true) => {
        var temp: toggleControlScheme = new toggleControlScheme (this.game, bindings, captureInput);
        this.controls.push (temp);
    }

    addControlSchemeFromScheme = (scheme: toggleControlScheme) => {
        this.controls.push(scheme);
    }

    preload = () => {
        this.game.load.image('rocket', '../resources/textures/player/Rocket-L.png');
        this.game.load.image('rocket-thrust', '../resources/textures/player/Rocket-L-T.png');
        this.game.load.image('rocket-L-L', '../resources/textures/player/Rocket-L-L.png');
        this.game.load.image('rocket-L-R', '../resources/textures/player/Rocket-L-R.png');
        this.game.load.image('Launch-L', '../resources/textures/Launch-L.png');
        this.game.load.image('Fore', '../resources/textures/Foreground-L.png');
        this.game.load.image('Mountain-E', '../resources/textures/BG_1-L.png');
        this.game.load.image('Sky', '../resources/textures/Sky Gradient Color Overlay-L.png');
        this.game.load.image('Back', '../resources/textures/Background-L.png');
        this.game.load.image('Stars', '../resources/textures/stars.png');
        this.game.load.image('Explosion', '../resources/textures/explosion.png');
        this.game.load.physics('physicsData', '../resources/physics/mappings.json');
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

    create = () => {
        var mainCanvas = $(this.game.canvas);
        mainCanvas.detach();
        $('#canvas-wrapper').append (mainCanvas);
        this.game.world.setBounds(0, 0, this.game.width, 4200);
        this.game.physics.startSystem(Phaser.Physics.P2JS);
        this.cursor = this.game.input.keyboard.createCursorKeys();
        this.hide ();
        this.onReady (this);
        this.game.time.advancedTiming = true;
        this.game.time.desiredFps = 60;
        this.game.camera.follow(this.getLevel('global').getObject('Artemis').pObject);
        this.game.camera.bounds.top = 0;
        this.game.physics.p2.boundsCollidesWith = [];
        this.levelsequence.initGame ();

    }

    isLoaded:boolean = false;

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

        // Per-Level
        this.levelsequence.getCurrent ().frame ();
    }

    get_ratio = () => {
        return 60 / this.game.time.fps;
    }

    render = () => {
        this.game.debug.text('render FPS: ' + (this.game.time.fps || '--') , 2, 14, "#00ff00");
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
        var level = new Level (this, name);
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

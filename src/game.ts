/// <reference path="../imports/phaser.d.ts" />
import {ControlScheme} from "./control"
import {KeyBinding} from "./control"
import {GameSprite} from "./object"
import {LevelSequence} from "./level"
import {Level} from "./level"
import {Asset} from "./level"
import {LevelConstructor} from "./level"
import {createLevel} from "./level"
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

export class MainGame {
    onReady: (game: MainGame) => void;
    constructor(onReady: (game: MainGame) => void) {
        this.game = new Phaser.Game(window.innerWidth, window.innerHeight, Phaser.CANVAS, 'T17', {preload: this.preload, create: this.create, update: this.update}, true);
        $(window).resize( () => {
            this.resize();
        });
        this.newLevel ('global');
        this.onReady = onReady;

    }

    game: Phaser.Game;
    cursor: Phaser.CursorKeys;
    controls: toggleControlScheme[] = [];
    levelsequence: LevelSequence = new LevelSequence ();
    assets: Asset[] = [];

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
    }

    hide = () => {
        $('#canvas-wrapper').css ('display', "none");
    }

    show = () => {
        $('#canvas-wrapper').css ('display', "block");
    }

    create = () => {
        this.game.physics.startSystem(Phaser.Physics.P2JS);
        this.cursor = this.game.input.keyboard.createCursorKeys();
        var mainCanvas = $(this.game.canvas);
        $('#canvas-wrapper').append (mainCanvas);
        this.hide ();
        this.onReady (this);
    }

    update = () => {
        // Control
        if (this.controls != undefined) {
            for (var iter of this.controls) {
                iter.frame ();
            }
        }
    }

    resize = () => {
        var height = $(window).height();
        var width = $(window).width();
        this.game.width = width;
        this.game.height = height;
        this.game.renderer.resize(width, height);
    }

    newLevel = (name: string): Level => {
        var level = new Level (this, name);
        this.levelsequence.addLevel (level);
        return level;
    }

    addLevel (l: Level | LevelConstructor) {
        if (l instanceof Level) {
            this.levelsequence.addLevel (l);
        }
        else {
            this.levelsequence.addLevel (createLevel (l));
        }
    }

    getAsset = (name: string): Asset => {
        for (var i of this.assets) {
            if (i.name == name) {
                return i;
            }
        }
        UTIL.error ('Asset {0} could not be found'.format (name));
        return null;
    }

    loadAsset = (name: string, path: string) => {
        /*console.log (name + ':' + path)
        this.game.load.image (name, path);*/
    }
}

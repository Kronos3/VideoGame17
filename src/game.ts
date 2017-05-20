/// <reference path="../imports/phaser.d.ts" />
import {ControlScheme} from "./control"
import {KeyBinding} from "./control"
import {GameSprite} from "./object"
import {LevelSequence} from "./level"
import {Level} from "./level"
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

    constructor() {
        this.game = new Phaser.Game(window.innerWidth, window.innerHeight, Phaser.CANVAS, 'T17', {preload: this.preload, create: this.create, update: this.update}, true);
        $(window).resize( () => {
            this.resize();
        });
        this.newLevel ('intro');
    }

    game: Phaser.Game;
    cursor: Phaser.CursorKeys;
    controls: toggleControlScheme[] = [];
    levelsequence: LevelSequence = new LevelSequence ();

    addControlScheme = (bindings: KeyBinding[], captureInput = true) => {
        var temp: toggleControlScheme = new toggleControlScheme (this.game, bindings, captureInput);
        this.controls.push (temp);
    }

    addControlSchemeFromScheme = (scheme: toggleControlScheme) => {
        this.controls.push(scheme);
    }

    preload = () => {
        this.loadAsset('rocket', 'resources/textures/player/Rocket-L.png', "all");
        this.loadAsset('rocket-thrust', 'resources/textures/player/Rocket-L-T.png', "all");
        this.loadAsset('rocket-L-L', 'resources/textures/player/Rocket-L-L.png', "all");
        this.loadAsset('rocket-L-R', 'resources/textures/player/Rocket-L-R.png', "all");
    }

    hide = () => {
        $('#canvas-wrapper').css ('display', "none");
    }

    show = () => {
        $('#canvas-wrapper').css ('display', "block");
    }

    loadAsset = (name: string, path: string, level: Level | string) => {
        if (typeof level === "string") {
            if (level == "all") {
                for (var iter of this.levelsequence.levels) {
                    iter.loadAsset (name, path);
                }
            }
            else {
                this.levelsequence.getLevel (level).loadAsset (name, path);
            }
        }
        else {
            level.loadAsset (name, path);
        }
    }

    create = () => {
        this.game.physics.startSystem(Phaser.Physics.P2JS);
        this.cursor = this.game.input.keyboard.createCursorKeys();
        var mainCanvas = $(this.game.canvas);
        $('#canvas-wrapper').append (mainCanvas);
        this.hide ();
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
}

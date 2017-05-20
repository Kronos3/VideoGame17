/// <reference path="../imports/phaser.d.ts" />
import {ControlScheme} from "./control"
import {KeyBinding} from "./control"

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
    }

    game: Phaser.Game;
    cursor: Phaser.CursorKeys;
    controls: toggleControlScheme[] = [];

    addControlScheme (bindings: KeyBinding[], captureInput = true) {
        var temp: toggleControlScheme = new toggleControlScheme (this.game, bindings, captureInput);
        this.controls.push (temp);
    }

    addControlSchemeFromScheme (scheme: toggleControlScheme) {
        this.controls.push(scheme);
    }

    preload() {
        this.game.load.image('rocket', 'resources/textures/player/Rocket-L.png');
        this.game.load.image('rocket-thrust', 'resources/textures/player/Rocket-L-T.png');
        this.game.load.image('rocket-L-L', 'resources/textures/player/Rocket-L-L.png');
        this.game.load.image('rocket-L-R', 'resources/textures/player/Rocket-L-R.png');
    }

    create() {
        this.game.physics.startSystem(Phaser.Physics.P2JS);
        this.cursor = this.game.input.keyboard.createCursorKeys();
        var mainCanvas = $(this.game.canvas);
        $('#canvas-wrapper').append (mainCanvas);
        $('#canvas-wrapper').css ('display', "none");
    }

    update () {
        // Control
        if (this.controls != undefined) {
            for (var iter of this.controls) {
                iter.frame ();
            }
        }
    }

    resize () {
        var height = $(window).height();
        var width = $(window).width();
        this.game.width = width;
        this.game.height = height;
        this.game.renderer.resize(width, height);
    }
}

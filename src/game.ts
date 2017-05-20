/// <reference path="../imports/phaser.d.ts" />
import {ControlScheme} from "./control"
import {KeyBinding} from "./control"
import {GameSprite} from "./object"

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

export interface asset {
    path: string;
    name: string;
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
    objects: GameSprite[] = [];
    assets: asset[] = [];

    public addControlScheme (bindings: KeyBinding[], captureInput = true) {
        var temp: toggleControlScheme = new toggleControlScheme (this.game, bindings, captureInput);
        this.controls.push (temp);
    }

    public addControlSchemeFromScheme (scheme: toggleControlScheme) {
        this.controls.push(scheme);
    }

    public preload() {
        this.loadAsset('rocket', 'resources/textures/player/Rocket-L.png');
        this.loadAsset('rocket-thrust', 'resources/textures/player/Rocket-L-T.png');
        this.loadAsset('rocket-L-L', 'resources/textures/player/Rocket-L-L.png');
        this.loadAsset('rocket-L-R', 'resources/textures/player/Rocket-L-R.png');
    }

    public hide () {
        $('#canvas-wrapper').css ('display', "none");
    }

    public show () {
        $('#canvas-wrapper').css ('display', "block");
    }

    public create() {
        this.game.physics.startSystem(Phaser.Physics.P2JS);
        this.cursor = this.game.input.keyboard.createCursorKeys();
        var mainCanvas = $(this.game.canvas);
        $('#canvas-wrapper').append (mainCanvas);
    }

    public update () {
        // Control
        if (this.controls != undefined) {
            for (var iter of this.controls) {
                iter.frame ();
            }
        }
    }

    public resize () {
        var height = $(window).height();
        var width = $(window).width();
        this.game.width = width;
        this.game.height = height;
        this.game.renderer.resize(width, height);
    }

    public loadAsset (name: string, path: string) {
        this.game.load.image (name, path);
        this.assets.push ({path: path, name: name});
    }

    public addObjectFromAsset (assetName: string, extra?: any) {
        this.objects.push (new GameSprite (this, assetName, extra));
    }

    public newObject (name: string, path: string, extra?: any) {
        this.loadAsset (name, path);
    }
}

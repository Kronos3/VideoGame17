import {MainGame} from "./game"
import {_position} from "./object"
import {GameSprite} from "./object"
import {Level} from "./level"

export class Rock extends GameSprite {
    bodyName: string;
    constructor (game: MainGame, l: Level, name:string, asset:string, pos: _position) {
        super (game, l, name, pos, asset);
        switch (asset) {
            case 'rock1':
                this.bodyName = "IO Rock";
                break;
            case 'rock2':
                this.bodyName = "IO Rock_02";
                break;
        }
        this.loadBody (this.bodyName);
        this.pObject.body.onBeginContact.add(this.collide, this);
        this.appendToLevel ();
        this.game.addGravity (this);
        this.pObject.body.mass = 3;
    }

    collide = (target: Phaser.Physics.P2.Body, this_target: Phaser.Physics.P2.Body, shapeA, shapeB, contactEquation) => {
        if(shapeB.body.id == 9) {
            
        }
    }
}
import {MainGame} from "./game"
import {TextDisplay} from "./type"
import * as $ from 'jquery';

export class Wrapper {
    game: MainGame;
    scenes: TextDisplay[] = [];
    order: number[] = [
        // 0: level
        // 1: TextScene
        // 2: Open Mission Control
        1,
        0,
        2,
        0,
        1,
        2,
        0
    ];
    currentTotal: number = 0;
    currentText: number = 0;
    constructor (game: MainGame, scene_text: string[][]) {
        this.game = game;
        scene_text.forEach(element => {
            this.scenes.push (new TextDisplay ($('.buf.anim-typewriter').get(0), element, this.textdone));
        });
        this.game.levelsequence.current = 0;
        this.game.wrapper = this;
    }

    textdone  = () =>{
        this.handleNext ();
    }

    handleNext (t = false) {
        if (this.order[this.currentTotal] == 2) {
            this.game.openMissionControl();
        }
        else if (this.order[this.currentTotal] == 1) {
            this.scenes[this.currentText].start();
            this.currentText++;
            $('.scene-wrapper').removeClass ('title');
            $('.scene-wrapper').removeClass ('game');
            $('.scene-wrapper').addClass ('text');
        }
        else if (this.order[this.currentTotal] == 0) {
            if (!this.game.isLoaded) {
                return;
            }
            $('.scene-wrapper').removeClass ('title');
            $('.scene-wrapper').removeClass ('text');
            $('.scene-wrapper').addClass ('game');
            this.game.show ();
            this.game.levelsequence.nextLevel (t);
        }
        this.currentTotal++;
    }
}
import {MainGame} from "./game"
import {TextDisplay} from "./type"

export class Wrapper {
    game: MainGame;
    scenes: TextDisplay[] = [];
    order: number[] = [
        // 0: level
        // 1: TextScene
        0,
        //0
    ];
    currentTotal: number = 0;
    currentText: number = 0;
    constructor (game: MainGame, scene_text: string[][]) {
        this.game = game;
        scene_text.forEach(element => {
            this.scenes.push (new TextDisplay ($('.buf.anim-typewriter').get(0), element, this.textDone));
            this.game.levelsequence.current = 0;
        });
        this.game.wrapper = this;
    }

    textDone = () => {
        this.handleNext ();
    }

    handleNext () {
        if (this.order[this.currentTotal]) {
            $('.scene-wrapper').removeClass ('title');
            $('.scene-wrapper').removeClass ('game');
            $('.scene-wrapper').addClass ('text');
            this.scenes[this.currentText].start();
            this.currentText++;
        }
        else {
            if (!this.game.isLoaded) {
                return;
            }
            $('.scene-wrapper').removeClass ('title');
            $('.scene-wrapper').removeClass ('text');
            $('.scene-wrapper').addClass ('game');
            this.game.show ();
            this.game.levelsequence.nextLevel ();
        }
        this.currentTotal++;
    }
}
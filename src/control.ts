/// <reference path="../imports/phaser.d.ts" />

export interface KeyBinding {
  key: number;
  callback: (_args?: any[]) => void;
  press?: boolean;
}

export class ControlScheme {
  bindings: KeyBinding[] = [];
  game: Phaser.Game;
  captureInput: boolean;
  constructor (game: Phaser.Game, _bindings: KeyBinding[], captureInput = true, enabled = true) {
    this.game = game;
    this.captureInput = captureInput;
    for (var i = 0; i != _bindings.length; i++) {
      this.bindings.push(_bindings[i]);
    }
  }

  frame (_args?: any[]) {
    for (var iter = 0; iter != this.bindings.length; iter++) {
      if (typeof this.bindings[iter].press == "undefined") {
        continue;
      }
      if (this.game.input.keyboard.isDown (this.bindings[iter].key)) {
        this.bindings[iter].callback(_args);
      }
    }
  }

  addBinding (binding: KeyBinding) {
    this.bindings.push(binding);
  }
}

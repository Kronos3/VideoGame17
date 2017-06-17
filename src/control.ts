export interface KeyBinding {
  key: number;
  callback: (_args?: any[]) => void;
  press?: boolean;
}

export class ControlScheme {
  bindings: KeyBinding[] = [];
  game: Phaser.Game;
  captureInput: boolean;
  keys: Phaser.Key[] = [];
  constructor (game: Phaser.Game, _bindings: KeyBinding[], captureInput = true, enabled = true) {
    this.game = game;
    this.captureInput = captureInput;
    for (var i = 0; i != _bindings.length; i++) {
      this.addBinding (_bindings[i]);
    }
  }

  frame (_args?: any[]) {
    for (var iter = 0; iter != this.bindings.length; iter++) {
      if (typeof this.bindings[iter].press != "undefined") {
        continue;
      }
      if (this.game.input.keyboard.isDown (this.bindings[iter].key)) {
        this.bindings[iter].callback(_args);
      }
      if (this.bindings[iter].key == -1) {
        this.bindings[iter].callback(_args);
      }
    }
  }

  addBinding (binding: KeyBinding) {
    if (binding.press) {
        var key1 = this.game.input.keyboard.addKey(binding.key);
        key1.onDown.add(binding.callback);
        this.keys.push (key1);
      }
      else {
        this.bindings.push(binding);
      }
  }
}

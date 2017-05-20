# VideoGame17

API Reference

# Controls
``` typescript
export interface KeyBinding {
    key: number;
    callback: (_args?: any[]) => void;
    press?: boolean;
}

export declare class ControlScheme {
    bindings: KeyBinding[];
    game: Phaser.Game;
    captureInput: boolean;
    constructor(game: Phaser.Game, _bindings: KeyBinding[], captureInput?: boolean, enabled?: boolean);
    frame(_args?: any[]): void;
    addBinding(binding: KeyBinding): void;
}
```

# Main Game

``` typescript
export declare class toggleControlScheme extends ControlScheme {
    enabled: boolean;
    constructor(game: Phaser.Game, _bindings: KeyBinding[], captureInput?: boolean, enabled?: boolean);
    enable(): void;
    disable(): void;
    frame(_args?: any): void;
}
export interface asset {
    path: string;
    name: string;
}
export declare class MainGame {
    constructor();
    game: Phaser.Game;
    cursor: Phaser.CursorKeys;
    controls: toggleControlScheme[];
    objects: GameSprite[];
    assets: asset[];
    addControlScheme: (bindings: KeyBinding[], captureInput?: boolean) => void;
    addControlSchemeFromScheme: (scheme: toggleControlScheme) => void;
    preload: () => void;
    hide: () => void;
    show: () => void;
    create: () => void;
    update: () => void;
    resize: () => void;
    loadAsset: (name: string, path: string) => void;
    addObjectFromAsset: (assetName: string, extra?: any) => void;
    newObject: (name: string, path: string, extra?: any) => void;
}
```

# Object
``` typescript
export declare class GameSprite {
    pObject: Phaser.Sprite;
    game: GAME.MainGame;
    assetName: string;
    extra: Object;
    constructor(game: GAME.MainGame, asset: string, extra?: any);
    addProperty(extra: any): void;
    enablePhysics(): void;
}
export declare class DynamicSprite extends GameSprite {
    assets: string[];
    constructor(game: GAME.MainGame, assets: string[], extra?: any);
    switchToIndex(index: number): void;
    switchTo(name: string): void;
}
```

# Util
``` typescript
export declare function find(a: any, b: any[]): number;
```

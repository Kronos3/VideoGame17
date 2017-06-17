import * as UTIL from "./util"
import {Level} from "./level"
import * as $ from 'jquery';
import {MainGame} from "./game"

export interface MissionConstructor {
    title: string;
    description: string;
    html: string;
    condition: () => boolean;
    onDone: () => void;
    update?: () => void;
    CustomElement?: string;
}

export function generateMission (m: MissionConstructor) {
    var e = $( "<div class=\"mission\">\
    <p class=\"title\">{0}</p>\
    <p class=\"description\">{1}</p>\
</div>".format (m.title, m.description));
    return new Mission (e.get(0), m.html, m.condition, m.title, m.onDone, m.description, m.update);
}

export class MissionControl {
    missionIndex: number = 0;
    missions: Mission[] = [];
    game: MainGame;
    constructor (game: MainGame) {
        this.game = game;
    }

    addMission = (m: Mission) => {
        m.setControl (this);
        this.missions.push(m);
        $(m.element).appendTo( ".mission-control > .inner" );
    }

    begin = () => {
        this.missionIndex = 0;
        $('.active-mission').html (this.missions[this.missionIndex].elementUI);
    }

    nextMission = () => {
        this.game.wrapper.handleNext ();
        this.missionIndex++;
        $('.active-mission').html (this.missions[this.missionIndex].elementUI);
    }

    frame = () => {
        var current_mission = this.missions[this.missionIndex];
        if (typeof current_mission === 'undefined') {
            this.game.wrapper.handleNext();
            return;
        }
        current_mission.frame ();
        if(!$(current_mission.element).hasClass('current')) {
            $(current_mission.element).addClass('current');
        }
    }
}

export class Mission {
    complete: boolean = false;
    title: string;
    desc: string;
    element: Element;
    elementUI: string;
    condition: () => boolean;
    update: () => void;
    onDone: () => void;
    missionControl: MissionControl;
    constructor(e: Element, uie: string, condition: () => boolean, title: string, onDone: () => void, desc?: string, update?: () => void) {
        this.element = e;
        this.elementUI = uie;
        this.title = title;
        this.desc = desc;
        this.condition = condition;
        this.update = update;
        this.onDone = onDone;
    }

    setControl = (c: MissionControl) => {
        this.missionControl = c;
    }

    frame = () => {
        if (this.condition ()) {
            this.complete = true;
            this.onDone();
            $(this.element).removeClass('current');
            $(this.element).addClass('finished');
            this.missionControl.nextMission ();
        }
        this.update ();
    }
}
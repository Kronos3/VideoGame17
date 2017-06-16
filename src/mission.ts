import * as UTIL from "./util"
import {Level} from "./level"
import * as $ from 'jquery';

export interface MissionContructor {
    title: string;
    description: string;
    condition: () => boolean;
    onDone: () => void;
    update?: () => void;
    CustomElement?: string;
}

export function generateMission (m: MissionContructor) {
    var e = $( "<div class=\"mission\">\
    <p class=\"title\">{0}</p>\
    <p class=\"description\">{1}</p>\
</div>".format (m.title, m.description));
    return new Mission (e.get(0), m.condition, m.title, m.onDone, m.description, m.update);
}

export class MissionControl {
    missionIndex: number = 0;
    missions: Mission[] = [];
    level: Level;
    constructor (level: Level) {
        this.level = level;
    }

    addMission = (m: Mission) => {
        m.setControl (this);
        this.missions.push(m);
        $(m.element).appendTo( ".mission-control > .inner" );
    }

    begin = () => {
        this.missionIndex = 0;
    }

    nextMission = () => {
        this.missionIndex++;
    }

    frame = () => {
        var current_mission = this.missions[this.missionIndex];
        if (typeof current_mission === 'undefined') {
            this.level.game.wrapper.handleNext();
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
    condition: () => boolean;
    update: () => void;
    onDone: () => void;
    missionControl: MissionControl;
    constructor(e: Element, condition: () => boolean, title: string, onDone: () => void, desc?: string, update?: () => void) {
        this.element = e;
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
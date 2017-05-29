import * as UTIL from "./util"

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
    //e.appendTo( ".mission-control > .inner" );
    return new Mission (e.get(0), m.condition, m.title, m.onDone, m.description, m.update);
}

export class MissionControl {
    activeMission: Mission;
    missionIndex: number;
    missions: Mission[] = [];

    constructor () {
    }

    addMission = (m: Mission) => {
        this.missions.push(m);
    }

    begin = () => {
        this.missionIndex = 0;
        this.activeMission = this.missions[this.missionIndex];
    }

    frame = () => {

    }
}

export class Mission {
    complete: boolean = false;
    title: string;
    desc: string;
    element: Element;
    condition: () => boolean;
    update: () => void;
    constructor(e: Element, condition: () => boolean, title: string, onDone: () => void, desc?: string, update?: () => void) {
        this.element = e;
        this.title = title;
        this.desc = desc;
        this.condition = condition;
        this.update = update;
    }

    frame = () => {
        if (this.condition ()) {
            this.complete = true;
        }
        this.update ();
    }
}
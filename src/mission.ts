export class MissionControl {
    activeMission: Mission;
    missions: Mission[] = [];

    constructor () {

    }

    addMission = (m: Mission) => {
        this.missions.push(m);
    }
}

export class Mission {
    complete: boolean = false;
    title: string;
    desc: string;
    element: Element;
    condition: () => boolean;
    update: () => void;
    constructor(e: Element, condition: () => boolean, title: string, desc?: string, update?: () => void) {
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
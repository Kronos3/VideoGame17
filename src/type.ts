export class TextDisplay {
    text: string[];
    skip: boolean = false;
    element: Element;
    betweenTimeout;
    fnCall: () => void;
    onDone: () => void;
    constructor (element: Element, text: string[], onDone: () => void) {
        this.text = text;
        this.onDone = onDone;
        this.element = element;
    }

    handleClick = () => {
        this.skip = true;
        if (this.betweenTimeout != -1) {
            clearTimeout (this.betweenTimeout);
            this.fnCall ();
        }
    }

    typeWriter = (text:string, i, fnCallback: () => void) => {
        this.fnCall = fnCallback;
        this.betweenTimeout = -1;
        // check if text isn't finished yet
        if (i < (text.length)) {
            // add next character to h1
            this.element.innerHTML = text.substring(0, i+1) +'<span aria-hidden="true"></span>';
    
            // wait for a while and call this function again for next character
            if (!this.skip) {
                setTimeout(() => {
                    this.typeWriter(text, i + 1, fnCallback)
                }, (Math.random() * (60 - 30) + 30).toFixed(0));
            }
            else {
                this.typeWriter(text, i + 1, fnCallback);
            }
        }
        // text finished, call callback if there is a callback function
        else if (typeof fnCallback == 'function') {
            // call callback after timeout
            
            this.betweenTimeout = setTimeout(fnCallback, 1800);
        }
    }

    done: boolean = false;

    start = (i = 0) => {
        if (i == 0) {
            document.querySelector(".scene.scene1").addEventListener("click", this.handleClick);
        }
        if (typeof this.text[i] == 'undefined'){
            this.done = true;
            document.querySelector(".scene.scene1").removeEventListener("click", this.handleClick);
            this.onDone ();
            return
        }
        if (i < this.text[i].length) {
            // text exists! start typewriter animation
            this.typeWriter(this.text[i], 0, () =>{
                // after callback (and whole text has been animated), start next text
                this.skip = false;
                this.start(i + 1);
            });
        }
        else {
            this.done = true;
            document.querySelector(".scene.scene1").removeEventListener("click", this.handleClick);
            this.onDone ();
        }
    }

}
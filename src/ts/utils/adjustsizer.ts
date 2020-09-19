class adjustSizer {
    width: number;
    height: number;
    baseSize: number;

    constructor() {
        // initialaize board size
        this.width = this.height = 650;
        this.baseSize = 60;
        this.adjust();
    }

    adjust(){
        if( window.innerWidth < this.width ){
            this.width = this.height = Math.ceil(window.innerWidth*0.8);
        }
    }

    getWidth(){
        return this.width;
    }

    getHeight(){
        return this.height;
    }

    getBaseSize(){
        return Math.ceil(this.width/10);
    }
}

export default adjustSizer;

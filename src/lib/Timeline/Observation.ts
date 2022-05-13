export default class Observation {
    id: string;
    code: string;    
    text: string;
    time: Date;
    value: number;
    unit: string;

    getTime() {
        return this.time.getTime();
    }

    constructor(id: string, code: string, text: string, time: Date, value: number, unit: string) {
        this.id = id;
        this.code = code;
        this.text = text;
        this.time = time;
        this.value = value;
        this.unit = unit;
    }
}
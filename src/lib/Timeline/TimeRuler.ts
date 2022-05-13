import Marker from "./Marker";
import Time from "./Time";
import Year from "./Year";
import type Span from "./Span";

const MinLineDist: number = 110.0;
const HourUnitCandidates: number[] = [1/60, 5/60, 1/4, 1/2, 1, 2, 4, 6, 12, 24, 48, 96, 192];
const YearUnitCandidates: number[] = [1/12, 1/6, 1/4, 1/2, 1, 2, 4, 8, 16];

const OneQuarter: number = 900000;
const OneHour: number = OneQuarter*4;
const OneDay: number = OneHour*24;
const OneYear: number = OneDay*365.25;

export default class TimeRuler
{
    start: number;
    end: number;
    span: number;
    leftMargin: number = 100;

    constructor(selection: Span, leftMargin: number) {
        this.leftMargin = leftMargin;        
        this.start = selection.start.getTime();
        this.end = selection.end.getTime();
        this.span = this.end - this.start;
    }

    calculateTimeUnits(width: number): any {
        var distanceEachMillisecond = width / this.span;
        if (distanceEachMillisecond <= 0) {
            return {detailed: false, unit: 1};
        }
        
        for(var i = 0; i < HourUnitCandidates.length; i++) {
            var candidate = HourUnitCandidates[i];
            var length = distanceEachMillisecond * OneHour * candidate;
            if (length >= MinLineDist) {                                
                return {detailed: true, v: candidate};
            }            
        }

        //No hour unit candidate used - try by years
        for(var i = 0; i < YearUnitCandidates.length; i++) {
            var candidate = YearUnitCandidates[i];
            var length = distanceEachMillisecond * OneYear * candidate;
            if (length >= MinLineDist) {                                
                return {detailed: false, v: candidate};
            }            
        }        

        return {detailed: false, unit: 1};
    }

    getX(value: number, width: number, hide: boolean = false, leftMargin: number = null) {
        if (leftMargin == null) {
            leftMargin = this.leftMargin
        }
        var result = leftMargin + ((width - leftMargin) * (value - this.start))/this.span;                            
        if (result < leftMargin && hide) {
            return -999;
        }

        return result;
    }
    
    calculateLocalTime(time: number) : number {
        var zone = new Date(time).getTimezoneOffset()*60*1000;
        return time + zone;
    }

    render(context: CanvasRenderingContext2D, width: number, height: number) {
        var unit = this.calculateTimeUnits(width); 
                        
        var startDay: number = this.start - this.start % OneDay;   
        var localDay = this.calculateLocalTime(startDay);        

        var markers = new Array<Marker>();
        if (unit.detailed) 
        {
            //Add markers based on hours
            
            for(var time = localDay; time < this.end; time += OneHour*unit.v) {
                markers.push(new Time(time, this));
            }
            
            for(var time = localDay + OneHour*unit.v*0.5; time < this.end; time += OneHour*unit.v) {
                markers.push(new Marker(time, this));
            }
        }
        else {
            //Add markers based on years
            var start = new Date(new Date(localDay).getFullYear(), 0).getTime();
            var end = new Date(new Date(this.end).getFullYear(), 12, 31).getTime();

            for(var time = start; time < end; time += OneYear*unit.v){

                var markerDate = new Date(time);                
                var marker = new Year(markerDate.getTime(), this);
                markers.push(marker);
            }            
        }
        
        const date = new Date(localDay);
        const dateText =  date.toDateString();
        
        context.font = "bold 12px Arial";                
        context.fillText(dateText, 4, 17);
        markers.map(m => {
            if (m) {
                m.render(context, width, height);
            }
        });
    }
}
import Time from "./Time";

export default class Year extends Time {
    override render(context: CanvasRenderingContext2D, width: number, height: number) {
        var x = this.ruler.getX(this.time, width);               
        if (x > this.ruler.leftMargin) {
            var time = new Date(this.time);
 
            let timeDisplayText;

            if (time.getMonth() == 0) {
                timeDisplayText = `${time.getFullYear()}`;
                context.font = "bold 12px Arial";                                                
                this.drawLine(context, x, height, true);
            }
            else {
                timeDisplayText = "|";
                this.drawLine(context, x, height, false);
            }
        
            context.fillText(timeDisplayText, x - context.measureText(timeDisplayText).width/2, 17);            
        }
    }
}
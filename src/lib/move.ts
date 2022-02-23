import type {Action} from "./action";
import {Orientation} from "./orientation";

export default function move(node: HTMLElement, orientation: Orientation = Orientation.Free): ReturnType<Action> {    

    let _orientation: Orientation = orientation;
    let _downPos: DOMPoint;
    let _parentRect: DOMRect;
    const parent: HTMLElement = node.parentElement;
    
    function onTouchStart(event: TouchEvent) {
        if (event.touches?.length == 1) {
            onDown(event, event.touches[0].pageX, event.touches[0].pageY);
        }
    }   
    
    function onMouseDown(event: MouseEvent) {
        onDown(event, event.clientX, event.clientY);
    }
    
    function onDown(event: Event, x, y: number) {
        if (event.defaultPrevented) {            
            return;
        }

        _parentRect = parent.getBoundingClientRect();
        const nodeRect = node.getBoundingClientRect();
        _downPos = new DOMPoint(x - nodeRect.x, y - nodeRect.y);
        node.style.cursor = "move";
        node.style.touchAction = `none`;        
        node.addEventListener("mouseup", onUp);        
        node.addEventListener("touchmove", onTouchMove);
        node.addEventListener("touchend", onUp)
    }

    function onTouchMove(event: TouchEvent) {
        if (event.touches?.length == 1) {
            onMove(event, event.touches[0].pageX, event.touches[0].pageY);
        }
    }

    function onMouseMove(event: MouseEvent) {        
        onMove(event, event.clientX, event.clientY);        
    }

    function onMove(event: Event, x, y: number) {          
        if (event.defaultPrevented) {
            return;
        }

        if (_downPos) {      
            
            node.style.cursor = "move";

            if(_orientation < Orientation.Vertical) {
                var newX = x - _downPos.x - _parentRect.x;
                if (newX <= 0) {
                    newX = 0;
                }
                if (newX >= _parentRect.width - node.offsetWidth)
                {
                    newX = _parentRect.width - node.offsetWidth;
                }

                node.style.left = `${newX}px`;
            }
            if (_orientation != Orientation.Horizontal) {
                var newY = y - _downPos.y - _parentRect.y;

                if (newY <= 0) {
                    newY = 0;
                }
                if (newY >= _parentRect.height - node.offsetHeight)
                {
                    newY = _parentRect.height - node.offsetHeight;
                }

                node.style.top = `${newY}px`;
            }

            event.preventDefault();
        }
    }

    function onUp(_: MouseEvent) {                		
        node.removeEventListener('mouseup', onUp);        
        node.removeEventListener("touchmove", onTouchMove);
        node.removeEventListener("touchend", onUp);     
        node.style.cursor = "default";
        _downPos = null;
    }

    node.addEventListener("mousedown", onMouseDown);   
    node.addEventListener("mousemove", onMouseMove);
    node.addEventListener("touchstart", onTouchStart); 

    return {
        destroy() {
            node.removeEventListener('mousedown', onMouseDown);
            node.removeEventListener('mousemove', onMouseMove);
            node.removeEventListener("touchstart", onTouchStart);
        }
    };
}

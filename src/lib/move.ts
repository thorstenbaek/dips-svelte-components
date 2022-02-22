import type {Action} from "./action";
import {Orientation} from "./orientation";

export default function move(node: HTMLElement, orientation: Orientation = Orientation.Free): ReturnType<Action> {    

    let _orientation: Orientation = orientation;
    let _downPos: DOMPoint;
    let _parentRect: DOMRect;
    const parent: HTMLElement = node.parentElement;
    
    
    console.log(_orientation);

    function onDown(event: MouseEvent) {
        _parentRect = parent.getBoundingClientRect();
        const nodeRect = node.getBoundingClientRect();
        _downPos = new DOMPoint(event.clientX - nodeRect.x, event.clientY - nodeRect.y);
        node.style.cursor = "move";
        window.addEventListener("mousemove", onMouseMove);
        window.addEventListener("mouseup", onUp);        
        window.addEventListener("touchmove", onTouchMove);
        window.addEventListener("touchend", onUp)
    }

    function onTouchMove(event: TouchEvent) {
        event.preventDefault();
        
        if (event.touches?.length == 1) {
            onMove(event.touches[0].pageX, event.touches[0].pageY);
        }
    }

    function onMouseMove(event: MouseEvent) {
        event.preventDefault();

         
        onMove(event.clientX, event.clientY);
    }

    function onMove(x, y: number) {
        
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
        }
    }

    function onUp(event: MouseEvent) {                
        window.removeEventListener('mousemove', onMouseMove);
		window.removeEventListener('mouseup', onUp);        
        window.removeEventListener("touchmove", onTouchMove);
        window.removeEventListener("touchend", onUp);     
        node.style.cursor = "default";
        _downPos = null;
    }

    node.addEventListener("mousedown", onDown);   
    node.addEventListener("touchstart", onDown); 

    return {
        destroy() {
            node.removeEventListener('mousedown', onDown);
            node.removeEventListener("touchstart", onDown);
        }
    };
}

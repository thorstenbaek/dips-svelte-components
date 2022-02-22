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
        window.addEventListener("mousemove", onMove);
        window.addEventListener("mouseup", onUp);        
    }

    function onMove(event: MouseEvent) {
        event.preventDefault();
        if (_downPos) {            
            node.style.cursor = "move";
            if(_orientation < Orientation.Vertical) {
                var newX = event.clientX - _downPos.x - _parentRect.x;
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
                var newY = event.clientY - _downPos.y - _parentRect.y;

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
        window.removeEventListener('mousemove', onMove);
		window.removeEventListener('mouseup', onUp);        
        node.style.cursor = "default";
        _downPos = null;
    }

    node.addEventListener("mousedown", onDown);    

    return {
        destroy() {
            node.removeEventListener('mousedown', onDown);
        }
    };
}

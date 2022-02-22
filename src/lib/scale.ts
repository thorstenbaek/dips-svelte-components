import type {Action} from "./action";
import {Orientation} from "./orientation";



export default function scale(node: HTMLElement, orientation: Orientation = Orientation.Free): ReturnType<Action> {    

    const _offset: number = 5;
    const parent: HTMLElement = node.parentElement;
    let _parentRect: DOMRect = parent.getBoundingClientRect();

    function onDown(event: MouseEvent) {
    }

    function isNorth(event:MouseEvent) {
        return event.clientY - node.offsetTop - _parentRect.y < _offset;
    }
    
    function isSouth(event: MouseEvent) {
        return event.clientY - node.offsetTop - _parentRect.y > node.offsetHeight - _offset;
    }

    function isWest(event: MouseEvent) {
        return event.clientX - node.offsetLeft - _parentRect.x < _offset;
    }

    function isEast(event: MouseEvent) {
        return event.clientX - node.offsetLeft - _parentRect.x > node.offsetWidth - _offset;
    }

    function onMove(event: MouseEvent) {
        event.preventDefault();
        
        if (isNorth(event)) {
            if (isWest(event)){
                node.style.cursor = "nw-resize";
            }
            else if (isEast(event)) {
                node.style.cursor = "ne-resize";
            }
            else {
                node.style.cursor = "n-resize";
            }
        }
        else if (isSouth(event)) {
            if (isWest(event)){
                node.style.cursor = "sw-resize";
            }
            else if (isEast(event)) {
                node.style.cursor = "se-resize";
            }
            else {
                node.style.cursor = "s-resize";
            }
        }
        else if (isWest(event)) {
            node.style.cursor = "w-resize";
        }
        else if (isEast(event)) {
            node.style.cursor = "e-resize";
        }
        else
        {
            node.style.cursor = "default";
        }
    }

    function onUp(event: MouseEvent) {                
    }


    node.addEventListener("mousedown", onDown);    
    node.addEventListener('mousemove', onMove);

    return {
        destroy() {
            node.removeEventListener('mousemove', onMove);
            node.removeEventListener('mousedown', onDown);            
        }
    };
}

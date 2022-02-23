import type {Action} from "./action";
import {Orientation} from "./orientation";

export default function scale(node: HTMLElement, orientation: Orientation = Orientation.Free): ReturnType<Action> {    

    const _offset: number = 15;    
    const parent: HTMLElement = node.parentElement;
    let _direction: string = null;
    let _previewDirection: string = null;
    let _parentRect: DOMRect = parent.getBoundingClientRect();
    let _initialRect: DOMRect = null;    
    let _downPos: DOMPoint = null;

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

    function getDirection(event: MouseEvent): string {
        if (isNorth(event)) {
            if (isWest(event)) return "nw";
            else if (isEast(event)) return "ne";            
            else return "n";            
        }
        else if (isSouth(event)) {
            if (isWest(event)) return "sw";            
            else if (isEast(event)) return "se";            
            else return "s";            
        }
        else if (isWest(event)) return "w";
        else if (isEast(event)) return "e";        
        else {            
            return null;
        }
    }

    function scaleNorth(delta: number) {
        const newHeight = _initialRect.height - delta;
        node.style.top = `${_initialRect.top + delta - _parentRect.top}px`;
        node.style.height = `${newHeight}px`; 
    }
    
    function scaleSouth(delta: number) {
        const newHeight = _initialRect.height + delta;
        node.style.height = `${newHeight}px`; 
    }

    function ScaleWest(delta: number) {
        const newWidth = _initialRect.width - delta;
        node.style.left = `${_initialRect.left + delta - _parentRect.left}px`;
        node.style.width = `${newWidth}px`;
    }

    function ScaleEast(delta: number) {
        const newWidth = _initialRect.width + delta;
        node.style.width = `${newWidth}px`; 
    }

    function doScale(deltaX, deltaY: number) {
        switch (_direction) {
            case "n": {                
                scaleNorth(deltaY);
                break;
            }
            case "w": {
                ScaleWest(deltaX);
                break;
            }
            case "s": {
                scaleSouth(deltaY);        
                break;
            }
            case "e": {
                ScaleEast(deltaX);
                break;
            }
            case "nw": {
                scaleNorth(deltaY);
                ScaleWest(deltaX);
                break;
            }
            case "ne": {
                scaleNorth(deltaY);
                ScaleEast(deltaX);
                break;
            }
            case "sw": {
                scaleSouth(deltaY);
                ScaleWest(deltaX);
                break;
            }
            case "se": {
                scaleSouth(deltaY);
                ScaleEast(deltaX);
                break;
            }
        }
    }

    function onDown(event: MouseEvent) {
        parent.addEventListener("mouseup", onUp);        
        _parentRect = parent.getBoundingClientRect();
        _initialRect = node.getBoundingClientRect();
        _direction = getDirection(event);        
        _downPos = new DOMPoint(event.clientX, event.clientY);

        if (_downPos && _direction) {            
            event.preventDefault();
        }
    }
    
    function onMove(event: MouseEvent) {        
        if (_downPos && _direction)
        {
            event.preventDefault();
            doScale(event.clientX - _downPos.x, event.clientY - _downPos.y);

            return;
        }

        _previewDirection = getDirection(event);
        
        if (_previewDirection) {
            node.style.cursor = `${_previewDirection}-resize`;            
        } else {
            node.style.cursor = `default`;            
        }
    }

    function onUp(event: MouseEvent) {                        
        _direction = null;
        _previewDirection = null;

        node.removeEventListener('mouseup', onUp);        
    }


    node.addEventListener("mousedown", onDown);    
    parent.addEventListener('mousemove', onMove);

    return {
        destroy() {
            parent.removeEventListener('mousemove', onMove);
            node.removeEventListener('mousedown', onDown);            
        }
    };
}

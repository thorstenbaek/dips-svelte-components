import { dirty_components } from "svelte/internal";
import type {Action} from "./action";
import {Orientation} from "./orientation";

export default function scale(node: HTMLElement, factor: number = 1.0): ReturnType<Action> {    

    console.log("factor", factor);

    const _offset: number = 15;    
    const parent: HTMLElement = node.parentElement;
    let _direction: string = null;
    let _previewDirection: string = null;
    let _parentRect: DOMRect = parent.getBoundingClientRect();
    let _initialRect: DOMRect = node.getBoundingClientRect();    
    let _downPos: DOMPoint = null;
    let _dist1: number;
    let _scale: number = 1;
    let _change: number = 1;

    function isNorth(pos: DOMPoint) {
        return pos.y - node.offsetTop - _parentRect.y < _offset;
    }
    
    function isSouth(pos: DOMPoint) {
        return pos.y - node.offsetTop - _parentRect.y > node.offsetHeight - _offset;
    }

    function isWest(pos: DOMPoint) {
        return pos.x - node.offsetLeft - _parentRect.x < _offset;
    }

    function isEast(pos: DOMPoint) {
        return pos.x - node.offsetLeft - _parentRect.x > node.offsetWidth - _offset;
    }

    function getDirection(pos: DOMPoint): string {
        if (isNorth(pos)) {
            if (isWest(pos)) return "nw";
            else if (isEast(pos)) return "ne";            
            else return "n";            
        }
        else if (isSouth(pos)) {
            if (isWest(pos)) return "sw";            
            else if (isEast(pos)) return "se";            
            else return "s";            
        }
        else if (isWest(pos)) return "w";
        else if (isEast(pos)) return "e";        
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

    function doScale(deltaX: number, deltaY: number) {
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

    function dist(a: TouchEvent) {
        if (a.touches.length > 1) {
            var zw = a.touches[0].pageX - a.touches[1].pageX, zh = a.touches[0].pageY - a.touches[1].pageY;
            return Math.sqrt(zw * zw + zh * zh);
        }
        else return 0;
    }
    
    function onMouseDown(event: MouseEvent) {
        onDown(event, event.clientX, event.clientY);
    }

    function onTouchDown(event: TouchEvent) {
        _dist1 = dist(event);

        if (event.touches.length == 1) {
            onDown(event, event.touches[0].clientX, event.touches[0].clientY);
        }
    }

    function onDown(event: Event, x: number, y: number) {
        parent.addEventListener("mouseup", onUp);        
        node.addEventListener("touchend", onUp);
        
        _parentRect = parent.getBoundingClientRect();
        _initialRect = node.getBoundingClientRect();
        _downPos = new DOMPoint(x, y);
        _direction = getDirection(_downPos);                

        if (_downPos && _direction) {            
            event.preventDefault();
        }
    }

    function onMouseMove(event: MouseEvent) {
        onMove(event, event.clientX, event.clientY);
    }

    function manualScale(f: number) {
        var scaleMatrix = new  DOMMatrixReadOnly().scale(f);
        var translateMatrix = new DOMMatrixReadOnly().translate(f, f);
        
        var transformMatrix = translateMatrix.multiply(scaleMatrix);
        var topLeft = transformMatrix.transformPoint(new DOMPoint(_initialRect.left, _initialRect.top));
        var bottomRight = transformMatrix.transformPoint(new DOMPoint(_initialRect.right, _initialRect.bottom));

        node.style.left = `${topLeft.x}px`; 
        node.style.top = `${topLeft.y}px`; 
        node.style.width = `${bottomRight.x - topLeft.x}px`; 
        node.style.height = `${bottomRight.y - topLeft.y}px`; 

    }

    function onTouchMove(event: TouchEvent) {
        if (_dist1 && event.touches.length == 2) {
            _change = dist(event) / _dist1 * _scale;            
            //node.style.transform = `scale(${_change})`; 
            manualScale(_change);            
        }
    }

    function onMove(event: Event, x: number, y: number) {        
        if (_downPos && _direction)
        {
            event.preventDefault();
            doScale(x - _downPos.x, y - _downPos.y);

            return;
        }

        _previewDirection = getDirection(new DOMPoint(x, y));
        
        if (_previewDirection) {
            node.style.cursor = `${_previewDirection}-resize`;            
        } else {
            node.style.cursor = `default`;            
        }
    }

    function onUp(_: Event) {                        
        _direction = null;
        _dist1 = null;
        _scale = _change;
        _previewDirection = null;

        parent.removeEventListener('mouseup', onUp);        
        node.removeEventListener('touchend', onUp);        
    }

    manualScale(factor);

    node.addEventListener("mousedown", onMouseDown);    
    node.addEventListener("touchstart", onTouchDown);    
    parent.addEventListener('mousemove', onMouseMove);
    node.addEventListener("touchmove", onTouchMove);

    return {
        destroy() {
            parent.removeEventListener('mousemove', onMouseMove);
            node.removeEventListener("touchmove", onTouchMove);
            node.removeEventListener('mousedown', onMouseDown);            
            node.removeEventListener('touchstart', onTouchDown);            
        }
    };
}

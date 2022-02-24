import type {Action} from "./action";
import {Orientation} from "./orientation";

export default function transformation(element: HTMLElement): ReturnType<Action> {    
    
    let _transformation: DOMMatrix = new DOMMatrix();
    let _current: DOMMatrix;
    let _initialPoint: DOMPoint;


    function distance(p1: DOMPointReadOnly, p2: DOMPointReadOnly): number {
        return Math.sqrt(
            (p2.x - p1.x)*(p2.x - p1.x) + 
            (p2.y - p1.y)*(p2.y - p1.y) + 
            (p2.z - p1.z)*(p2.z - p1.z));
        
    }

    function onTouchStart(event: TouchEvent) {
        if (event.touches?.length == 1) {
            onDown(event, event.touches[0].pageX, event.touches[0].pageY);
        }
    }   
    
    function onMouseDown(event: MouseEvent) {
        onDown(event, event.clientX, event.clientY);
    }

    function onDown(event: Event, x: number, y: number) {        
        window.addEventListener("mousemove", onMouseMove);
        element.addEventListener("touchmove", onTouchMove);
        window.addEventListener("mouseup", onUp);   
        element.addEventListener("touchend", onUp);
        _initialPoint = new DOMPoint(x, y);                
        event.preventDefault();
    }

    function onTouchMove(event: TouchEvent) {
        if (event.touches?.length == 1) {
            onMove(event, event.touches[0].pageX, event.touches[0].pageY);
        }
    }

    function onMouseMove(event: MouseEvent) {
        onMove(event, event.clientX, event.clientY);
    }

    function onMove(event: Event, x: number, y: number) {
        if (_initialPoint) {            
            _current = _transformation;

            _current = _current.multiply(new DOMMatrixReadOnly().translate(
                x - _initialPoint.x, y - _initialPoint.y));
            //_transformation = _transformation.multiply(new DOMMatrixReadOnly().rotate(0.1));
            //_transformation = _transformation.multiply(new DOMMatrixReadOnly().scale(1.01, 1.01, 1.01, 0.0, 0.0, 0.0));
            
            element.style.transform = `${_current}`;   
            
            const box = element.getBoundingClientRect();
            event.preventDefault();
        }
    }

    function onUp(event: MouseEvent) {
        _initialPoint = null;
        _transformation = _current;
        window.removeEventListener("mouseup", onUp);   
        element.removeEventListener("touchend", onUp);   
        window.removeEventListener("mousemove", onMouseMove);   
        element.removeEventListener("touchmove", onTouchMove);
        event.preventDefault();
    
    }

    element.addEventListener("mousedown", onMouseDown);   
    element.addEventListener("touchstart", onTouchStart);
    

    return {
        update() {

        },
        destroy() {
            element.removeEventListener("mousedown", onMouseDown);   
            window.removeEventListener("mousemove", onMouseMove);
        }
    };
}
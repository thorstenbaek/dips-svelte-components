import type {Action} from "./action";
import {Orientation} from "./orientation";

export default function transformation(element: HTMLElement, orientation: Orientation = Orientation.Free): ReturnType<Action> {    
    
    let _translation: DOMMatrixReadOnly = new DOMMatrixReadOnly();
    let _newTranslation: DOMMatrixReadOnly = new DOMMatrixReadOnly();
    let _scale: DOMMatrixReadOnly = new DOMMatrixReadOnly();
    let _newScale: DOMMatrixReadOnly = new DOMMatrixReadOnly();

    let _initialPoint: DOMPoint;
    let _doScale: boolean = false;
    let _dist: number;


    function distance(p1: DOMPointReadOnly, p2: DOMPointReadOnly): number {
        return Math.sqrt(
            (p2.x - p1.x)*(p2.x - p1.x) + 
            (p2.y - p1.y)*(p2.y - p1.y) + 
            (p2.z - p1.z)*(p2.z - p1.z));
        
    }

    function onKeyDown(event: KeyboardEvent) {
        _doScale = event.ctrlKey;
    }

    function onTouchStart(event: TouchEvent) {        
        if (event.touches?.length > 0) {
            onDown(event, event.touches[0].pageX, event.touches[0].pageY);
        }        
        
        if (event.touches?.length > 1) {
            _dist = distance(
                new DOMPoint(event.touches[0].pageX, event.touches[0].pageY), 
                new DOMPoint(event.touches[1].pageX, event.touches[1].pageY));
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
        window.addEventListener("mouseleave", onUp);
        window.addEventListener("blur", onUp);
        _initialPoint = new DOMPoint(x, y);                

        _newTranslation = new DOMMatrixReadOnly();
        _newScale = new DOMMatrixReadOnly();
        event.preventDefault();
    }

    function onTouchMove(event: TouchEvent) {
        if (event.touches?.length > 0) {
            onMove(event, event.touches[0].pageX, event.touches[0].pageY);
        } 
        if (_dist && event.touches?.length > 1) {
            var d = distance(
                new DOMPoint(event.touches[0].pageX, event.touches[0].pageY), 
                new DOMPoint(event.touches[1].pageX, event.touches[1].pageY));
            onScale(event, d/_dist)
        }
    }

    function onMouseMove(event: MouseEvent) {
        if (_doScale) {
            var dist = distance(new DOMPoint(event.clientX, event.clientY), _initialPoint);            
            var scale = dist/20;
            onScale(event, scale);
        }
        else {
            onMove(event, event.clientX, event.clientY);
        }
    }

    function applyTransformations() {        
        var transform = _newTranslation.multiply(_newScale);        
        element.style.transform = `${transform}`;   
    }

    function onMove(event: Event, x: number, y: number) {
        if (_initialPoint) {                       
            _newScale = _scale;
            _newTranslation = _translation;
            
            if (orientation < 2) {
                _newTranslation = _newTranslation.multiply(new DOMMatrixReadOnly().translate(x - _initialPoint.x, 0));            
            }
            if (orientation != 1) {
                _newTranslation = _newTranslation.multiply(new DOMMatrixReadOnly().translate(0, y - _initialPoint.y));            
            }
            
            applyTransformations();
            event.preventDefault();
        }
    }

    function onScale(event: Event, scale: number) {
        if (_initialPoint) {                       
            _newTranslation = _translation;
            _newScale = _scale.multiply(new DOMMatrixReadOnly().scale(scale));
            applyTransformations();            
            event.preventDefault();
        }
    }

    function onUp(event: Event) {
        _doScale = false; 
        _initialPoint = null;

        // accumulate current translation
        _translation = _newTranslation;
        _scale = _newScale;

        window.removeEventListener("mouseup", onUp);   
        element.removeEventListener("touchend", onUp);   
        window.removeEventListener("mousemove", onMouseMove);   
        element.removeEventListener("touchmove", onTouchMove);
        event.preventDefault();
    
    }

    element.addEventListener("mousedown", onMouseDown);   
    element.addEventListener("touchstart", onTouchStart);
    window.addEventListener("keydown", onKeyDown)
    window.addEventListener("keyup", onUp)

    return {
        update() {

        },
        destroy() {
            element.removeEventListener("mousedown", onMouseDown);   
            element.removeEventListener("touchstart", onTouchStart);
            window.removeEventListener("keydown", onKeyDown)
            window.removeEventListener("keyup", onUp)
        }
    };
}
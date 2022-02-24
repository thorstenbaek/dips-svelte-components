import type {Action} from "./action";

export default function tracking(element: HTMLElement): ReturnType<Action> {

    var observer = new MutationObserver(record => {
        var target = record[0].target as HTMLElement;
        
        const rect: DOMRectReadOnly = target.getBoundingClientRect();
        element.dispatchEvent(new CustomEvent('track', 
            {
                detail: {
                    target,
                    rect                     
                }}));
        });
        
    observer.observe(element, { attributes : true, attributeFilter : ['style', 'transform'] });
    
    return {
        destroy() {
            observer.disconnect();
        }
    }
}
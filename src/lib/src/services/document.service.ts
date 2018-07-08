import { Injectable, ElementRef } from "@angular/core";
import { DomRefService } from "./dom.service";

@Injectable()
export class DocumentService {
    private documentHeight: number;

    constructor(private readonly DOMService: DomRefService) { 
        this.setDocumentHeight();
    }

    
    getElementFixedTop(elementRef: ElementRef) {
        return elementRef.nativeElement.getBoundingClientRect().top;
    }

    getElementFixedLeft(elementRef: ElementRef) {
        return elementRef.nativeElement.getBoundingClientRect().left;
    }

    getElementAbsoluteTop(elementRef: ElementRef) {
        var scrollOffsets = this.getScrollOffsets();
        return elementRef.nativeElement.getBoundingClientRect().top + scrollOffsets.y;
    }

    getElementAbsoluteLeft(elementRef: ElementRef) {
        var scrollOffsets = this.getScrollOffsets();
        return elementRef.nativeElement.getBoundingClientRect().left + scrollOffsets.x;
    }

    getElementAbsoluteRight(elementRef: ElementRef) {
        var scrollOffsets = this.getScrollOffsets();
        return elementRef.nativeElement.getBoundingClientRect().right;
    }

    setDocumentHeight(){
        this.documentHeight = this.calculateDocumentHeight();
    }

    getDocumentHeight(){
        return this.documentHeight;
    }

    private calculateDocumentHeight() {
        var doc = this.DOMService.getNativeDocument();
        return Math.max(
            doc.body.scrollHeight, doc.documentElement.scrollHeight,
            doc.body.offsetHeight, doc.documentElement.offsetHeight,
            doc.body.clientHeight, doc.documentElement.clientHeight
        );
    }

    private getScrollOffsets() {
        var w = this.DOMService.getNativeWindow();

        // This works for all browsers except IE versions 8 and before
        if (w.pageXOffset != null) return { x: w.pageXOffset, y: w.pageYOffset };
        // For IE (or any browser) in Standards mode
        var d = w.document;
        if (document.compatMode == "CSS1Compat")
            return { x: d.documentElement.scrollLeft, y: d.documentElement.scrollTop };
        // For browsers in Quirks mode
        return { x: d.body.scrollLeft, y: d.body.scrollTop };
    }
}
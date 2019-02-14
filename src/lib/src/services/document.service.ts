import { Injectable, ElementRef } from '@angular/core';
import { DomRefService } from './dom.service';

export interface IDocumentService {
    getElementFixedTop(elementRef: ElementRef): number;

    getElementFixedLeft(elementRef: ElementRef);

    getElementAbsoluteTop(elementRef: ElementRef);

    getElementAbsoluteLeft(elementRef: ElementRef);

    setDocumentHeight();

    getDocumentHeight(): number;
    isParentScrollable(elementRef: ElementRef): boolean;
    isElementBeyondOthers(elementRef: ElementRef, isElementFixed: boolean, keywordToDiscard: string): boolean;
    scrollToTheTop(elementRef: ElementRef): void;
    scrollToTheBottom(elementRef: ElementRef): void;
}

@Injectable()
export class DocumentService implements IDocumentService {
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

    setDocumentHeight() {
        this.documentHeight = this.calculateDocumentHeight();
    }

    getDocumentHeight() {
        return this.documentHeight;
    }

    isParentScrollable(elementRef: ElementRef): boolean {
        return this.getFirstScrollableParent(elementRef.nativeElement) !== this.DOMService.getNativeDocument().body;
    }

    isElementBeyondOthers(elementRef: ElementRef, isElementFixed: boolean, keywordToDiscard: string) {
        const x1 = isElementFixed ? this.getElementFixedLeft(elementRef) : this.getElementAbsoluteLeft(elementRef);
        const y1 = isElementFixed ? this.getElementFixedTop(elementRef) : this.getElementAbsoluteTop(elementRef);
        const x2 = x1 + elementRef.nativeElement.getBoundingClientRect().width - 1;
        const y2 = y1 + elementRef.nativeElement.getBoundingClientRect().height - 1;

        const elements1 = this.DOMService.getNativeDocument().elementsFromPoint(x1, y1);
        const elements2 = this.DOMService.getNativeDocument().elementsFromPoint(x2, y2);

        return (
            this.getFirstElementWithoutKeyword(elements1, keywordToDiscard) !== elementRef.nativeElement ||
            this.getFirstElementWithoutKeyword(elements2, keywordToDiscard) !== elementRef.nativeElement
        );
    }

    scrollToTheTop(elementRef: ElementRef): void {
        const firstScrollableParent = this.getFirstScrollableParent(elementRef.nativeElement);
        if (firstScrollableParent !== this.DOMService.getNativeDocument().body) {
            firstScrollableParent.scrollTo(0, 0);
        } else {
            this.DOMService.getNativeWindow().scrollTo(0, 0);
        }
    }

    scrollToTheBottom(elementRef: ElementRef): void {
        const firstScrollableParent = this.getFirstScrollableParent(elementRef.nativeElement);
        if (firstScrollableParent !== this.DOMService.getNativeDocument().body) {
            firstScrollableParent.scrollTo(0, this.DOMService.getNativeDocument().body.scrollHeight);
        } else {
            this.DOMService.getNativeWindow().scrollTo(0, this.DOMService.getNativeDocument().body.scrollHeight);
        }
    }

    private getFirstScrollableParent(node: any) {
        const regex = /(auto|scroll|overlay)/;

        const style = (node: any, prop: any) =>
            this.DOMService.getNativeWindow()
                .getComputedStyle(node, null)
                .getPropertyValue(prop);

        const scroll = (node: any) => regex.test(style(node, 'overflow') + style(node, 'overflow-y') + style(node, 'overflow-x'));

        const scrollparent = (node: any): any => {
            return !node || node === this.DOMService.getNativeDocument().body
                ? this.DOMService.getNativeDocument().body
                : scroll(node)
                ? node
                : scrollparent(node.parentNode);
        };

        return scrollparent(node);
    }

    private calculateDocumentHeight() {
        const documentRef = this.DOMService.getNativeDocument();
        return Math.max(
            documentRef.body.scrollHeight,
            documentRef.documentElement.scrollHeight,
            documentRef.body.offsetHeight,
            documentRef.documentElement.offsetHeight,
            documentRef.body.clientHeight,
            documentRef.documentElement.clientHeight
        );
    }

    private getScrollOffsets() {
        const winReference = this.DOMService.getNativeWindow();
        const docReference = this.DOMService.getNativeDocument();

        // This works for all browsers except IE versions 8 and before
        if (winReference.pageXOffset != null) return { x: winReference.pageXOffset, y: winReference.pageYOffset };

        // For IE (or any browser) in Standards mode
        if (docReference.compatMode == 'CSS1Compat')
            return {
                x: docReference.documentElement.scrollLeft,
                y: docReference.documentElement.scrollTop
            };

        // For browsers in Quirks mode
        return { x: docReference.body.scrollLeft, y: docReference.body.scrollTop };
    }

    private getFirstElementWithoutKeyword(elements: Element[], keyword: string): Element {
        while (elements[0] && elements[0].classList.toString().includes(keyword)) {
            elements.shift();
        }
        return elements[0];
    }
}

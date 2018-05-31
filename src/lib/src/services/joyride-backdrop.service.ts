import { Injectable, Renderer2, ElementRef, RendererFactory2, ViewContainerRef } from "@angular/core";
import { DocumentService } from "./document.service";
import { Scroll } from "./event-listener.service";
import { JoyrideOptionsService } from "./joyride-options.service";

@Injectable()
export class JoyrideBackdropService {

    private renderer: Renderer2;

    private backdropContainer: any;
    private backdropContent: any;
    private backdropTop: any;
    private backdropBottom: any;
    private backdropMiddleContainer: any;
    private backdropMiddleContent: any;
    private leftBackdrop: any;
    private targetBackdrop: any;
    private rightBackdrop: any;

    private elementRef: ViewContainerRef;
    private targetAbsoluteTop: number;
    private targetAbsoluteLeft: number;
    private lastXScroll: number = 0;
    private lastYScroll: number = 0;

    constructor(
        private readonly documentService: DocumentService,
        private readonly optionsService: JoyrideOptionsService,
        rendererFactory: RendererFactory2
    ) {
        this.renderer = rendererFactory.createRenderer(null, null);
    }

    show(elementRef: ViewContainerRef, idSelector: string) {

        this.elementRef = elementRef;
        this.targetAbsoluteTop = this.documentService.getElementAbsoluteTop(elementRef.element);
        this.targetAbsoluteLeft = this.documentService.getElementAbsoluteLeft(elementRef.element);

        this.backdropContainer = this.renderer.createElement('div');
        this.renderer.addClass(this.backdropContainer, "backdrop-container");
        this.renderer.setStyle(this.backdropContainer, "position", "fixed");
        this.renderer.setStyle(this.backdropContainer, "top", "0px");
        this.renderer.setStyle(this.backdropContainer, "left", "0px");
        this.renderer.setStyle(this.backdropContainer, "width", "100%");
        this.renderer.setStyle(this.backdropContainer, "height", "100%");
        this.renderer.setStyle(this.backdropContainer, "z-index", "1000");
        this.renderer.appendChild(document.body, this.backdropContainer);

        this.backdropContent = this.renderer.createElement('div');
        this.renderer.addClass(this.backdropContent, "backdrop-content");
        this.renderer.setStyle(this.backdropContent, "position", "relative");
        this.renderer.setStyle(this.backdropContent, "height", "100%");
        this.renderer.setStyle(this.backdropContent, "display", "flex");
        this.renderer.setStyle(this.backdropContent, "flex-direction", "column");
        this.renderer.appendChild(this.backdropContainer, this.backdropContent);

        this.backdropTop = this.renderer.createElement('div');
        this.renderer.addClass(this.backdropTop, "joyride-backdrop");
        this.renderer.addClass(this.backdropTop, "backdrop-top");
        this.renderer.setStyle(this.backdropTop, "width", "100%");
        this.renderer.setStyle(this.backdropTop, "height", this.targetAbsoluteTop - this.lastYScroll + 'px');
        this.renderer.setStyle(this.backdropTop, "flex-shrink", "0");
        this.renderer.setStyle(this.backdropTop, "background-color", `rgba(${this.optionsService.getBackdropColor()}, 0.7)`);
        this.renderer.appendChild(this.backdropContent, this.backdropTop);

        this.backdropMiddleContainer = this.renderer.createElement('div');
        this.renderer.addClass(this.backdropMiddleContainer, "backdrop-middle-container");
        this.renderer.setStyle(this.backdropMiddleContainer, "height", elementRef.element.nativeElement.offsetHeight + 'px');
        this.renderer.setStyle(this.backdropMiddleContainer, "width", "100%");
        this.renderer.setStyle(this.backdropMiddleContainer, "flex-shrink", "0");
        this.renderer.appendChild(this.backdropContent, this.backdropMiddleContainer);

        this.backdropMiddleContent = this.renderer.createElement('div');
        this.renderer.addClass(this.backdropMiddleContent, "backdrop-middle-content");
        this.renderer.setStyle(this.backdropMiddleContent, "display", "flex");
        this.renderer.setStyle(this.backdropMiddleContent, "width", "100%");
        this.renderer.setStyle(this.backdropMiddleContent, "height", "100%");
        this.renderer.appendChild(this.backdropMiddleContainer, this.backdropMiddleContent);

        this.leftBackdrop = this.renderer.createElement('div');
        this.renderer.addClass(this.leftBackdrop, "joyride-backdrop");
        this.renderer.addClass(this.leftBackdrop, "backdrop-left");
        this.renderer.setStyle(this.leftBackdrop, "flex-shrink", "0");
        this.renderer.setStyle(this.leftBackdrop, "width", this.targetAbsoluteLeft - this.lastXScroll + "px");
        this.renderer.setStyle(this.leftBackdrop, "background-color", `rgba(${this.optionsService.getBackdropColor()}, 0.7)`);
        this.renderer.appendChild(this.backdropMiddleContent, this.leftBackdrop);

        this.targetBackdrop = this.renderer.createElement('div');
        this.renderer.addClass(this.targetBackdrop, "backdrop-target");
        this.renderer.setStyle(this.targetBackdrop, "flex-shrink", "0");
        this.renderer.setStyle(this.targetBackdrop, "width", elementRef.element.nativeElement.offsetWidth + 'px');
        this.renderer.appendChild(this.backdropMiddleContent, this.targetBackdrop);

        this.rightBackdrop = this.renderer.createElement('div');
        this.renderer.addClass(this.rightBackdrop, "joyride-backdrop");
        this.renderer.addClass(this.rightBackdrop, "backdrop-right");
        this.renderer.setStyle(this.rightBackdrop, "width", "100%");
        this.renderer.setStyle(this.rightBackdrop, "background-color", `rgba(${this.optionsService.getBackdropColor()}, 0.7)`);
        this.renderer.appendChild(this.backdropMiddleContent, this.rightBackdrop);

        this.backdropBottom = this.renderer.createElement('div');
        this.renderer.addClass(this.backdropBottom, "joyride-backdrop");
        this.renderer.addClass(this.backdropBottom, "backdrop-bottom");
        this.renderer.setStyle(this.backdropBottom, "width", "100%");
        this.renderer.setStyle(this.backdropBottom, "height", "100%");
        this.renderer.setStyle(this.backdropBottom, "background-color", `rgba(${this.optionsService.getBackdropColor()}, 0.7)`);
        this.renderer.appendChild(this.backdropContent, this.backdropBottom);

    }
    
    hide() {
        this.removeBackdrop();
        this.elementRef = undefined;
    }

    redrawTarget(targetViewContainer: ViewContainerRef) {
        this.targetAbsoluteLeft = this.documentService.getElementAbsoluteLeft(targetViewContainer.element);
        this.targetAbsoluteTop = this.documentService.getElementAbsoluteTop(targetViewContainer.element);
        this.handleVerticalScroll();
        this.handleHorizontalScroll();
    }

    redraw(scroll: Scroll) {
        if (this.lastYScroll !== scroll.scrollY) {
            this.lastYScroll = scroll.scrollY;
            if (this.elementRef) {
                this.handleVerticalScroll();
            }

        }
        if (this.lastXScroll !== scroll.scrollX) {
            this.lastXScroll = scroll.scrollX;
            if (this.elementRef) {
                this.handleHorizontalScroll();
            }
        }
    }

    private handleHorizontalScroll() {
    let newBackdropLeftWidth = this.targetAbsoluteLeft - this.lastXScroll;
    if (newBackdropLeftWidth >= 0) {
        this.renderer.setStyle(this.leftBackdrop, "width", newBackdropLeftWidth + 'px');
        this.renderer.setStyle(this.targetBackdrop, "width", this.elementRef.element.nativeElement.offsetWidth + 'px')
    }
    else {
        this.handleTargetPartialWidth(newBackdropLeftWidth);
    }
}

    private handleTargetPartialWidth(newBackdropLeftWidth: number) {
    this.renderer.setStyle(this.leftBackdrop, "width", 0 + 'px');
    let visibleTargetWidth = this.elementRef.element.nativeElement.offsetWidth + newBackdropLeftWidth;
    if (visibleTargetWidth >= 0) {
        this.renderer.setStyle(this.targetBackdrop, "width", visibleTargetWidth + 'px');

    } else {
        this.renderer.setStyle(this.targetBackdrop, "width", 0 + 'px');
    }
}

    private handleVerticalScroll() {
    let newBackdropTopHeight = this.targetAbsoluteTop - this.lastYScroll;
    if (newBackdropTopHeight >= 0) {
        this.renderer.setStyle(this.backdropTop, "height", newBackdropTopHeight + 'px');
        this.renderer.setStyle(this.backdropMiddleContainer, "height", this.elementRef.element.nativeElement.offsetHeight + 'px')
    }
    else {
        this.handleTargetPartialHeight(newBackdropTopHeight);
    }
}

    private handleTargetPartialHeight(newBackdropTopHeight: number) {
    this.renderer.setStyle(this.backdropTop, "height", 0 + 'px');
    let visibleTargetHeight = this.elementRef.element.nativeElement.offsetHeight + newBackdropTopHeight;
    if (visibleTargetHeight >= 0) {
        this.renderer.setStyle(this.backdropMiddleContainer, "height", visibleTargetHeight + 'px');

    } else {
        this.renderer.setStyle(this.backdropMiddleContainer, "height", 0 + 'px');
    }
}

    private removeBackdrop() {
    this.renderer.removeChild(document.body, this.backdropContainer);
}
}
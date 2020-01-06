import { TestBed, async, tick } from '@angular/core/testing';
import { EventListenerService } from './event-listener.service';
import { RendererFactory2 } from '@angular/core';
import { DomRefService } from './dom.service';
import { DomRefServiceFake } from '../test/fake/dom-fake.service';

describe('EventListenerService', () => {
    let eventListenerService: EventListenerService;
    let domRefService: DomRefServiceFake;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [EventListenerService, { provide: DomRefService, useClass: DomRefServiceFake }]
        });
    });

    beforeEach(() => {
        eventListenerService = TestBed.get(EventListenerService);
        domRefService = TestBed.get(DomRefService);
        domRefService.getNativeWindow.and.returnValue(window);
    });

    describe('startListeningScrollEvents()', () => {
        it('scrollEvent should emit when the document scrolls with next scrollTo', async(() => {
            let scrollEvent;
            eventListenerService.scrollEvent.subscribe(scrollEvt => {
                scrollEvent = scrollEvt;
            });

            eventListenerService.startListeningScrollEvents();
            let resEvt = window.document.createEvent('UIEvents');
            resEvt.initUIEvent('scroll', true, false, window, 0);
            document.body.dispatchEvent(resEvt);

            expect(scrollEvent).toEqual({ scrollX: 0, scrollY: 0 });
        }));

        it('scrollEvent should NOT emit if we are not listening', async(() => {
            let scrollEvent = null;
            eventListenerService.scrollEvent.subscribe(scrollEvt => {
                scrollEvent = scrollEvt;
            });

            let resEvt = window.document.createEvent('UIEvents');
            resEvt.initUIEvent('scroll', true, false, window, 0);
            document.body.dispatchEvent(resEvt);

            expect(scrollEvent).toEqual(null);
        }));
    });
    describe('startListeningResizeEvents', () => {
        it('scrollEvent should emit when the document scrolls with next scrollTo', async(() => {
            let resizeEvent;
            eventListenerService.resizeEvent.subscribe(resizeEvt => {
                resizeEvent = resizeEvt;
            });

            eventListenerService.startListeningResizeEvents();

            let resEvt = window.document.createEvent('UIEvents');
            resEvt.initUIEvent('resize', true, false, window, 0);
            window.dispatchEvent(resEvt);

            expect(resizeEvent).toEqual(resEvt);
        }));

        it('scrollEvent should NOT emit when we are not listening', async(() => {
            let resizeEvent = null;
            eventListenerService.resizeEvent.subscribe(resizeEvt => {
                resizeEvent = resizeEvt;
            });

            let resEvt = window.document.createEvent('UIEvents');
            resEvt.initUIEvent('resize', true, false, window, 0);
            window.dispatchEvent(resEvt);

            expect(resizeEvent).toEqual(null);
        }));
    });
    describe('stopListeningScrollEvents', () => {
        it('should stop to emit scroll events after its called', done => {
            let scrollEvents = [];
            eventListenerService.scrollEvent.subscribe(scrollEvt => {
                scrollEvents.push(scrollEvt);
                done();
            });

            eventListenerService.startListeningScrollEvents();
            let resEvt = window.document.createEvent('UIEvents');
            resEvt.initUIEvent('scroll', true, false, window, 0);

            document.body.dispatchEvent(resEvt);
            document.body.dispatchEvent(resEvt);

            eventListenerService.stopListeningScrollEvents();

            window.dispatchEvent(resEvt);

            expect(scrollEvents.length).toEqual(2);
        });
    });
    describe('stopListeningResizeEvents', () => {
        it('scrollEvent should NOT emit when we are not listening', done => {
            let resizeEvents = [];
            eventListenerService.resizeEvent.subscribe(resizeEvt => {
                resizeEvents.push(resizeEvt);
                done();
            });

            eventListenerService.startListeningResizeEvents();

            let resEvt = window.document.createEvent('UIEvents');
            resEvt.initUIEvent('resize', true, false, window, 0);

            window.dispatchEvent(resEvt);
            window.dispatchEvent(resEvt);

            eventListenerService.stopListeningResizeEvents();

            window.dispatchEvent(resEvt);

            expect(resizeEvents.length).toEqual(2);
        });
    });
});

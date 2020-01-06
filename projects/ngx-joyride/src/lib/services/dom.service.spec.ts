import { TestBed } from '@angular/core/testing';
import { DomRefService } from './dom.service';
import { PLATFORM_ID } from '@angular/core';

describe('DomRefService', () => {
    let platformId = '';
    let domService: DomRefService;
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [DomRefService, { provide: PLATFORM_ID, useValue: platformId }]
        });
    });

    beforeEach(() => {
        domService = TestBed.get(DomRefService);
    });

    describe('getNativeWindow()', () => {
        it(`should return the real window if this.platformId is 'browser'`, () => {
            domService = new DomRefService('browser');
            expect(domService.getNativeWindow()).toEqual(window);
        });
        it(`should return the fake window if this.platformId is 'server'`, () => {
            domService = new DomRefService('server');
            expect(domService.getNativeWindow()).toEqual(<Window>{ document: { body: {}, documentElement: {} }, navigator: {} });
        });
    });
    describe('getNativeDocument()', () => {
        it(`should return the real document if this.platformId is 'browser'`, () => {
            domService = new DomRefService('browser');
            expect(domService.getNativeDocument()).toEqual(document);
        });
        it(`should return the fake document if this.platformId is 'server'`, () => {
            domService = new DomRefService('server');
            expect(domService.getNativeDocument()).toEqual(<Document>{ body: {}, documentElement: {} });
        });
    });
});

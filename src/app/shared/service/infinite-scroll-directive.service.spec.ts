import { InfiniteScrollDirective } from './infinite-scroll-directive.service';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';
import { By } from '@angular/platform-browser';

@Component({
  imports: [InfiniteScrollDirective],
  template: `<div appInfiniteScroll></div>`,
})
class TestHostComponent {}

describe('InfiniteScrollDirective', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let mockIntersectionObserver: any;

  beforeEach(() => {
    mockIntersectionObserver = {
      observe: jasmine.createSpy('observe'),
      disconnect: jasmine.createSpy('disconnect'),
      callback: null,
    };

    (window as any).IntersectionObserver = function (
      callback: IntersectionObserverCallback
    ) {
      mockIntersectionObserver.callback = callback;
      return mockIntersectionObserver;
    };

    TestBed.configureTestingModule({
      imports: [TestHostComponent],
    });

    fixture = TestBed.createComponent(TestHostComponent);
    fixture.detectChanges();
  });

  it('should create an instance of the directive', () => {
    const directiveEl = fixture.debugElement.query(
      By.directive(InfiniteScrollDirective)
    );
    expect(directiveEl).toBeTruthy();
  });

  it('should emit scrolled event when element is intersected', () => {
    const directiveEl = fixture.debugElement.query(
      By.directive(InfiniteScrollDirective)
    );
    const directiveInstance = directiveEl.injector.get(InfiniteScrollDirective);
    spyOn(directiveInstance.scrolled, 'emit');
    mockIntersectionObserver.callback([
      { isIntersecting: true } as IntersectionObserverEntry,
    ]);
    expect(directiveInstance.scrolled.emit).toHaveBeenCalled();
  });

  it('should not emit scrolled event when element is not intersected', () => {
    const directiveEl = fixture.debugElement.query(
      By.directive(InfiniteScrollDirective)
    );
    const directiveInstance = directiveEl.injector.get(InfiniteScrollDirective);
    spyOn(directiveInstance.scrolled, 'emit');

    mockIntersectionObserver.callback([
      { isIntersecting: false } as IntersectionObserverEntry,
    ]);

    expect(directiveInstance.scrolled.emit).not.toHaveBeenCalled();
  });

  it('should disconnect observer on destroy', () => {
    const directiveEl = fixture.debugElement.query(
      By.directive(InfiniteScrollDirective)
    );
    const directiveInstance = directiveEl.injector.get(InfiniteScrollDirective);
    directiveInstance.ngOnDestroy();

    expect(mockIntersectionObserver.disconnect).toHaveBeenCalled();
  });
});

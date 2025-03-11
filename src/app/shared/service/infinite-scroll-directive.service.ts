import {
  Directive,
  ElementRef,
  EventEmitter,
  Output,
  OnDestroy,
  AfterViewInit,
  inject,
} from '@angular/core';

@Directive({
  selector: '[appInfiniteScroll]',
})
export class InfiniteScrollDirective implements AfterViewInit, OnDestroy {
  @Output() scrolled = new EventEmitter<void>();
  private el: ElementRef = inject(ElementRef);
  private observer: IntersectionObserver | null = null;
  private threshold = 0.1;

  ngAfterViewInit(): void {
    this.setupObserver();
  }

  private setupObserver(): void {
    this.observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          this.scrolled.emit();
        }
      },
      {
        root: null,
        rootMargin: '0px',
        threshold: this.threshold,
      }
    );
    this.observer.observe(this.el.nativeElement);
  }

  ngOnDestroy(): void {
    if (this.observer) {
      this.observer.disconnect();
    }
  }
}

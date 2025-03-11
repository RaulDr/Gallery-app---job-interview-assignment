import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PhotoGridComponent } from './photo-grid.component';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Photo } from '../../shared/models/photo.model';
import { By } from '@angular/platform-browser';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { PhotoCardComponent } from '../photo-card/photo-card.component';
import { Component, ViewChild } from '@angular/core';
import { of } from 'rxjs';

@Component({
  template: `
    <ng-template #bottomTemplate></ng-template>
    <app-photo-grid
      [photos]="photos"
      [bottomOfGridTemplate]="bottomTemplate"
    ></app-photo-grid>
  `,
  imports: [PhotoGridComponent],
})
class TestHostComponent {
  @ViewChild(PhotoGridComponent) photoGridComponent!: PhotoGridComponent;
  photos: Photo[] = [
    { id: '1', url: 'https://picsum.photos/id/1/400/300' },
    { id: '2', url: 'https://picsum.photos/id/2/400/300' },
  ];
}

describe('PhotoGridComponent', () => {
  let hostComponent: TestHostComponent;
  let fixture: ComponentFixture<TestHostComponent>;
  let breakpointObserver: jasmine.SpyObj<BreakpointObserver>;

  beforeEach(async () => {
    const breakpointObserverSpy = jasmine.createSpyObj('BreakpointObserver', ['observe', 'isMatched']);
    breakpointObserverSpy.observe.and.returnValue(of({ matches: true }));

    await TestBed.configureTestingModule({
      imports: [MatGridListModule, MatProgressSpinnerModule, TestHostComponent],
      providers: [
        { provide: BreakpointObserver, useValue: breakpointObserverSpy },
      ],
    }).compileComponents();

    breakpointObserver = TestBed.inject(BreakpointObserver) as jasmine.SpyObj<BreakpointObserver>;
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TestHostComponent);
    hostComponent = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(hostComponent.photoGridComponent).toBeTruthy();
  });

  it('should render the correct number of photos', () => {
    const photoCards = fixture.debugElement.queryAll(By.directive(PhotoCardComponent));
    expect(photoCards.length).toBe(2);
  });

  it('should emit onPhotoClickAction when a photo is clicked', () => {
    spyOn(hostComponent.photoGridComponent.onPhotoClickAction, 'emit');

    const photoTile = fixture.debugElement.query(By.css('mat-grid-tile'));
    photoTile.triggerEventHandler('click', null);

    expect(hostComponent.photoGridComponent.onPhotoClickAction.emit).toHaveBeenCalledWith(hostComponent.photos[0]);
  });

  it('should set columns based on breakpoints', () => {
    breakpointObserver.isMatched.and.callFake((query: string) => {
      return query === Breakpoints.Handset;
    });

    hostComponent.photoGridComponent.ngOnInit();
    fixture.detectChanges();

    expect(hostComponent.photoGridComponent.columns()).toBe(1);
    breakpointObserver.isMatched.and.callFake((query: string) => {
      return query === Breakpoints.Tablet;
    });

    hostComponent.photoGridComponent.ngOnInit();
    fixture.detectChanges();

    expect(hostComponent.photoGridComponent.columns()).toBe(2);
    breakpointObserver.isMatched.and.callFake((query: string) => {
      return query === Breakpoints.Web;
    });

    hostComponent.photoGridComponent.ngOnInit();
    fixture.detectChanges();

    expect(hostComponent.photoGridComponent.columns()).toBe(3);
  });
});
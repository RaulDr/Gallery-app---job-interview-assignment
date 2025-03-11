import { ChangeDetectorRef, DebugElement } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { ComponentFixture } from '@angular/core/testing';
import { PhotoCardComponent } from './photo-card.component';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { By } from '@angular/platform-browser';
import { Photo } from 'src/app/shared/models/photo.model';

describe('PhotoCardComponent', () => {
  let component: PhotoCardComponent;
  let fixture: ComponentFixture<PhotoCardComponent>;
  let changeDetectorRef: ChangeDetectorRef;
  let photo: Photo;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [],
      imports: [MatCardModule, MatButtonModule, PhotoCardComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PhotoCardComponent);
    component = fixture.componentInstance;
    photo = { id: '1', url: 'https://picsum.photos/id/1/400/300' };
    component.photo = photo;
    changeDetectorRef = fixture.debugElement.injector.get(ChangeDetectorRef);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display the photo', () => {
    const transformedUrl = 'https://picsum.photos/id/1/800/600';
    const imgElement: HTMLImageElement = fixture.debugElement.query(By.css('img')).nativeElement;
    expect(imgElement.src).toContain(transformedUrl);
  });

  it('should not display remove button if showRemoveButton is false', () => {
    component.showRemoveButton = false;
    fixture.detectChanges();

    const button = fixture.debugElement.query(By.css('button'));
    expect(button).toBeNull();
  });

  it('should display placeholder image if photo is not provided', () => {
    (component as any).photo = null;
    changeDetectorRef.markForCheck();
    fixture.detectChanges();

    const imgElement: HTMLImageElement = fixture.debugElement.query(By.css('.placeholder-card img')).nativeElement;
    expect(imgElement.src).toContain(component.notFoundPhotoUrl);
  });
});
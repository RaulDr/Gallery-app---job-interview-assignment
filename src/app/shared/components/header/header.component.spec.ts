import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
} from '@angular/core/testing';
import { Router, provideRouter } from '@angular/router';
import { HeaderComponent } from './header.component';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';

import { ROUTES } from '../../utils/routes.constants';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;
  let router: Router;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      imports: [HeaderComponent, MatToolbarModule, MatButtonModule],
      providers: [
        provideRouter([
          { path: ROUTES.HOME, component: HeaderComponent },
          { path: ROUTES.FAVORITES, component: HeaderComponent },
        ]),
      ],
    }).compileComponents();

    router = TestBed.inject(Router);
    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should highlight "Photos" button when on the home route', fakeAsync(() => {
    router.navigate([`/${ROUTES.HOME}`]);
    tick();
    fixture.detectChanges();

    expect(component.isPhotosActive()).toBe(true);
    expect(component.isFavoritesActive()).toBe(false);
  }));

  it('should highlight "Favorites" button when on the favorites route', fakeAsync(() => {
    router.navigate([`/${ROUTES.FAVORITES}`]);
    tick();
    fixture.detectChanges();

    expect(component.isFavoritesActive()).toBe(true);
    expect(component.isPhotosActive()).toBe(false);
  }));

  it('should navigate to the correct route when buttons are clicked', () => {
    spyOn(router, 'navigate');

    component.navigate(`/${ROUTES.HOME}`);
    expect(router.navigate).toHaveBeenCalledWith([`/${ROUTES.HOME}`]);

    component.navigate(`/${ROUTES.FAVORITES}`);
    expect(router.navigate).toHaveBeenCalledWith([`/${ROUTES.FAVORITES}`]);
  });
});

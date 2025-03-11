import {
  Component,
  DestroyRef,
  inject,
  OnInit,
} from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { signal, computed, Signal } from '@angular/core';
import { filter } from 'rxjs/operators';
import { ROUTES, BUTTONS_TEXT } from '../../utils/routes.constants';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-header',
  imports: [MatToolbarModule, MatButtonModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  public readonly ROUTES = ROUTES;
  public readonly BUTTONS_TEXT = BUTTONS_TEXT;
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);
  private readonly currentRoute = signal(this.router.url);
  readonly isPhotosActive: Signal<boolean> = computed(
    () => this.currentRoute() === `/${ROUTES.HOME}`
  );
  readonly isFavoritesActive: Signal<boolean> = computed(
    () => this.currentRoute() === `/${ROUTES.FAVORITES}`
  );

  ngOnInit() {
    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(() => {
        this.currentRoute.set(this.router.url);
      });
  }

  navigate(route: string): void {
    this.router.navigate([route]);
  }
}

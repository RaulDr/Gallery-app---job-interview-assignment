import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListViewComponent } from './components/list-view/list-view.component';
import { ROUTES } from './shared/utils/routes.constants';

const routes: Routes = [
  { path: ROUTES.HOME, component: ListViewComponent },
  {
    path: ROUTES.FAVORITES,
    loadComponent: () =>
      import('./components/favorites/favorites.component').then(
        (m) => m.FavoritesComponent
      ),
  },
  {
    path: `${ROUTES.DETAIL}/:id`,
    loadComponent: () =>
      import('./components/detail-view/detail-view.component').then(
        (m) => m.DetailViewComponent
      ),
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}

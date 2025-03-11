import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  EventEmitter,
  inject,
  Input,
  OnInit,
  Output,
  signal,
  TemplateRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Photo } from '../../shared/models/photo.model';
import { PhotoCardComponent } from '../photo-card/photo-card.component';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { distinctUntilChanged } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-photo-grid',
  imports: [
    CommonModule,
    MatGridListModule,
    MatProgressSpinnerModule,
    PhotoCardComponent,
  ],
  templateUrl: './photo-grid.component.html',
  styleUrls: ['./photo-grid.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PhotoGridComponent implements OnInit {
  @Input() photos: Photo[] = [];
  @Input() bottomOfGridTemplate!: TemplateRef<any>;
  readonly columns = signal<number>(0);
  @Output() onPhotoClickAction = new EventEmitter<Photo>();
  private readonly breakpointObserver = inject(BreakpointObserver);
  private readonly destroyRef = inject(DestroyRef);
  private readonly breakpoint$ = this.breakpointObserver
    .observe([Breakpoints.Handset, Breakpoints.Tablet, Breakpoints.Web])
    .pipe(distinctUntilChanged(), takeUntilDestroyed(this.destroyRef));

  ngOnInit() {
    this.breakpoint$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.breakpointChanged());
  }

  private breakpointChanged() {
    if (this.breakpointObserver.isMatched(Breakpoints.Handset)) {
      this.columns.set(1);
    } else if (this.breakpointObserver.isMatched(Breakpoints.Tablet)) {
      this.columns.set(2);
    } else {
      this.columns.set(3);
    }
  }
}

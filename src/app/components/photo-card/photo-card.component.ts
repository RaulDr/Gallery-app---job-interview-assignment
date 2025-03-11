import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { Photo } from '../../shared/models/photo.model';
import { environment } from '../../../environments/environment';
import { ImageSizePipe } from 'src/app/shared/pipe/image-size.pipe';

@Component({
  selector: 'app-photo-card',
  imports: [CommonModule, MatCardModule, MatButtonModule, ImageSizePipe],
  templateUrl: './photo-card.component.html',
  styleUrls: ['./photo-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PhotoCardComponent {
  @Input() photo!: Photo;
  @Input() showRemoveButton: boolean = false;
  @Output() remove = new EventEmitter<string>();
  notFoundPhotoUrl = environment.notFoundPhotoUrl;

  onRemove(): void {
    this.remove.emit(this.photo.id);
  }
}

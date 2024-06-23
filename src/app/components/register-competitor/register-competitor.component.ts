import { Component, inject } from '@angular/core';
import { ImagesService } from '../../services/images.service';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  selector: 'app-register-competitor',
  templateUrl: './register-competitor.component.html',
  styleUrls: [],
  imports: [CommonModule],
})
export class RegisterCompetitorComponent {
  uploadProgress$!: Observable<number>;

  private imagesService: ImagesService = inject(ImagesService);

  onFileSelected(event: any) {
    const archivoSeleccionado: File = event.target.files[0];
    console.log('archivoSelecionado:', archivoSeleccionado);
    this.uploadProgress$ = this.imagesService.uploadFile(archivoSeleccionado);
  }
}

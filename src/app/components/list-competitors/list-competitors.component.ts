import { Component, OnInit, inject } from '@angular/core';
import { CompetitorsService } from '../../services/competitors.service';
import { CompetitorResponse } from '../../interfaces/req-response';
import { ImagesService } from '../../services/images.service';
import Swal from 'sweetalert2';
import { NgFor } from '@angular/common';

@Component({
  selector: 'app-list-competitors',
  standalone: true,
  templateUrl: './list-competitors.component.html',
  styles: [],
  imports: [NgFor],
})
export default class ListCompetitorsComponent implements OnInit {
  private competitorsService = inject(CompetitorsService);
  competitors: CompetitorResponse[] = [];
  private imagesService: ImagesService = inject(ImagesService);
  private selectedTestFile: File | null = null;

  ngOnInit() {
    this.competitorsService.getAllCompetitors().subscribe(
      (data) => {
        this.competitors = data;
      },
      (error) => {
        console.error('Error fetching competitors:', error);
      }
    );
  }

  //Envia el archivo y devuelve la URL y alerta
  uploadFile(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      this.imagesService.uploadFile(file).subscribe(
        (url) => {
          Swal.fire({
            icon: 'success',
            title: 'El archivo ha subido correctamente',
            text: `URL: ${file.name}`,
          });
          resolve(url);
        },
        (error) => {
          Swal.fire({
            icon: 'error',
            title: 'Error al cargar el archivo',
            text: error.message,
          });
          reject(error);
        }
      );
    });
  }

  onFileSelected(event: any, type: string, competitorNum: string) {
    console.log(competitorNum);
    const file: File = event.target.files[0];
    if (file) {
      this.imagesService.compressImage(file).then(async (compressedFile) => {
        if (type === 'alcoholemia' || type === 'mecanico') {
          this.selectedTestFile = compressedFile;
          try {
            if (this.selectedTestFile) {
              const imageUrl = await this.uploadFile(this.selectedTestFile);
              console.log(`URL de imagen ${type}: `, imageUrl);
              if (type === 'alcoholemia') {
                this.competitorsService
                  .postAlcoholTestImageUrl(competitorNum, imageUrl)
                  .subscribe(
                    (response) => {
                      Swal.fire({
                        icon: 'success',
                        title: 'Imagen de alcoholemia subida exitosamente',
                        text: 'La imagen ha sido registrada exitosamente.',
                      });
                    },
                    (error) => {
                      const errorMessage =
                        error?.error?.error || 'Un error desconocido ocurrió.';
                      Swal.fire({
                        icon: 'error',
                        title: 'Error al registrar',
                        text: errorMessage,
                      });
                    }
                  );
              } else if (type === 'mecanico') {
                this.competitorsService
                  .postRTMTestImageUrl(competitorNum, imageUrl)
                  .subscribe(
                    (response) => {
                      Swal.fire({
                        icon: 'success',
                        title: 'Imagen de RTM subida exitosamente',
                        text: 'La imagen ha sido registrada exitosamente.',
                      });
                    },
                    (error) => {
                      const errorMessage =
                        error?.error?.error || 'Un error desconocido ocurrió.';
                      Swal.fire({
                        icon: 'error',
                        title: 'Error al registrar',
                        text: errorMessage,
                      });
                    }
                  );
              }
            }
          } catch (error) {
            if (error instanceof Error) {
              Swal.fire({
                icon: 'error',
                title: 'Error al cargar el archivo',
                text: error.message,
              });
            } else {
              Swal.fire({
                icon: 'error',
                title: 'Error al cargar el archivo',
                text: 'Un error desconocido ocurrió.',
              });
            }
          }
        }
      });
    }
  }

  public trackCompetitor(
    index: number,
    competitor: CompetitorResponse
  ): string {
    return competitor.competitor_num;
  }
}

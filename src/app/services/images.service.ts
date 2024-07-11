import { Injectable } from '@angular/core';
import { Storage, ref, uploadBytesResumable } from '@angular/fire/storage';
import { getDownloadURL } from 'firebase/storage';
import { Observable, from } from 'rxjs';
import { NgxImageCompressService } from 'ngx-image-compress';

@Injectable({
  providedIn: 'root',
})
export class ImagesService {
  constructor(
    private storage: Storage,
    private imageCompress: NgxImageCompressService
  ) {}

  uploadFile(file: File): Observable<string> {
    const filePath = `imagenes/${file.name}`;
    const fileRef = ref(this.storage, filePath);
    const uploadTask = uploadBytesResumable(fileRef, file);

    return new Observable<string>((observer) => {
      uploadTask.on(
        'state_changed',
        (snapshot) => {
          // Puedes manejar el progreso aquí si lo deseas
        },
        (error) => {
          observer.error(error);
        },
        async () => {
          const downloadURL = await getDownloadURL(fileRef);
          observer.next(downloadURL);
          observer.complete();
        }
      );
    });
  }

  compressImage(file: File): Promise<File> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const image = reader.result as string;
        this.imageCompress.compressFile(image, -1, 30, 30).then(
          (result) => {
            const blob = this.dataURLtoBlob(result);
            const compressedFile = new File([blob], file.name, {
              type: file.type,
            });
            resolve(compressedFile);
          },
          (error) => {
            reject(error);
          }
        );
      };
    });
  }

  dataURLtoBlob(dataurl: string): Blob {
    // Separamos la dataUrl en dos partes
    const arr = dataurl.split(',');
    const mimeMatch = arr[0].match(/:(.*?);/);
    if (!mimeMatch) {
      throw new Error('No se pudo determinar el tipo MIME de la imagen.');
    }
    const mime = mimeMatch[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], { type: mime });
  }
}

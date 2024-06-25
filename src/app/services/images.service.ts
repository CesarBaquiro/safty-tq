import { Injectable } from '@angular/core';
import { Storage, ref, uploadBytesResumable } from '@angular/fire/storage';
import { getDownloadURL } from 'firebase/storage';
import { Observable, from } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ImagesService {
  constructor(private storage: Storage) {}

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
}

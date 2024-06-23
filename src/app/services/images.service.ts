import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import {
  Storage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from '@angular/fire/storage';

@Injectable({
  providedIn: 'root',
})
export class ImagesService {
  private storage: Storage = inject(Storage);

  uploadFile(file: File): Observable<number> {
    return new Observable((observer) => {
      const filePath = `imagenes/${file.name}`;
      const fileRef = ref(this.storage, filePath);
      const uploadTask = uploadBytesResumable(fileRef, file);

      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          observer.next(progress);
        },
        (error) => {
          observer.error(error);
        },
        async () => {
          const url = await getDownloadURL(fileRef);
          observer.complete();
          console.log('Url del archivo: ', url);
        }
      );
    });
  }
}

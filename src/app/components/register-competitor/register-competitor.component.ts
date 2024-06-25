import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ImagesService } from '../../services/images.service';
import { Observable } from 'rxjs';

@Component({
  standalone: true,
  selector: 'app-register-competitor',
  templateUrl: './register-competitor.component.html',
  styleUrls: [],
  imports: [CommonModule, ReactiveFormsModule],
})
export class RegisterCompetitorComponent {
  form: FormGroup;
  uploadProgress$!: Observable<number>;
  downloadURL$!: Observable<string>;
  bloodTypes: string[] = ['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-'];

  private fb: FormBuilder = inject(FormBuilder);
  private imagesService: ImagesService = inject(ImagesService);
  private selectedFile: File | null = null;

  constructor() {
    this.form = this.fb.group({
      competitorNum: [
        '',
        [Validators.required, Validators.minLength(3), Validators.maxLength(3)],
      ],
      name: ['', [Validators.required, Validators.minLength(3)]],
      lastname: ['', [Validators.required, Validators.minLength(3)]],
      bloodType: ['', Validators.required],
      eps: ['', [Validators.required, Validators.minLength(3)]],
      //La imagen no es requerida obligatoriamente
      image: [null],
    });
  }

  get competitorNum() {
    return this.form.get('competitorNum');
  }

  get name() {
    return this.form.get('name');
  }

  get lastname() {
    return this.form.get('lastname');
  }

  get email() {
    return this.form.get('email');
  }

  get bloodType() {
    return this.form.get('bloodType');
  }

  get eps() {
    return this.form.get('eps');
  }

  get image() {
    return this.form.get('image');
  }

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      this.image?.setValue(file.name);
    }
  }

  uploadFile(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      this.imagesService.uploadFile(file).subscribe(
        (url) => {
          console.log('File uploaded successfully. URL:', url);
          resolve(url);
        },
        (error) => {
          console.error('Error uploading file:', error);
          reject(error);
        }
      );
    });
  }

  async onSubmit() {
    if (this.form.valid) {
      try {
        if (this.selectedFile) {
          const url = await this.uploadFile(this.selectedFile);
          this.form.patchValue({ image: url });
        }
        console.log('Form Submitted!', this.form.value);
        // Aquí puedes manejar el envío del formulario con la URL de la imagen
      } catch (error) {
        console.error('Error uploading file:', error);
      }
    } else {
      console.log('Form is invalid');
    }
  }
}

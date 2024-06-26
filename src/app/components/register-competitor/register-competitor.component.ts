import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
  FormArray,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ImagesService } from '../../services/images.service';
import { Observable } from 'rxjs';
import { CompetitorsService } from '../../services/competitors.service';

@Component({
  standalone: true,
  selector: 'app-register-competitor',
  templateUrl: './register-competitor.component.html',
  styleUrls: [],
  imports: [CommonModule, ReactiveFormsModule],
})
export class RegisterCompetitorComponent {
  formCompetitor: FormGroup;
  formVehicle: FormGroup;

  showForm: boolean = false;
  competitor = {
    allergies: [],
    //    contacts: [{ reference: '', info: '' }],
    vehicle: {},
  };

  uploadProgress$!: Observable<number>;
  downloadURL$!: Observable<string>;
  bloodTypes: string[] = ['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-'];
  allRisk: boolean = false;
  secondContactInput: boolean = false;
  private fb: FormBuilder = inject(FormBuilder);
  private imagesService: ImagesService = inject(ImagesService);
  private competitorsService: CompetitorsService = inject(CompetitorsService);
  //private selectedFile: File | null = null;
  private selectedCompetitorFile: File | null = null;
  private selectedVehicleFile: File | null = null;

  constructor() {
    this.formCompetitor = this.fb.group({
      competitorNum: [
        '',
        [Validators.required, Validators.minLength(3), Validators.maxLength(3)],
      ],
      name: ['', [Validators.required, Validators.minLength(3)]],
      lastname: ['', [Validators.required, Validators.minLength(3)]],
      rh: ['', Validators.required],
      eps: ['', [Validators.required, Validators.minLength(3)]],
      contacts: this.fb.array([this.createContact()]), // Inicializamos el formulario con un contacto obligatorio
      allergies: this.fb.array([this.createAllergie()]),
      //La imagen no es requerida obligatoriamente
      competitorImage: [null],
    });

    this.formVehicle = this.fb.group({
      vehicleReference: ['', [Validators.required, Validators.minLength(3)]],
      plate: ['', [Validators.maxLength(6)]],
      numberPolicySoat: [],
      certificateNumberRTM: [],
      allRisk: this.allRisk,
      //La imagen no es requerida obligatoriamente
      vehicleImage: [null],
    });
  }

  // gets formulario del competidor

  get competitorNum() {
    return this.formCompetitor.get('competitorNum');
  }

  get name() {
    return this.formCompetitor.get('name');
  }

  get lastname() {
    return this.formCompetitor.get('lastname');
  }

  get email() {
    return this.formCompetitor.get('email');
  }

  get rh() {
    return this.formCompetitor.get('rh');
  }

  get eps() {
    return this.formCompetitor.get('eps');
  }

  get imageCompetitor() {
    return this.formCompetitor.get('imageCompetitor');
  }

  // gets formulario del vehiculo

  get vehicleReference() {
    return this.formVehicle.get('vehicleReference');
  }

  get plate() {
    return this.formVehicle.get('plate');
  }

  get numberPolicySoat() {
    return this.formVehicle.get('numberPolicySoat');
  }

  get certificateNumberRTM() {
    return this.formVehicle.get('certificateNumberRTM');
  }

  get imageVehicle() {
    return this.formVehicle.get('imageVehicle');
  }

  // gets formulario de contactos

  get contacts() {
    return this.formCompetitor.get('contacts') as FormArray;
  }

  get allergies() {
    return this.formCompetitor.get('allergies') as FormArray;
  }

  get contactControls() {
    return this.contacts.controls;
  }

  //Metodo para crear un contacto
  createContact(): FormGroup {
    return this.fb.group({
      reference: ['', [Validators.required, Validators.minLength(3)]],
      info: [
        '',
        [
          Validators.required,
          Validators.minLength(10),
          Validators.maxLength(10),
        ],
      ],
    });
  }

  addContact() {
    this.contacts.push(this.createContact());
  }

  removeContact(index: number) {
    if (this.contacts.length > 1) {
      this.contacts.removeAt(index);
    }
  }

  //Metodo para crear una alergia
  createAllergie(): FormGroup {
    return this.fb.group({
      info: [''],
    });
  }

  addAllergie() {
    this.allergies.push(this.createAllergie());
  }

  removeAllergie(index: number) {
    if (this.allergies.length > 1) {
      this.allergies.removeAt(index);
    }
  }

  get allergieControls() {
    return this.allergies.controls;
  }

  onFileSelected(event: any, type: string) {
    const file: File = event.target.files[0];
    if (file) {
      if (type === 'competitor') {
        this.selectedCompetitorFile = file;
        this.imageCompetitor?.setValue(file.name);
      } else if (type === 'vehicle') {
        this.selectedVehicleFile = file;
        this.imageVehicle?.setValue(file.name);
      }
    }
  }

  onAllRiskChange(event: any) {
    this.allRisk = event.target.value;
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
    if (this.formVehicle.valid) {
      //Actualizar el valor de allRisk
      this.formVehicle.patchValue({ allRisk: this.allRisk });
      try {
        if (this.selectedCompetitorFile) {
          const competitorUrl = await this.uploadFile(
            this.selectedCompetitorFile
          );
          this.formCompetitor.patchValue({ competitorImage: competitorUrl });
        }
        if (this.selectedVehicleFile) {
          const vehicleUrl = await this.uploadFile(this.selectedVehicleFile);
          this.formVehicle.patchValue({ vehicleImage: vehicleUrl });
        }

        this.competitor = this.formCompetitor.value;
        this.competitor.vehicle = this.formVehicle.value;

        console.log(this.competitor);
        // Aquí enviamos los datos del formulario
        this.competitorsService.postUserComplete(this.competitor).subscribe(
          (response) => {
            console.log('Usuario completo enviado:', response);
          },
          (error) => {
            console.error('Error al enviar usuario completo:', error);
          }
        );
      } catch (error) {
        console.error('Error uploading file:', error);
      }
    } else {
      console.log('Form is invalid');
    }
  }
}

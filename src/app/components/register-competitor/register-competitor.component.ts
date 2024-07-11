import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
  FormArray,
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ImagesService } from '../../services/images.service';
import {
  Observable,
  debounceTime,
  distinctUntilChanged,
  first,
  map,
  of,
  switchMap,
} from 'rxjs';
import { CompetitorsService } from '../../services/competitors.service';
import Swal from 'sweetalert2';
import { NgxImageCompressService } from 'ngx-image-compress';

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
    dataProcessingConsent: 0,
  };

  uploadProgress$!: Observable<number>;
  downloadURL$!: Observable<string>;
  bloodTypes: string[] = ['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-'];
  allRisk: number = 0;
  secondContactInput: boolean = false;
  dataProcessingAuthorizationValue: number = 0;
  private fb: FormBuilder = inject(FormBuilder);
  private imagesService: ImagesService = inject(ImagesService);
  private competitorsService: CompetitorsService = inject(CompetitorsService);
  //private selectedFile: File | null = null;
  private imageCompress: NgxImageCompressService = inject(
    NgxImageCompressService
  );
  private selectedCompetitorFile: File | null = null;
  private selectedVehicleFile: File | null = null;

  constructor() {
    this.formCompetitor = this.fb.group({
      competitorNum: [
        '',
        [Validators.required, Validators.minLength(3), Validators.maxLength(3)],
        [this.competitorNumValidator.bind(this)],
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
      contact_reference: ['', [Validators.required, Validators.minLength(3)]],
      contact_info: [
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

  // Modificar la informacion de contacto ingresada por el usuario
  modifyContactInfo(contact: FormGroup) {
    const contact_info = contact.get('contact_info')?.value;
    const modifiedInfo = `https://wa.me/+57${contact_info}`;
    contact.patchValue({ contact_info: modifiedInfo });
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
      this.imagesService.compressImage(file).then((compressedFile) => {
        if (type === 'competitor') {
          this.selectedCompetitorFile = compressedFile;
          // Actualiza el formulario con el nombre del archivo
        } else if (type === 'vehicle') {
          this.selectedVehicleFile = compressedFile;
          // Actualiza el formulario con el nombre del archivo
        }
      });
    }
  }

  //Metodo para cambiar el valor del radio allRisk
  onAllRiskChange(event: any) {
    // Casteamos el dato a un number para enviarlo a BD correctamente
    this.allRisk = Number(event.target.value);
  }

  //Metodo para cambiar el valor del check tratamiento de datos
  toggleValue() {
    this.dataProcessingAuthorizationValue =
      this.dataProcessingAuthorizationValue === 0 ? 1 : 0;
  }

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
  async onSubmit() {
    if (this.formVehicle.valid) {
      // Modificar la información de los contactos antes de enviar
      const contacts = this.formCompetitor.get('contacts') as FormArray;
      contacts.controls.forEach((contact) => {
        this.modifyContactInfo(contact as FormGroup);
      });

      // Actualizamos el valor allRisk
      this.formVehicle.patchValue({ allRisk: this.allRisk });

      // Asignar las URL de las imagenes de competidor y vehiculo
      try {
        if (this.selectedCompetitorFile) {
          const url = await this.uploadFile(this.selectedCompetitorFile);
          this.formCompetitor.patchValue({ competitorImage: url });
        }
        if (this.selectedVehicleFile) {
          const url = await this.uploadFile(this.selectedVehicleFile);
          this.formVehicle.patchValue({ vehicleImage: url });
        }

        this.competitor = {
          ...this.formCompetitor.value,
          vehicle: this.formVehicle.value,
          dataProcessingConsent: this.dataProcessingAuthorizationValue,
        };

        this.competitorsService.postUserComplete(this.competitor).subscribe(
          (response) => {
            Swal.fire({
              icon: 'success',
              title: 'Piloto y vehículo registrado.',
              text: 'La información ha sido registrada exitosamente.',
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
    } else {
      Swal.fire({
        icon: 'error',
        title: 'El formulario no es válido.',
        text: 'Por favor complete el formulario correctamente.',
      });
    }
  }

  // Validador asíncrono para comprobar si el número de competidor ya existe
  competitorNumValidator(
    control: AbstractControl
  ): Observable<ValidationErrors | null> {
    if (!control.value) {
      return of(null);
    }

    return control.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap((value) => {
        return this.competitorsService.numCompetitorExist(value);
      }),
      map((exists) => {
        return exists ? { competitorExists: true } : null;
      }),
      first()
    );
  }
}

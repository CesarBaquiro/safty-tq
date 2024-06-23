import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CompetitorsService } from '../../services/competitors.service';
import { Title } from '@angular/platform-browser';
import { catchError, switchMap } from 'rxjs/operators';
import {
  CompetitorResponse,
  VehicleResponse,
} from '../../interfaces/req-response';
import { CompetitorInfoComponent } from '../competitor-info/competitor-info.component';
import { VehicleInfoComponent } from '../vehicle-info/vehicle-info.component';
import { of } from 'rxjs';

@Component({
  selector: 'app-competitors',
  standalone: true,
  templateUrl: './competitors.component.html',
  styles: [],
  imports: [CompetitorInfoComponent, VehicleInfoComponent],
})
export default class CompetitorsComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private competitorsService = inject(CompetitorsService);
  private titleService = inject(Title);

  public competitor: CompetitorResponse | null = null;
  public vehicle: VehicleResponse | null = null;
  public errorMessage: string | null = null;

  ngOnInit() {
    this.route.params
      .pipe(
        switchMap(({ id }) => {
          this.titleService.setTitle(`Piloto ${id}`);
          return this.competitorsService.getUserByCompetitorNum(id).pipe(
            catchError((error) => {
              this.errorMessage =
                error.error.error ||
                'Se produjo un error desconocido al buscar el usuario';
              return of(null); // Retorna todo como un observable
            })
          );
        })
      )
      .subscribe((competitor) => {
        if (competitor) {
          this.competitor = competitor;
          // Actualiza el competidor en el servicio para que otros componentes lo vean
          this.competitorsService.setCompetitor(competitor);
          this.fetchVehicle(competitor.user_id); // Llama a la función para buscar el vehículo
        }
      });
  }

  fetchVehicle(userId: string) {
    this.competitorsService
      .getVehicleByUserId(userId)
      .pipe(
        catchError((error) => {
          this.errorMessage =
            error.error?.error ||
            'Se produjo un error desconocido al buscar el vehículo.';
          return of(null);
        })
      )
      .subscribe((vehicle) => {
        if (vehicle) {
          this.vehicle = vehicle;
          // Actualiza el vehiculo en el servicio para que otros componentes lo vean
          this.competitorsService.setVehicle(vehicle);
        } else {
          this.errorMessage =
            'Vehículo no encontrado para el usuario solicitado';
        }
      });
  }

  infoOption: number = 1;
  // Metodo para mostrar un componente
  changeOption(option: number) {
    this.infoOption = option;
  }

  // Metodo para aplicar la opacidad al componente oculto
  getOpacity(option: number): number {
    return this.infoOption === option ? 1 : 0.5;
  }
}

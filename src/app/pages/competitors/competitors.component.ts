import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CompetitorsService } from '../../services/competitors.service';
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

  public competitor: CompetitorResponse | null = null;
  public vehicle: VehicleResponse | null = null;
  public errorMessage: string | null = null;

  ngOnInit() {
    this.route.params
      .pipe(
        switchMap(({ id }) =>
          this.competitorsService.getUserByCompetitorNum(id).pipe(
            catchError((error) => {
              this.errorMessage =
                error.error.error || 'An unknown error occurred';
              return of(null); // Return a null observable to keep the stream alive
            })
          )
        )
      )
      .subscribe((competitor) => {
        if (competitor) {
          this.competitor = competitor;
          this.competitorsService.setCompetitor(competitor); // Actualiza el competidor en el servicio
          this.fetchVehicle(competitor.user_id);
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
            'An unknown error occurred while fetching vehicle';
          return of(null);
        })
      )
      .subscribe((vehicle) => {
        if (vehicle) {
          this.vehicle = vehicle;
          this.competitorsService.setVehicle(vehicle); // Actualiza el competidor en el servicio
        } else {
          this.errorMessage = 'Vehicle not found for the specified user';
        }
      });
  }

  infoOption: number = 1;

  changeOption(option: number) {
    this.infoOption = option;
  }

  getOpacity(option: number): number {
    return this.infoOption === option ? 1 : 0.5;
  }
}

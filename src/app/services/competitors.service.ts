import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, catchError, of } from 'rxjs';
import {
  CompetitorResponse,
  VehicleResponse,
} from '../interfaces/req-response';

@Injectable({
  providedIn: 'root',
})
export class CompetitorsService {
  private http = inject(HttpClient);

  private competitorSubject = new BehaviorSubject<CompetitorResponse | null>(
    null
  );
  public competitor$ = this.competitorSubject.asObservable();

  private vehicleSubject = new BehaviorSubject<VehicleResponse | null>(null);
  public vehicle$ = this.vehicleSubject.asObservable();

  getUserByCompetitorNum(competitorNum: string) {
    return this.http.get<CompetitorResponse>(
      `http://localhost:8000/api/usuarios/numeroCompetidor/${competitorNum}`
    );
  }

  getVehicleByUserId(userId: string) {
    return this.http.get<VehicleResponse>(
      `http://localhost:8000/api/vehiculos/${userId}`
    );
  }

  setCompetitor(competitor: CompetitorResponse | null) {
    this.competitorSubject.next(competitor);
  }

  setVehicle(vehicle: VehicleResponse | null) {
    this.vehicleSubject.next(vehicle);
  }
}

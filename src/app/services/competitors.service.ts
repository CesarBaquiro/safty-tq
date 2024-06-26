import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import {
  CompetitorResponse,
  VehicleResponse,
} from '../interfaces/req-response';

@Injectable({
  providedIn: 'root',
})
export class CompetitorsService {
  private http = inject(HttpClient);

  //Observables
  private competitorSubject = new BehaviorSubject<CompetitorResponse | null>(
    null
  );
  public competitor$ = this.competitorSubject.asObservable();

  private vehicleSubject = new BehaviorSubject<VehicleResponse | null>(null);
  public vehicle$ = this.vehicleSubject.asObservable();

  // Solicitud para taer el competidor por numero de competidor
  getUserByCompetitorNum(competitorNum: string) {
    return this.http.get<CompetitorResponse>(
      `http://localhost:8000/api/usuarios/numeroCompetidor/${competitorNum}`
    );
  }

  // Solicitud para taer el vehiculo por id de competidor
  getVehicleByUserId(userId: string) {
    return this.http.get<VehicleResponse>(
      `http://localhost:8000/api/vehiculos/${userId}`
    );
  }

  // Método para enviar datos completos de usuario
  postUserComplete(competitor: any): Observable<any> {
    return this.http.post<any>(
      'http://localhost:8000/api/staffcontrol/usuarioCompleto',
      competitor
    );
  }

  // Se guardan los datos en el competidor compartido
  setCompetitor(competitor: CompetitorResponse | null) {
    this.competitorSubject.next(competitor);
  }

  // Se guardan los datos en el vehiculo compartido
  setVehicle(vehicle: VehicleResponse | null) {
    this.vehicleSubject.next(vehicle);
  }
}

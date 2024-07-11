import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, Observable, map } from 'rxjs';
import {
  CompetitorResponse,
  TestResponse,
  VehicleResponse,
} from '../interfaces/req-response';

@Injectable({
  providedIn: 'root',
})
export class CompetitorsService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:8000/api/staffcontrol';

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

  // Solicitud para traer los registros de pruebas por número de competidor
  getTestingRecordsByCompetitorNum(competitorNum: string): Observable<any[]> {
    return this.http.get<any[]>(
      `http://localhost:8000/api/usuarios/numeroCompetidor/${competitorNum}/testing-records`
    );
  }

  // Get todos los competidores en bd
  getAllCompetitors(): Observable<CompetitorResponse[]> {
    return this.http.get<CompetitorResponse[]>(
      'http://localhost:8000/api/staffcontrol/usuarios'
    );
  }

  // Método para enviar datos completos de usuario
  postUserComplete(competitor: any): Observable<any> {
    return this.http.post<any>(
      'http://localhost:8000/api/staffcontrol/usuarioCompleto',
      competitor
    );
  }

  // Get todos los competidores en bd
  getAllTest(): Observable<TestResponse[]> {
    return this.http.get<TestResponse[]>(
      `${this.apiUrl}/usuarios/testing-records`
    );
  }

  // Método para enviar image_url de la prueba de alcoholemia
  postAlcoholTestImageUrl(
    competitorNum: string,
    imageUrl: string
  ): Observable<any> {
    const body = {
      competitorNum: competitorNum,
      test_image: imageUrl,
    };
    console.log(`RUTA POST:
      ${this.apiUrl}/registrar-test-alcoholemia`);
    console.log('Datos enviados en la solicitud POST:', body);
    return this.http.post<any>(
      `${this.apiUrl}/registrar-test-alcoholemia`,
      body
    );
  }

  // Método para enviar image_url de la prueba RTM
  postRTMTestImageUrl(
    competitorNum: string,
    imageUrl: string
  ): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/registrar-test-mecanico`, {
      competitorNum: competitorNum,
      image_url: imageUrl,
    });
  }

  // Se guardan los datos en el competidor compartido
  setCompetitor(competitor: CompetitorResponse | null) {
    this.competitorSubject.next(competitor);
  }

  // Se guardan los datos en el vehiculo compartido
  setVehicle(vehicle: VehicleResponse | null) {
    this.vehicleSubject.next(vehicle);
  }

  // Verificar si el número de competidor ya existe
  numCompetitorExist(competitorNum: string): Observable<boolean> {
    return this.http
      .get<{ res: boolean }>(
        `http://localhost:8000/api/validateRealTime/userExist/${competitorNum}`
      )
      .pipe(map((response) => response.res));
  }
}

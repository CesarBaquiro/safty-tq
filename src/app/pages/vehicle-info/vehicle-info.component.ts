import { Component, OnInit, inject } from '@angular/core';
import { CompetitorsService } from '../../services/competitors.service';
import { VehicleResponse } from '../../interfaces/req-response';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-vehicle-info',
  standalone: true,
  templateUrl: './vehicle-info.component.html',
  styles: [],
})
export class VehicleInfoComponent implements OnInit {
  private competitorsService = inject(CompetitorsService);
  public vehicle: VehicleResponse | null = null;
  private testingRecords: any[] = [];

  private competitorSubscription: Subscription | null = null;
  private vehicleSubscription: Subscription | null = null;

  ngOnInit() {
    this.competitorsService.competitor$.subscribe((competitor) => {
      this.testingRecords = competitor?.testingRecords || [];
      console.log(this.testingRecords);
    });

    this.competitorsService.vehicle$.subscribe((vehicle) => {
      this.vehicle = vehicle;
    });
  }

  // Verifica si hay una prueba de alcoholemia registrada
  hasAlcoholTest(): boolean {
    return this.testingRecords.some((record) => record.type === 'alcoholemia');
  }

  // Verifica si hay una constancia RTM registrada
  hasRTMTest(): boolean {
    return this.testingRecords.some((record) => record.type === 'mecanico');
  }

  getAlcoholTestUrl(): string {
    const alcoholTestRecord = this.testingRecords.find(
      (record) => record.type === 'alcoholemia'
    );
    return alcoholTestRecord ? alcoholTestRecord.test_image : '';
  }

  getRtmTestUrl(): string {
    const rtmTestRecord = this.testingRecords.find(
      (record) => record.type === 'mecanico'
    );
    return rtmTestRecord ? rtmTestRecord.test_image : '';
  }
}

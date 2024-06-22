import { Component, OnInit, inject } from '@angular/core';
import { CompetitorsService } from '../../services/competitors.service';
import { VehicleResponse } from '../../interfaces/req-response';

@Component({
  selector: 'app-vehicle-info',
  standalone: true,
  templateUrl: './vehicle-info.component.html',
  styles: [],
})
export class VehicleInfoComponent implements OnInit {
  private competitorsService = inject(CompetitorsService);

  public vehicle: VehicleResponse | null = null;

  ngOnInit() {
    this.competitorsService.vehicle$.subscribe((vehicle) => {
      this.vehicle = vehicle;
      console.log(this.vehicle);
      if (!vehicle) {
        console.log('No hay vehiculo');
      }
    });
  }
}

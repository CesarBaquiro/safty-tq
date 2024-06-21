import { Component } from '@angular/core';
import { CompetitorInfoComponent } from '../competitor-info/competitor-info.component';
import { VehicleInfoComponent } from '../vehicle-info/vehicle-info.component';

@Component({
  selector: 'app-competitors',
  standalone: true,
  templateUrl: './competitors.component.html',
  styles: ``,
  imports: [CompetitorInfoComponent, VehicleInfoComponent],
})
export default class CompetitorsComponent {
  infoOption: number = 1;

  changeOption(option: number) {
    this.infoOption = option;
  }

  getOpacity(option: number): number {
    return this.infoOption === option ? 1 : 0.5;
  }
}

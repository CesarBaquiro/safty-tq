import { Component, OnInit, inject } from '@angular/core';
import { CompetitorsService } from '../../services/competitors.service';
import type { CompetitorResponse } from '../../interfaces/req-response';

@Component({
  selector: 'app-competitor-info',
  standalone: true,
  templateUrl: './competitor-info.component.html',
  styles: [],
})
export class CompetitorInfoComponent implements OnInit {
  private competitorsService = inject(CompetitorsService);

  public competitor: CompetitorResponse | null = null;
  public contacts: any[] = [];
  public allergies: any[] = [];

  ngOnInit() {
    this.competitorsService.competitor$.subscribe((competitor) => {
      this.competitor = competitor;
      // Se asignan los valores a las listas
      this.allergies = competitor?.allergies || [];
      this.contacts = competitor?.contacts || [];
    });
  }
}

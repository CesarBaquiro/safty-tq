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

  ngOnInit() {
    this.competitorsService.competitor$.subscribe((competitor) => {
      this.competitor = competitor;
    });
  }
}

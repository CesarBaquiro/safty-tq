import { Component, OnInit, inject } from '@angular/core';
import { CompetitorsService } from '../../services/competitors.service';
import { CompetitorResponse } from '../../interfaces/req-response';

@Component({
  selector: 'app-list-competitors',
  standalone: true,
  templateUrl: './list-competitors.component.html',
  styles: [],
})
export default class ListCompetitorsComponent implements OnInit {
  private competitorsService = inject(CompetitorsService);
  competitors: CompetitorResponse[] = [];

  ngOnInit() {
    this.competitorsService.getAllCompetitors().subscribe(
      (data) => {
        this.competitors = data;
        console.log('Competitors:', this.competitors); // Para depuración
      },
      (error) => {
        console.error('Error fetching competitors:', error);
      }
    );
  }
}

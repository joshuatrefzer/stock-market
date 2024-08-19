import { AfterViewInit, Component, Input } from '@angular/core';
import { MainService } from '../services/main.service';

export interface StockData {
  T: string;   // Symbol des Wertpapiers, z.B. "TIGO"
  c: number;   // Schlusskurs (closing price)
  h: number;   // Höchstkurs (high price)
  l: number;   // Tiefstkurs (low price)
  n: number;   // Anzahl der Transaktionen
  o: number;   // Eröffnungskurs (opening price)
  t: number;   // Zeitstempel (Unix-Zeit in Millisekunden)
  v: number;   // Handelsvolumen (volume)
  vw: number;  // Durchschnittlicher Preis (volume-weighted average price)
}

// Chart.register(...registerables, LinearScale);


@Component({
  selector: 'app-list-item',
  standalone: true,
  imports: [],
  templateUrl: './list-item.component.html',
  styleUrl: './list-item.component.scss'
})
export class ListItemComponent  {
  @Input() data: StockData | undefined;
  @Input() id: number | undefined;

  constructor(private mainService:MainService){}

  updateStock(){
    if (this.data) {
      this.mainService.stockTicker.set(this.data);
    }
    
  }
  
  

  
}

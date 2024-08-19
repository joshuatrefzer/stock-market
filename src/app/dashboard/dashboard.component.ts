import { Component } from '@angular/core';
import { MainService } from '../services/main.service';
import { DiagrammComponent } from '../diagramm/diagramm.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [DiagrammComponent, CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {
  apiKey:string = "cCmj4SGd5ZtIDY3keypVXUVCwrRyLN3T";
  startDate:string = "2023-01-01";
  endDate:string = "2024-02-10";

  url:string = `https://api.polygon.io/v2/aggs/ticker/${this.mainService.stockTicker().T}/range/1/day/${this.startDate}/${this.endDate}?adjusted=true&sort=asc&limit=1&apiKey=${this.apiKey}`;

  constructor(public mainService:MainService){} 

  getCurrentMonth(): string {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0'); 
    return `${year}-${month}`;
  }

  addToFavorite() {
    const ticker = this.mainService.stockTicker();
  
    if (this.mainService.favorite === ticker) {
      this.mainService.favorite = undefined;
      localStorage.removeItem('stockTicker');
    } else {
      this.mainService.favorite = ticker;
      localStorage.setItem('stockTicker', JSON.stringify(ticker));
    }
  }



}

import { Component } from '@angular/core';
import { MainService } from '../services/main.service';
import { DiagrammComponent } from '../diagramm/diagramm.component';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { take } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { ApiResponse } from '../stock-list/stock-list.component';
import { StockData } from '../list-item/list-item.component';
import { DiagrammCompareComponent } from '../diagramm-compare/diagramm-compare.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [DiagrammComponent, CommonModule, FormsModule, DiagrammCompareComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {
  apiKey:string = "cCmj4SGd5ZtIDY3keypVXUVCwrRyLN3T";
  startDate:string = "";
  endDate:string = "";
  maxEndDate:string;
  maxStartDate:string;
  

  constructor(public mainService:MainService, private http:HttpClient){
    // set limits for date- inputs, to get only valid data
    const today = new Date();
    const year = today.getFullYear();

    const monthEnd = today.getMonth() + 1; 
    this.maxEndDate = `${year}-${monthEnd.toString().padStart(2, '0')}`; 
    
    const monthStart = today.getMonth();
    this.maxStartDate = `${year}-${monthStart.toString().padStart(2, '0')}`;
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

  updateChart() {
    if (!this.isDateRangeValid()) {
      alert("Please select a valid date interval");
      ////// FUNKTION -> STARTDATUM DARF NICHT NACH ENDDATUM SEIN!!
      return;
  }
    if (this.mainService.stockToCompare() && this.mainService.compairison) {
      this.getStockData();
      this.getStockDataToCompare();  
    }
    this.getStockData();
  }

  isDateRangeValid(): boolean {
    if (!this.startDate || !this.endDate) {
        return false; 
    } else {
      return true;
    }
}

getStockDataToCompare(){
  const T = this.mainService.stockToCompare()?.T;
  if (!T) return;
  const url = `https://api.polygon.io/v2/aggs/ticker/${T}/range/1/month/${this.startDate}-01/${this.endDate}-01?adjusted=true&sort=asc&apiKey=${this.apiKey}`;
    this.http.get<ApiResponse>(url).pipe(take(1)).subscribe(
     {
      next: (response:ApiResponse) => {
        this.mainService.stockDataTimeIntervalForCompairison = response.results;
        console.log(response.results);
        
      },
      error: (e) => {
        
      }
     } 
    );
}


  getStockData(){
    const url = `https://api.polygon.io/v2/aggs/ticker/${this.mainService.stockTicker().T}/range/1/month/${this.startDate}-01/${this.endDate}-01?adjusted=true&sort=asc&apiKey=${this.apiKey}`;
    this.http.get<ApiResponse>(url).pipe(take(1)).subscribe(
     {
      next: (response:ApiResponse) => {
        this.mainService.stockDataTimeInterval = response.results;
        console.log(response.results);
        
      },
      error: (e) => {
        
      }
     } 
    );
  }

  getDayStatus(): string {
    const now = new Date();
    const cutoffHour = 22;
    const cutoffMinute = 30;

    if (now.getHours() < cutoffHour || (now.getHours() === cutoffHour && now.getMinutes() < cutoffMinute)) {
      return "YESTERDAY";
    } else {
      return "TODAY";
    }
  }

  exitCompairison(){
    this.mainService.compairison = false; 
    this.mainService.stockToCompare.set(undefined);
    this.mainService.stockDataTimeIntervalForCompairison = undefined;
  }



}

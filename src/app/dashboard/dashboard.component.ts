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
  apiKey: string = "cCmj4SGd5ZtIDY3keypVXUVCwrRyLN3T";
  startDate: string = "";
  endDate: string = "";
  maxEndDate: string;
  maxStartDate: string;


  constructor(public mainService: MainService, private http: HttpClient) {
    // set limits for date- inputs, to get only valid data
    const today = new Date();
    const year = today.getFullYear();

    const monthEnd = today.getMonth() + 1;
    this.maxEndDate = `${year}-${monthEnd.toString().padStart(2, '0')}`;

    const monthStart = today.getMonth();
    this.maxStartDate = `${year}-${monthStart.toString().padStart(2, '0')}`;
  }


  /**
   * Adds the Key 'stockTicker' to local storage to save the favorite stock 
   */
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


  /**
   * Starts new request to get datta from selected range 
   * @returns if data is not a valid time interval to show stocks
   */
  updateChart() {
    if (!this.isDateRangeValid()) {
      this.mainService.errorMessage = "Please take a valid time interval";
      return;
    }
    if (this.mainService.isSameStock()) return;
    if (this.mainService.stockToCompare() && this.mainService.compairison) {
      this.getStockData();
      this.getStockDataToCompare();
    }
    this.getStockData();
  }


  /**
   * 
   * @returns {boolean} true/false.. if the selected dates are valid for API request. 
   */
  isDateRangeValid(): boolean {
    if (!this.startDate || !this.endDate) {
      return false;
    }
    const start = new Date(this.startDate + "-01");
    const end = new Date(this.endDate + "-01");

    if (start > end) {
      return false;
    }
    return true;
  }

  /**
   * GET request to get data for compairison with pre-selected stock (with selected range by user)
   * @returns if the variable "T" ( stock's name/symbol ) is not set. Providing errors because of invalid url.
   */
  getStockDataToCompare() {
    const T = this.mainService.stockToCompare()?.T;
    if (!T) return;
    const url = `https://api.polygon.io/v2/aggs/ticker/${T}/range/1/month/${this.startDate}-01/${this.endDate}-01?adjusted=true&sort=asc&apiKey=${this.apiKey}`;
    this.http.get<ApiResponse>(url).pipe(take(1)).subscribe(
      {
        next: (response: ApiResponse) => {
          this.mainService.stockDataTimeIntervalForCompairison = response.results;
        },
        error: (e) => {
          this.mainService.errorMessage = "Something went wrong by fetching stock data from API. Please wait a few seconds and try again (API handles 5 requests per minute only)";
        }
      }
    );
  }

  /**
   * GET request to get data with selected range 
   */
  getStockData() {
    const url = `https://api.polygon.io/v2/aggs/ticker/${this.mainService.stockTicker().T}/range/1/month/${this.startDate}-01/${this.endDate}-01?adjusted=true&sort=asc&apiKey=${this.apiKey}`;
    this.http.get<ApiResponse>(url).pipe(take(1)).subscribe(
      {
        next: (response: ApiResponse) => {
          this.mainService.stockDataTimeInterval = response.results;
        },
        error: (e) => {
          this.mainService.errorMessage = "Something went wrong by fetching stock data from API. Please wait a few seconds and try again (API handles 5 requests per minute only)";
        }
      }
    );
  }

  /**
   * 
   * @returns status of the day. If it's after 22:30, the US stock-market is closed and API shows data from current day. 
   * If not, it shows data from yesterday. 
   */
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

  /**
   * Sets variables back, and exits the compairison-view
   */
  exitCompairison() {
    this.mainService.compairison = false;
    this.mainService.stockToCompare.set(undefined);
    this.mainService.stockDataTimeIntervalForCompairison = undefined;
  }



}

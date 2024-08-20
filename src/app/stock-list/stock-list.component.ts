import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { firstValueFrom, take } from 'rxjs';
import { ListItemComponent, StockData } from '../list-item/list-item.component';
import { LoarderComponent } from '../loarder/loarder.component';
import { CommonModule } from '@angular/common';

export interface ApiResponse {
  adjusted: boolean;
  count: number;
  queryCount: number;
  request_id: string;
  results: StockData[];
  resultsCount: number;
  status: string;
  ticker?:string;
}

@Component({
  selector: 'app-stock-list',
  standalone: true,
  imports: [ListItemComponent, LoarderComponent, CommonModule],
  templateUrl: './stock-list.component.html',
  styleUrl: './stock-list.component.scss'
})
export class StockListComponent {

  apiKey: string = "cCmj4SGd5ZtIDY3keypVXUVCwrRyLN3T";
  apiUrl: string = "https://api.polygon.io/v2/aggs/grouped/locale/us/market/stocks/2024-08-01?adjusted=true&apiKey=" + this.apiKey;
  stockList: StockData[]  | undefined;
  loader:boolean = false;


  constructor(private http: HttpClient) {
    this.fetchUsStockList();
  }

  fetchUsStockList() {
    this.loader = true;
    this.http.get<ApiResponse>(this.apiUrl).pipe(take(1)).subscribe(
      {
        next: (data:ApiResponse) => {
          let response = data; 
          this.stockList = response['results'];
          console.log('my stock List', this.stockList);
          this.loader = false;
          
        },

        error: error => {
          alert('Error by loading data from backend');
        }
      }
    );

  }





}

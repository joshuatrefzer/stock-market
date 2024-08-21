import { Injectable, signal, WritableSignal } from '@angular/core';
import { StockData } from '../list-item/list-item.component';

@Injectable({
  providedIn: 'root'
})
export class MainService {

  favorite: StockData | undefined;
  stockTicker: WritableSignal<StockData> = signal(
    {
      T: "TIGO",          
      c: 24.61,          
      h: 24.925,          
      l: 24.375,          
      n: 1304,            
      o: 24.88,          
      t: 1722542400000,   
      v: 83557,           
      vw: 24.6321         
    }
  );

  stockDataTimeInterval: StockData[] | undefined;
  compairison: boolean = false;
  stockToCompare: WritableSignal<StockData | undefined> = signal(undefined);
  stockDataTimeIntervalForCompairison: StockData[] | undefined;
  errorMessage: string | undefined;

  constructor() {
    this.checkForFavorite();
  }

  /**
   * checks for favorite stock in local storage, after page reload this stock is shown in dashboard
   */
  checkForFavorite() {
    const storageData = localStorage.getItem('stockTicker');
    if (storageData) {
      this.stockTicker.set(JSON.parse(storageData))
      this.favorite = this.stockTicker();
    } else {
      this.favorite = undefined;
    }
  }

  /**
   * avoids loading the same two stocks into dashboard for compairison
   * @returns {boolean} 
   */
  isSameStock(){
    if (this.stockTicker().T == this.stockToCompare()?.T) {
      this.stockToCompare.set(undefined);
      this.errorMessage = "please select two different stocks";
      return true;
    } else {
      return false;
    }
  }

}

import { Injectable, signal, WritableSignal } from '@angular/core';
import { StockData } from '../list-item/list-item.component';

@Injectable({
  providedIn: 'root'
})
export class MainService {

  favorite: StockData | undefined;
  stockTicker: WritableSignal<StockData> = signal(
    {
      T: "TIGO",          // Symbol des Wertpapiers
      c: 24.61,           // Schlusskurs (closing price)
      h: 24.925,          // Höchstkurs (high price)
      l: 24.375,          // Tiefstkurs (low price)
      n: 1304,            // Anzahl der Transaktionen (number of trades)
      o: 24.88,           // Eröffnungskurs (opening price)
      t: 1722542400000,   // Zeitstempel (timestamp in Unix time)
      v: 83557,           // Handelsvolumen (volume)
      vw: 24.6321         // Durchschnittlicher Preis (volume-weighted average price)
    }
  );

  stockDataTimeInterval: StockData[] | undefined;
  compairison: boolean = false;
  
  stockToCompare: WritableSignal<StockData | undefined> = signal(undefined);
  stockDataTimeIntervalForCompairison: StockData[] | undefined;




  constructor() {
    this.checkForFavorite();
  }

  checkForFavorite() {
    const storageData = localStorage.getItem('stockTicker');
    if (storageData) {
      this.stockTicker.set(JSON.parse(storageData))
      this.favorite = this.stockTicker();
      
    } else {
      this.favorite = undefined;
    }
  }

}

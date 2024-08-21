import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { StockListComponent } from './stock-list/stock-list.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ErrorPopupComponent } from './error-popup/error-popup.component';
import { MainService } from './services/main.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, StockListComponent, DashboardComponent, ErrorPopupComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'stock-market';

  constructor(public mainService: MainService){
    
  }

}

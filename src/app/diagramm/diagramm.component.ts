import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { MainService } from '../services/main.service';
import { Chart, registerables, LinearScale } from 'chart.js';
import { StockData } from '../list-item/list-item.component';

Chart.register(...registerables, LinearScale);

@Component({
  selector: 'app-diagramm',
  standalone: true,
  imports: [],
  templateUrl: './diagramm.component.html',
  styleUrl: './diagramm.component.scss'
})
export class DiagrammComponent implements OnChanges {
  @Input() data: StockData | undefined;
  public chart: any;

  constructor(public mainService: MainService) { }

  ngOnChanges(changes: SimpleChanges): void {
    this.createLineChart();
  }

  createLineChart(): void {
    this.checkForColor();
    if (this.chart) {
      this.chart.destroy();
    }
    if (this.data) {
      const ctx = document.getElementById('lineChart') as HTMLCanvasElement;
      if (ctx) {
        this.chart = new Chart(ctx, {
          type: 'line',
          data: {
            labels: [`opening`, 'low', 'high', 'close'],
            datasets: [{
              label: `${this.data.T} Price`,
              data: [this.data.o, this.data.l, this.data.h, this.data.c],
              fill: false,
              borderColor: `rgba(${this.checkForColor()})`,
              tension: 0.1,
              pointRadius: 3,
              borderWidth: 2
            }]
          },
          options: {
            responsive: true,
            scales: {
              x: {
                display: true,
                title: {
                  display: true,
                  text: `${this.getDayStatus()}`
                }
              },
              y: {
                display: true,
                title: {
                  display: true,
                  text: 'Price (USD)'
                }
              }
            },
            plugins: {
              legend: {
                display: true
              },
              tooltip: {
                enabled: true
              }
            }
          }
        });
      }
    }
  }


  checkForColor() {
    if (!this.data) return "253, 254, 254";
    if (this.data?.o > this.data?.c) {
      return "192, 57, 43";
    } else {
      return "26, 188, 156";
    }

  }

  getDateFromTimestamp(): string | undefined {
    if (!this.data) return undefined;
  
    const timestamp = this.data.t;
    const date = new Date(timestamp);
  
    const options: Intl.DateTimeFormatOptions = { 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric' 
    };
  
    return date.toLocaleDateString('en-US', options);
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
  

}

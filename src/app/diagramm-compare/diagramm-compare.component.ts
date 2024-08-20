import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { MainService } from '../services/main.service';
import { Chart, registerables, LinearScale } from 'chart.js';
import { StockData } from '../list-item/list-item.component';
import { CommonModule } from '@angular/common';

Chart.register(...registerables, LinearScale);

@Component({
  selector: 'app-diagramm-compare',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './diagramm-compare.component.html',
  styleUrl: './diagramm-compare.component.scss'
})
export class DiagrammCompareComponent implements OnChanges {
  @Input() data: StockData | undefined;
  @Input() timeInterval: StockData[] | undefined;
  @Input() idExtention: string = "";

  public chart: any;

  constructor(public mainService: MainService) {}

  ngOnChanges(changes: SimpleChanges): void {
    this.createLineChart();
  }

  createLineChart(): void {
    if (this.chart) {
      this.chart.destroy();
    }

    if (this.timeInterval) {
      this.buildCustomChart();
    }


    if (this.data) {
      const ctx = document.getElementById(`lineChartCompare`) as HTMLCanvasElement;
      if (ctx) {
        this.chart = new Chart(ctx, {
          type: 'line',
          data: {
            labels: ['opening', 'average', 'close'],
            datasets: [{
              label: `${this.data.T} Price`,
              data: [this.data.o, this.data.vw, this.data.c],
              fill: false,
              borderColor: `rgba(${this.checkForColor(this.data.o, this.data.c)})`,
              tension: 0.1,
              pointRadius: 3,
              borderWidth: 2
            }]
          },
          options: this.setOptions()
        });
      }
    }
  }



  setOptions() {
    return {
      responsive: true,
      scales: {
        x: {
          display: true,
          title: {
            display: true,
            text: ``,
            color: 'white'
          },
          ticks: {
            color: 'white'
          },
          grid: {
            color: 'white'
          }
        },
        y: {
          display: true,
          title: {
            display: true,
            text: 'Price (USD)',
            color: 'white'
          },
          ticks: {
            color: 'white'
          },
          grid: {
            color: 'white'
          }
        },
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
  }



  buildCustomChart() {
    if (this.timeInterval) {
      const ctx = document.getElementById(`lineChartCompare`) as HTMLCanvasElement;
      if (ctx) {
        this.chart = new Chart(ctx, {
          type: 'line',
          data: {
            labels: this.getMonths(),
            datasets: [{
              label: `${this.mainService.stockToCompare()?.T} Price`,
              data: this.getXAxisInformation(),
              fill: false,
              borderColor: `rgba(${this.checkForColor(this.timeInterval[0].vw, this.timeInterval[this.timeInterval.length - 1].vw)})`,
              tension: 0.1,
              pointRadius: 3,
              borderWidth: 2
            }]
          },
          options: this.setOptions()
        });
      }
    }
  }

  getMonths() {
    let labels: string[] = [];
    this.timeInterval?.forEach(monthlyData => {
      const monthName = this.getMonthNameFromTimestamp(monthlyData.t);
      labels.push(monthName);
    });
    return labels;
  }


  getXAxisInformation() {
    let averageValues: number[] = [];
    this.timeInterval?.forEach(monthlyData => {
      const averageValue = monthlyData.vw;
      averageValues.push(averageValue);
    })

    return averageValues;


  }


  checkForColor(start: number, end: number) {
    if (start > end) {
      return "192, 57, 43";
    } else {
      return "26, 188, 156";
    }
  }


  getMonthNameFromTimestamp(timestamp: number): string {
    const date = new Date(timestamp);

    const options: Intl.DateTimeFormatOptions = {
      month: 'long' // Gibt den vollständigen Namen des Monats zurück
    };

    return date.toLocaleDateString('en-US', options);
  }


}

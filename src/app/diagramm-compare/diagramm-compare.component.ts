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

  /**
   * Triggers functions to build linechart. 
   * Destroys chart, to avoid id- issues
   */
  createLineChart(): void {
    if (this.chart) this.chart.destroy();
    if (this.timeInterval) this.buildCustomChart();
    this.setDataForChart();
  }


  /**
   * 
   * @returns if data is invalid for building chart. 
   * Sets data for construct chart.
   */
  setDataForChart(){
    if (!this.data) return;
    const ctx = document.getElementById(`lineChartCompare`) as HTMLCanvasElement;
      if (ctx) {
        this.chart = new Chart(ctx, {
          type: 'line',
          data: {
            labels: ['opening', 'average', 'close'],
            datasets: [{
              label: `${this.data?.T} Price`,
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

  /**
   * 
   * @returns options (like styling f.e.) for chart-build
   */
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

  /**
   * collects infomations / configuratons for chart
   */
  buildCustomChart() {
    if (this.timeInterval) {
      const ctx = document.getElementById(`lineChartCompare`) as HTMLCanvasElement;
      if (ctx) {
        this.chart = new Chart(ctx, {
          type: 'line',
          data: {
            labels: this.getMonths(),
            datasets: [{
              label: `${this.mainService.stockTicker().T} Price`,
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

  /**
   * 
   * @returns {String[]} array with name of months 
   */
  getMonths() {
    let labels: string[] = [];
    this.timeInterval?.forEach(monthlyData => {
      const monthName = this.getMonthNameFromTimestamp(monthlyData.t);
      labels.push(monthName);
    });
    return labels;
  }

  /**
   * 
   * @returns stock's average- values from months 
   */
  getXAxisInformation() {
    let averageValues: number[] = [];
    this.timeInterval?.forEach(monthlyData => {
      const averageValue = monthlyData.vw;
      averageValues.push(averageValue);
    })
    return averageValues;
  }

  /**
   * 
   * @param start start-value of diagramm
   * @param end endvalue of diagramm
   * @returns green or red, if stock is successful or not
   */
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
      month: 'long', 
      year: '2-digit'
    };
    return date.toLocaleDateString('en-US', options);
  }


}

import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subscription, timer } from 'rxjs';
import { AlertService } from 'src/app/services/alert.service';
import { StatsService } from 'src/app/services/stats.service';
import { environment } from 'src/environments/environment';
import { ChartOptions, ChartType, ChartDataSets } from 'chart.js';
import { Color,Label } from 'ng2-charts';
import { StatusCountReport } from 'src/app/models/status-count-report.model';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html'
})


export class HomeComponent implements OnInit, OnDestroy  {

  statusCountReport: StatusCountReport[];

  subscriptionAutoLoad: Subscription;

  subscriptionAlertService: Subscription;

  chartOptions: any = {
    responsive: true
  };
  chartLabels: Label[] = [];
  chartType: ChartType = 'line';
  chartLegend = true;
  chartPlugins = [];

  chartData: ChartDataSets[] = [];

  chartColors: Color[] = [
    {
      backgroundColor: 'transparent',
      borderColor: 'black',
    },
    {
      backgroundColor: 'transparent',
      borderColor: '#ff1e00',
      borderWidth: 4,
      pointBackgroundColor: '#ff1e00'
    },
    
  ];

  rows: string[]=[];
  cols: string[]=[];

  autoLoadInterval: Observable<number> = timer(0, environment.autoLoadInterval);

  constructor(private statsService: StatsService,
    private alertService: AlertService) {
  }

  ngOnDestroy() {
    this.subscriptionAutoLoad.unsubscribe();
  }

   ngOnInit() {

    this.subscriptionAlertService = this.alertService.alert.subscribe(message => {

      //if we have any alert, stop auto refresh.
      if (message) {
        this.subscriptionAutoLoad.unsubscribe();
      } 
  
    });

    this.subscriptionAutoLoad = this.autoLoadInterval.subscribe(() => {
      this.load();
    });

    
  }

  load(): void {
    this.statsService.load().subscribe(result => {
        this.statusCountReport = result;


        for (var item of result) {

          this.rows.push(item.status);
          this.cols.push(item.reportDate.toString());

        }

        this.rows = this.dedupe(this.rows);
        this.cols = this.dedupe(this.cols);

        this.chartData = [];
        this.chartLabels = [];

        for(var col of this.cols){
          this.chartLabels.push(col);
        }
        

        for(var row of this.rows){

          let data = [];
          let label = row;

          for(var col of this.cols){
            data.push(this.findVal(row, col));
          }


          let dataSet = { data: data, label: label, 
            backgroundColor: this.rgbaByStatus(label, .5),
            borderColor:  this.rgbaByStatus(label, 255),
            pointBackgroundColor: this.rgbaByStatus(label, .5),
            pointBorderColor: this.rgbaByStatus(label, 255),
          };

          this.chartData.push( dataSet);

        }

      }
    );
  }

  rgbaByStatus(status: string, opacity: number){

    const randomNum = () => Math.floor(Math.random() * (235 - 52 + 1) + 52);

    const randomRGB = () => `rgb(${randomNum()}, ${randomNum()}, ${randomNum()}, 255)`;
    
    let result = [
      status == 'DONE' ? `rgba(74,159,222,${opacity})` : 
      status.startsWith("ERROR") ? `rgba(226,114,138,${opacity})` : randomRGB()
      ]

    return result;

  }

  dedupe(array): string[]{

   return array.filter((value,index) => array.indexOf(value) === index);

  }


  findVal(row, col): number{

    for (var item of this.statusCountReport) {

      if(item.reportDate == col && item.status == row){
        return item.statusCount;
      }

    }

  }

}

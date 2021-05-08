import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subscription, timer } from 'rxjs';
import { StatusCountReport } from 'src/app/models/event-message.model';
import { AlertService } from 'src/app/services/alert.service';
import { StatsService } from 'src/app/services/stats.service';
import { environment } from 'src/environments/environment';
import { ChartOptions, ChartType, ChartDataSets } from 'chart.js';
import { Color,Label } from 'ng2-charts';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html'
})


export class HomeComponent implements OnInit, OnDestroy  {

  statusCountReport: StatusCountReport[];

  subscriptionAutoLoad: Subscription;

  subscriptionAlertService: Subscription;

  chartOptions: ChartOptions = {
    responsive: true,
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


          let borderColor;

          if (label == "DONE") {
            borderColor = "#2fb3f5";
          }
          else if (label.startsWith("ERROR")) {
            borderColor = "#f55858";
          }
          else {
            borderColor = '#' + Math.floor(Math.random() * 16777215).toString(16);
          }

          let dataSet = { data: data, label: label, fill: false, borderColor: borderColor};

          this.chartData.push( dataSet);

        }

      }
    );
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

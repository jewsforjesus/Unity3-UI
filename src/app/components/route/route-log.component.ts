import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RouteLogService } from 'src/app/services/route-log.service';
import { RouteLog } from 'src/app/models/route-log.model';
import { map, switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-route-log',
  templateUrl: 'route-log.component.html'
})
export class RouteLogComponent implements OnInit {

  id: string;
  routeLog: RouteLog = null;

  constructor(private routeLogService: RouteLogService,
    private route: ActivatedRoute) {

  }

  ngOnInit() {

    this
      .route
      .params
      .pipe(
        map(p => p.id),
        switchMap(id => {
          
          return this.routeLogService.findById(id);

        })
      )
      .subscribe(message => {

        this.routeLog = message;

        }
      );
    
  }


}
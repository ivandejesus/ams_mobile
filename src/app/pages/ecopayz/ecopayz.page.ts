import { Component, OnInit, Params, OnsNavigator } from "ngx-onsenui";
import { Observable, of } from "rxjs";
import { map } from "rxjs/operators";
import { Router } from "@angular/router";
import { DashboardPage } from "../dashboard/dashboard.page";


@Component({
  selector: 'ons-page[ecopayz]',
  templateUrl: './ecopayz.page.html',
  styleUrls: ['./ecopayz.page.css']
})
export class EcopayzPage implements OnInit {
  private apiResult$: Observable<string>;

  constructor(
    private params: Params,
    private router: Router,
    private navigator: OnsNavigator) {

  }

  ngOnInit(): void {
    this.apiResult$ = of(this.params.data.apiResult)
  }

  isSuccess(): Observable<boolean> {
    return this.apiResult$.pipe(map((apiResult: string): boolean => {
      return apiResult === 'success';
    }));
  }

  isFailure(): Observable<boolean> {
    return this.apiResult$.pipe(map((apiResult: string): boolean => {
      return apiResult === 'failure';
    }));
  }

  
  isCancel(): Observable<boolean> {
    return this.apiResult$.pipe(map((apiResult: string): boolean => {
      return apiResult === 'cancel';
    }));
  }

  onOk(): void {
    this.router.navigateByUrl('/');
    this.navigator.nativeElement.replacePage(DashboardPage);
  }
}
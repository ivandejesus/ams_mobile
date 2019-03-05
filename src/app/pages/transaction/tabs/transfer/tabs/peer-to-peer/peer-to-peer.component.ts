import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { Product } from "../../../../../../shared/model/product.model";
import { PeerToPeerForm } from "./peer-to-peer.form";
import { FormBuilder } from "@angular/forms";
import { OnsNavigator } from "ngx-onsenui";
import { TransactionApi } from "../../../../../../shared/api/service/transaction.api";
import { finalize } from "rxjs/operators";
import { TransactionHistoryPage } from "../../../../../transaction-history/transaction-history.page";
import { TransactionComponent } from "../../../../../../shared/component/transaction.component";
import { AlertService } from 'src/app/shared/ui/alert.service';

@Component({
  selector: 'tab[peer-to-peer]',
  templateUrl: './peer-to-peer.component.html',
  styleUrls: ['./peer-to-peer.component.css']
})
export class PeerToPeerComponent extends TransactionComponent implements OnInit, OnDestroy {
  products: Product[];
  form: PeerToPeerForm;

  constructor(
    private formBuilder: FormBuilder,
    private navigator: OnsNavigator,
    private transactionApi: TransactionApi,
    private alertService: AlertService
  ) {
    super();
  }

  ngOnInit(): void {
    this.user$ = this.sessionService.getUser();
    this.form = new PeerToPeerForm(this.formBuilder);
  }

  ngOnDestroy(): void {
  }

  onSubmit(): void {
    this.form.isSubmitting = true;

    const successHandler = (response: any) => {
      this.alertService.success({
        title: 'Success',
        message: 'Please wait for customer service confirmation. You can view transaction status in Transactions overview.'
        }, () => {
          this.navigator.element.replacePage(TransactionHistoryPage);
      });
    }

    const errorHandler = (errorResponse: any) => {
      this.form.setErrors(errorResponse.error);
    }

    this.transactionApi.p2pTransfer(this.form.createPayload())
      .pipe(
        finalize(() => this.form.isSubmitting = false)
      )
      .subscribe(successHandler, errorHandler);
  }
}

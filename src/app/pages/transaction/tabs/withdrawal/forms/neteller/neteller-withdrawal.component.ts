import { OnInit, Component, OnsNavigator } from "ngx-onsenui";
import { FormBuilder } from "@angular/forms";
import { TransactionApi } from "../../../../../../shared/api/service/transaction.api";
import { NetellerForm } from "./neteller-withdrawal.form";
import { finalize } from "rxjs/operators";
import { TransactionComponent } from "../../../../../../shared/component/transaction.component";
import { AlertService } from "src/app/shared/ui/alert.service";

@Component({
  selector: 'neteller-withdrawal',
  templateUrl: './neteller-withdrawal.component.html',
  styleUrls: ['./neteller-withdrawal.component.css']
})
export class NetellerWithdrawalComponent extends TransactionComponent implements OnInit {
  form: NetellerForm;
  
  constructor(
    private navigator: OnsNavigator,
    private formBuilder: FormBuilder,
    private transactionApi: TransactionApi,
    private alertService: AlertService
  ) {
      super();
  }

  ngOnInit(): void {
    this.user$ = this.sessionService.getUser();
    this.form = new NetellerForm(this.formBuilder, this.customerPaymentOption);
  }

  onChargeFeeClicked(event: MouseEvent, j: number): void {
    this.form.checkChargeFee(j);
  }

  onSubmit(): void {
    this.form.isSubmitting = true;

    const successHandler = (response: any) => {
      this.alertService.success({
        title: 'Success',
        message: 'Please wait for customer service confirmation. You can view transaction status in Transactions overview.'
        }, () => {
          this.resetForm();
      });
    }

    const errorHandler = (errorResponse: any) => {
      this.form.setErrors(errorResponse.error);
    }

    this.transactionApi.withdraw(this.form.createPayload())
      .pipe(
        finalize(() => this.form.isSubmitting = false)
      )
      .subscribe(successHandler, errorHandler);
  }
}

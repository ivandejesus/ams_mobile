
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { OnsenModule } from 'ngx-onsenui';

import { DashboardPage } from './dashboard/dashboard.page';
import { TransactionHistoryPage } from './transaction-history/transaction-history.page';
import { TransactionPage } from './transaction/transaction.page';

import { DepositTab } from './transaction/tabs/deposit/deposit.tab';
import { BitcoinDepositComponent } from './transaction/tabs/deposit/forms/bitcoin/bitcoin-deposit.component';
import { SkrillDepositComponent } from './transaction/tabs/deposit/forms/skrill/skrill-deposit.component';
import { NetellerDepositComponent } from './transaction/tabs/deposit/forms/neteller/neteller-deposit.component';
import { EcopayzDepositComponent } from './transaction/tabs/deposit/forms/ecopayz/ecopayz-deposit.component';
import { BankDepositComponent } from './transaction/tabs/deposit/forms/bank/bank-deposit.component';

import { WithdrawalTab } from './transaction/tabs/withdrawal/withdrawal.tab';
import { SkrillWithdrawalComponent } from './transaction/tabs/withdrawal/forms/skrill/skrill-withdrawal.component';
import { NetellerWithdrawalComponent } from './transaction/tabs/withdrawal/forms/neteller/neteller-withdrawal.component';
import { EcopayzWithdrawalComponent } from './transaction/tabs/withdrawal/forms/ecopayz/ecopayz-withdrawal.component';
import { BtcWithdrawalComponent } from './transaction/tabs/withdrawal/forms/bitcoin/btc-withdrawal.component';
import { BankWithdrawalComponent } from "./transaction/tabs/withdrawal/forms/bank/bank-withdrawal.component";

import { TransferTab } from './transaction/tabs/transfer/transfer.tab';
import { ProductWalletComponent } from './transaction/tabs/transfer/tabs/product-wallet/product-wallet.component';
import { PeerToPeerComponent } from './transaction/tabs/transfer/tabs/peer-to-peer/peer-to-peer.component';

import { AffiliatePage } from './affiliate/affiliate.page';
import { LoginPage } from './login/login.page';
import { LoginForm } from './login/component/form.component';
import { ProfilePage } from './profile/profile.page';
import { NotificationPage } from './notification/notification.page';
import { AccountTab } from './profile/tabs/account.tab';
import { KycTab } from './profile/tabs/kyc.tab';

import { AffiliateDashboardTab } from './affiliate/tabs/affiliate-dashboard.tab';
import { AffiliateToolsTab } from './affiliate/tabs/affiliate-tools.tab';
import { AffiliateArchiveTab } from './affiliate/tabs/tabs/affiliate-archive.tab';
import { AffiliateGenerateTab } from './affiliate/tabs/tabs/affiliate-generate.tab';
import { AffiliateProductTab } from './affiliate/tabs/tabs/affiliate-product.tab';
import { AffiliateMemberTab } from './affiliate/tabs/tabs/affiliate-member.tab';
import { SharedModule } from '../shared/shared.module';
import { SkypeOutstandingTab } from './skype-betting/tabs/skype-betting-outstanding.tab';
import { SkypeBettingHistoryTab } from './skype-betting/tabs/skype-betting-history.tab';
import { SkypeBettingOverviewTab } from './skype-betting/tabs/skype-betting-overview.tab';
import { SkypeBettingPage } from './skype-betting/skype-betting.page';
import { LaddaModule } from 'angular2-ladda';
import { SettingsPage } from './settings/settings.page';
import { AccountActivationComponent } from './settings/forms/account-activation/account-activation.component';
import { AccountPasswordComponent } from './settings/forms/account-password/account-password.component';
import { TransactionPasswordComponent } from './settings/forms/transaction-password/transaction-password.component';

import { BankAccountComponent } from './settings/forms/bank-account/bank-account.component';
import { ProductPage } from './product/product.page';
import { CreateProductPage } from './product/create-product.page';
import { TicketPage } from './ticket/ticket.page';
import { AccountUsernameComponent } from "./settings/forms/account-username/account-username.component";
import { ForgotPasswordPage } from './forgot-password/forgot-password.page';
import { EcopayzPage } from './ecopayz/ecopayz.page';

import { AccountNumber } from "../shared/ui/utils/account-number";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    OnsenModule,
    SharedModule,
    ReactiveFormsModule,
    LaddaModule,
  ],
  declarations: [
    DashboardPage,
    LoginPage,
    AffiliatePage,
    TransactionPage,
    TransferTab,
    ProductWalletComponent,
    PeerToPeerComponent,
    TransactionHistoryPage,
    ProfilePage,
    NotificationPage,
    EcopayzPage,

    DepositTab,
    BitcoinDepositComponent,
    SkrillDepositComponent,
    NetellerDepositComponent,
    EcopayzDepositComponent,
    BankDepositComponent,

    WithdrawalTab,
    SkrillWithdrawalComponent,
    NetellerWithdrawalComponent,
    EcopayzWithdrawalComponent,
    BtcWithdrawalComponent,
    BankWithdrawalComponent,

    SkypeBettingHistoryTab,
    SkypeOutstandingTab,
    SkypeBettingOverviewTab,
    SkypeBettingPage,

    AffiliateDashboardTab,
    AffiliateToolsTab,
    AffiliateProductTab,
    AffiliateMemberTab,
    AffiliateGenerateTab,
    AffiliateArchiveTab,
    AccountTab,
    KycTab,
    LoginForm,
    SettingsPage,
    AccountActivationComponent,
    AccountPasswordComponent,
    AccountUsernameComponent,
    TransactionPasswordComponent,
    BankAccountComponent,
    ProductPage,
    CreateProductPage,
    TicketPage,
    ForgotPasswordPage,

    AccountNumber,
  ],
  providers: [

  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class PagesModule { }

import { CUSTOM_ELEMENTS_SCHEMA, Injector } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { OnsenModule } from 'ngx-onsenui';

import { AppComponent } from './app.component';
import { SharedModule } from './shared/shared.module';
import { PagesModule } from './pages/pages.module';
import { DashboardPage } from './pages/dashboard/dashboard.page';
import { TransactionHistoryPage } from './pages/transaction-history/transaction-history.page';
import { TransactionPage } from './pages/transaction/transaction.page';

import { DepositTab } from './pages/transaction/tabs/deposit/deposit.tab';
import { WithdrawalTab } from './pages/transaction/tabs/withdrawal/withdrawal.tab';
import { TransferTab } from './pages/transaction/tabs/transfer/transfer.tab';
import { ProductWalletComponent } from './pages/transaction/tabs/transfer/tabs/product-wallet/product-wallet.component';
import { PeerToPeerComponent } from './pages/transaction/tabs/transfer/tabs/peer-to-peer/peer-to-peer.component';

import { LoginPage } from './pages/login/login.page';
import { ProfilePage } from './pages/profile/profile.page';
import { NotificationPage } from './pages/notification/notification.page';
import { AffiliatePage } from './pages/affiliate/affiliate.page';
import { AccountTab } from './pages/profile/tabs/account.tab';
import { KycTab } from './pages/profile/tabs/kyc.tab';
import { AffiliateDashboardTab } from './pages/affiliate/tabs/affiliate-dashboard.tab';
import { AffiliateToolsTab } from './pages/affiliate/tabs/affiliate-tools.tab';
import { AffiliateProductTab } from './pages/affiliate/tabs/tabs/affiliate-product.tab';
import { AffiliateMemberTab } from './pages/affiliate/tabs/tabs/affiliate-member.tab';
import { AffiliateArchiveTab } from './pages/affiliate/tabs/tabs/affiliate-archive.tab';
import { AffiliateGenerateTab } from './pages/affiliate/tabs/tabs/affiliate-generate.tab';
import { SkypeOutstandingTab } from './pages/skype-betting/tabs/skype-betting-outstanding.tab';
import { SkypeBettingHistoryTab } from './pages/skype-betting/tabs/skype-betting-history.tab';
import { SkypeBettingOverviewTab } from './pages/skype-betting/tabs/skype-betting-overview.tab';
import { SkypeBettingPage } from './pages/skype-betting/skype-betting.page';
import { AppInjector } from './shared/app.injector';
import { SettingsPage } from './pages/settings/settings.page';
import { AccountActivationComponent } from './pages/settings/forms/account-activation/account-activation.component';
import { AccountPasswordComponent } from './pages/settings/forms/account-password/account-password.component';
import { TransactionPasswordComponent } from './pages/settings/forms/transaction-password/transaction-password.component';
import { BankAccountComponent } from './pages/settings/forms/bank-account/bank-account.component';
import { ProductPage } from './pages/product/product.page';
import { CreateProductPage } from './pages/product/create-product.page';
import { TicketPage } from './pages/ticket/ticket.page';
import { AccountUsernameComponent } from "./pages/settings/forms/account-username/account-username.component";
import { ToastComponent } from './shared/ui/toast.component';
import { ForgotPasswordPage } from './pages/forgot-password/forgot-password.page';
import { UsernameValidator } from "./shared/validators/username.validator";
import { RouterModule } from '@angular/router';
import { EcopayzPage } from './pages/ecopayz/ecopayz.page';
import { AlertComponent } from './shared/ui/alert.component';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot([]),
    OnsenModule,
    PagesModule,
    SharedModule,
  ],
  providers: [
    UsernameValidator
  ],
  bootstrap: [AppComponent],
  schemas: [
      CUSTOM_ELEMENTS_SCHEMA,
  ],
  entryComponents: [
    DashboardPage,
    TransactionHistoryPage,
    LoginPage,
    TransactionPage,
    DepositTab,
    WithdrawalTab,
    TransferTab,
    ProductWalletComponent,
    PeerToPeerComponent,
    ProfilePage,
    NotificationPage,
    AccountTab,
    AffiliatePage,
    AffiliateDashboardTab,
    AffiliateToolsTab,
    AffiliateProductTab,
    AffiliateMemberTab,
    AffiliateArchiveTab,
    AffiliateGenerateTab,
    SkypeBettingHistoryTab,
    SkypeOutstandingTab,
    SkypeBettingOverviewTab,
    SkypeBettingPage,
    SettingsPage,
    EcopayzPage,
    KycTab,
    AccountTab,
    AccountActivationComponent,
    AccountPasswordComponent,
    AccountUsernameComponent,
    TransactionPasswordComponent,
    BankAccountComponent,
    ProductPage,
    CreateProductPage,
    TicketPage,
    ForgotPasswordPage,
    ToastComponent,
    AlertComponent
  ]
})
export class AppModule {
  constructor(injector:Injector){
    AppInjector.setInjector(injector);
  }
}

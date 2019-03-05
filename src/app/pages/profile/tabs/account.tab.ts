import { Component, OnInit, OnDestroy } from '@angular/core';
import { SessionService } from '../../../shared/security/session.service';
import { Observable } from 'rxjs';
import { User } from '../../../shared/model/security/session.model';

@Component({
    selector: 'tab[account]',
    templateUrl: './account.tab.html',
    styleUrls: ['./account.tab.css']
})
export class AccountTab implements OnInit {
  user$: Observable<User>;

  constructor(private sessionService: SessionService) { }

  ngOnInit(): void {
  
  }
}

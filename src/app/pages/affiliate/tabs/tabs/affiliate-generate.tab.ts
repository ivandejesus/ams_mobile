import { Component, OnInit } from '@angular/core';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'tab[affiliate-generate]',
  templateUrl: './affiliate-generate.tab.html',
  styleUrls: ['./affiliate-generate.tab.css']
})
export class AffiliateGenerateTab implements OnInit {
  amsAffiliateUrl: string = environment.amsSigninUrl + `&page=acrewards`;

  ngOnInit(): void {
  }

}

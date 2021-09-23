import { Component, OnInit } from '@angular/core';
import { ViewWillEnter } from '@ionic/angular';
import { AuthService } from '../auth/auth.service';
import { Candidat } from '../shared/user.model';
import { CandidatService } from '../tabs/candidat/candidat.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit, ViewWillEnter {
  user;
  isLoading: boolean;
  candidats: Candidat[] = [];
  constructor(
    private authService: AuthService,
    private candidatService: CandidatService
  ) {}
  ngOnInit(): void {
    this.authService.userData.subscribe(data => {
      console.log(data);
      this.user = data;
    this.isLoading = true;
    this.candidatService.candidats.subscribe(data => {
      this.candidats = data.candidats;
      this.isLoading = false;
    })
    })
  }


  ionViewWillEnter(): void {
  }

}

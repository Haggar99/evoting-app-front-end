import { Component, OnInit } from '@angular/core';
import { AlertController, ViewWillEnter } from '@ionic/angular';
import { AuthService } from 'src/app/auth/auth.service';
import { Candidat } from 'src/app/shared/user.model';
import { CandidatService } from './candidat.service';

@Component({
  selector: 'app-candidat',
  templateUrl: './candidat.page.html',
  styleUrls: ['./candidat.page.scss'],
})
export class CandidatPage implements OnInit, ViewWillEnter {
  candidats: Candidat[] = [];
  isLoading: boolean;
  constructor(
    private candidatService: CandidatService,
    private authService: AuthService,
    public alertController: AlertController
  ) { }

  ngOnInit() {
  }
  ionViewWillEnter(): void {
    this.isLoading = true;
    this.candidatService.candidats.subscribe(data => {
      console.log(data);
      this.candidats = data.candidats;
      this.isLoading = false;
    })
  }

  voter(candidatId: string){
    this.authService.userData.subscribe(data => {
    this.candidatService.votant(data.userId).subscribe(votant => {
      console.log(votant)
    if (votant.votant.isVoted) {
    this.presentAlert();
    } else {
      this.presentAlertConfirm(data.name,votant.votant._id, candidatId)
    }
    console.log(candidatId, data.userId);
    })
    })

  }
  async presentAlertConfirm(candidatName: string, userId: string, candidatId: string) {
    const alert = await this.alertController.create({
      header: 'Vote!',
      message: `Cliquer sur <strong>OK</strong> pour voter à Mr ${candidatName}`,
      buttons: [
        {
          text: 'Annuler',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            console.log('Confirm Cancel: blah');
          }
        }, {
          text: 'Ok',
          handler: () => {
            console.log('Confirm Okay');
            this.candidatService.voter(userId, candidatId).subscribe(_ => {});
          }
        }
      ]
    });

    await alert.present();
  }

  async presentAlert() {
    const alert = await this.alertController.create({
      header: 'Vote',
      message: 'Désolé vous avez déjà voté! merci.',
      buttons: ['OK']
    });

    await alert.present();

    const { role } = await alert.onDidDismiss();
  }

}

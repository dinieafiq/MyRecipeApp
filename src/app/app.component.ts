
import { AuthService } from './shared/services/auth.service';
import { AlertController, Platform } from '@ionic/angular';
import { Component } from '@angular/core';
import { DbService } from './shared/services/db.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  isAuth = false;
  constructor(private alertCtrl: AlertController,
    private authService: AuthService,
    private dbService: DbService,
    private platform: Platform) {
    this.initializeApp()
  }

  initializeApp() {
    this.platform.ready().then(() => {
      // this.dbService
    });
    this.authService.isAuthenticated.subscribe((res) => {
      console.log('authkee', res);
      if (res === true) {
        this.isAuth = res;
      } else {
        this.isAuth = res;
      }
    });
  }
  async logoutConfirm() {
    const alert = await this.alertCtrl.create({
      cssClass: 'my-custom-class',
      header: 'Confirmation',
      message: 'Are you sure want to logout?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            // console.log('Confirm Cancel: blah');
          },
        },
        {
          text: 'Yes',
          handler: () => {
            console.log('Confirm OK');
            this.logout();
          },
        },
      ],
    });

    await alert.present();
  }

  async logout() {
    await this.authService.logout();
  }
}

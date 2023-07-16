import { LoadingController, AlertController, ToastController } from '@ionic/angular';
import { AuthService } from './../../shared/services/auth.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  credentials: FormGroup;
  public showPass = true;

  constructor(private fb: FormBuilder,
    private router: Router,
    private authService: AuthService,
    private loadCtrl: LoadingController,
    private toastCtrl: ToastController) {

  }

  ngOnInit() {
    this.credentials = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(8)]],
    });
    this.setCredentialsValue();

  }

  ionViewWillEnter() {
    this.setCredentialsValue()
  }

  async login() {
    if (this.credentials.valid) {
      const loading = await this.loadCtrl.create({
        message: 'Loading...',
        spinner: 'circles'
      });
      await loading.present();
      console.log(this.credentials.value);

      this.authService.login(this.credentials.value).subscribe(
        async (res) => {
          await loading.dismiss();
          this.credentials.reset();
          this.router.navigate(['/home']);
        },
        async (err) => {
          console.log(err);
          await loading.dismiss();
          const toast = await this.toastCtrl.create({
            message:
              err.error.message + '!',
            duration: 2000,
            position: 'bottom'
          });
          await toast.present();
        }
      );
    }
  }

  setCredentialsValue() {
    this.credentials.setValue({
      username: 'lgronaverp',
      password: '4a1dAKDv9KB9'
    })
  }
  hideShowPassword() {
    this.showPass = !this.showPass;
  }
}
import { DbService } from 'src/app/shared/services/db.service';
import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { AlertController, ModalController, NavParams } from '@ionic/angular';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.page.html',
  styleUrls: ['./detail.page.scss'],
})
export class DetailPage implements OnInit {
  // @Input() data;
  item: any
  recipe_name: any = [];
  recipe_id: any;
  imageUrl: any = "";
  ingredient$: any = [];
  step$: any = []
  isChecked: boolean = false;


  constructor(
    private alertCtrl: AlertController,
    private dbService: DbService,
    private router: Router,
    private route: ActivatedRoute) {
    this.route.queryParams.subscribe(params => {
      if (this.router.getCurrentNavigation().extras.state) {
        this.item = this.router.getCurrentNavigation().extras.state;
        const recipe = this.item['recipe']
        this.recipe_name = recipe['name']
        this.recipe_id = recipe['recipe_id']
        this.imageUrl = recipe['image_path']
        this.ingredient$ = recipe['ingredients']
        this.step$ = recipe['steps']
        console.log('ITEM', this.item)
      }
    });
  }

  async ngOnInit() {
  }

  ionViewDidLeave() {
    // const routerState =  this.router.getCurrentNavigation().extras.state
    // // const item = this.navParams.get('state');
    // console.log(routerState);
    // this.recipe_name = routerState['recipe']['name']
  }

  closeModal(role = 'edit') {
    // this.modalCtrl.dismiss(this.data, role);
  }

  back() {
    this.router.navigate(['menu'])
  }

  openToUpdate(item) {
    const navExtras: NavigationExtras = {
      state: item
    };
    setTimeout(() => {
      this.router.navigate(['/update'], navExtras)
    }, 200);
  }


  deleteRecipe(id) {
    this.dbService.deleteData(id).then(_ => {
      this.router.navigate(['/menu'])
    })
  }

  async deleteConfirm(id) {
    const alert = await this.alertCtrl.create({
      cssClass: 'my-custom-class',
      header: 'Confirmation',
      message: 'Are you sure want to delete this recipe?',
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
            this.deleteRecipe(id);
          },
        },
      ],
    });

    await alert.present();
  }

}

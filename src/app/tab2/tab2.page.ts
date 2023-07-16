import { PopoverComponent } from './../popover/popover.component';
import { NavigationExtras, Router } from '@angular/router';
import { DetailPage } from '../core/detail/detail.page';
import { filter, map } from 'rxjs/operators';
import { Component } from '@angular/core';
import * as xml2js from "xml2js";
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { DbService } from '../shared/services/db.service';
import { ModalController, NavController, Platform, PopoverController, LoadingController, AlertController } from '@ionic/angular';
import { from, Subscription } from 'rxjs';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {
  recipeItems: any = [];
  displayItems: any = [];
  recipeType: any;
  isSelected = false;
  showSelect: boolean = false;
  selectedOption: string;
  filterOptions: any[] = [];
  isLoaded = false

  constructor(
    private platform: Platform,
    private loadCtrl: LoadingController,
    private alertCtrl: AlertController,
    private router: Router,
    private dbService: DbService,
    private popoverCtrl: PopoverController) {
    this.platform.backButton.subscribeWithPriority(10, () => {
      // this.router.navigate(['/menu']);
    });
    // this.initData()
  }

  ionViewWillEnter() {
    this.initData()
  }

  ngOnInit() {
  }

  initData() {
    if (this.platform.is('hybrid')) {
      this.dbService.loadDataFromDB().then(res => {
        this.displayItems = res
        this.recipeItems = res
        this.recipeType = this.dbService.recipeType
      });
    } else {
      this.displayItems = this.dbService.recipeItems
      this.recipeItems = this.dbService.recipeItems
      this.recipeType = this.dbService.recipeType

    }
    if (!this.displayItems.length) {
      this.loadingSpinner()
    }

    setTimeout(() => {

      this.isLoaded = true
    }, 1200);
  }

  async loadingSpinner() {
    const load = await this.loadCtrl.create({
      duration: 1200
    })
    load.present()
  }
  async fetchFilterOptions() {
    this.filterOptions = await this.dbService.recipeType;
  }

  ionViewDidEnter() {
    // Fetch filter options when the view is entered
    this.fetchFilterOptions();
  }

  async openFilterPopover(ev: any) {
    const dataRecipe = await this.dbService.recipeType

    console.log(this.filterOptions);
    const popover = await this.popoverCtrl.create({
      component: PopoverComponent,
      event: ev,
      translucent: true,
      componentProps: {
        options: dataRecipe
      }
    });

    await popover.present();

    const { data } = await popover.onDidDismiss();
    this.handleChangeFilter(data)
    console.log('Selected filter options:', data);
  }

  async handleChangeFilter(selected) {
    if (selected) {
      const filterRecipe = await this.recipeItems.filter((res) => {
        return selected?.includes(res.type)
        // return res.type === selected
      })
      console.log('filter', filterRecipe)
      if (selected.length != 0) {
        // this.isSelected = true;
        this.displayItems = filterRecipe
      } else {
        this.displayItems = this.recipeItems
      }

    }
  }

  openDetailWithState(item) {
    console.log(item);
    const navExtras: NavigationExtras = {
      state: item
    };

    setTimeout(() => {
      this.router.navigate(['/detail'], navExtras)
    }, 200);
  }

  openToUpdate(item) {
    const navExtras: NavigationExtras = {
      state: item
    };
    this.router.navigate(['/update'], navExtras)
  }

  handleInput(event) {
    const query = event.target.value.toLowerCase();
    this.displayItems = this.recipeItems.filter((d) => {
      // console.log(d)
      return d.recipe.name.toLowerCase().indexOf(query) > -1
    });
  }

  deleteRecipe(id) {
    this.dbService.deleteData(id).then(_ => {
      this.ionViewWillEnter() // refresh updated db
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
            // console.log('Confirm Cancel');
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

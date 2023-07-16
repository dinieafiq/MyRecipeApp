import { Router } from '@angular/router';
import { DbService } from 'src/app/shared/services/db.service';
import { Component } from '@angular/core';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {

  constructor(private dbService: DbService, private router: Router) { }

  addNewRecipe() {
    this.router.navigate(['/add']);
  }

  openRecipeList(){
    this.router.navigate(['/menu']);
  }
}

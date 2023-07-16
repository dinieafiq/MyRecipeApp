import { PhotoService } from './../../shared/services/photo.service';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray, FormControl } from '@angular/forms';

import { Router, ActivatedRoute, NavigationExtras } from '@angular/router';
import { ModalController, NavParams, Platform, AlertController } from '@ionic/angular';
import { DbService } from 'src/app/shared/services/db.service';

@Component({
  selector: 'app-update',
  templateUrl: './update.page.html',
  styleUrls: ['./update.page.scss'],
})
export class UpdatePage implements OnInit {
  item: any
  recipe_id: any = []
  recipe_name: any = [];
  recipe_type: any;
  imageUrl: any =
    'assets/icon/add-photo.png';;
  ingredient$: any = [];
  step$: any = []
  dynamicForm: FormGroup

  constructor(
    private platform: Platform,
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private alertCtrl: AlertController,
    private dbService: DbService,
    private photoService: PhotoService) {
    this.platform.backButton.subscribeWithPriority(10, () => {
      this.router.navigate(['/menu']);
    });
    this.route.queryParams.subscribe(params => {
      if (this.router.getCurrentNavigation().extras.state) {
        this.item = this.router.getCurrentNavigation().extras.state;
        const recipe = this.item['recipe']
        this.recipe_name = recipe['name']
        this.imageUrl = recipe['image_path']
        this.ingredient$ = recipe['ingredients']
        this.step$ = recipe['steps']
        this.recipe_id = recipe['recipe_id']
        this.recipe_type = this.item['type']

      }
    });
    this.dynamicForm = this.fb.group({
      name: ['', [Validators.required]],
      type: ['', [Validators.required]],
      image_path: ['', []],
      ingredients: this.fb.array([]),
      steps: this.fb.array([])
    });

    this.initializeForm()
  }
  ngOnInit() { }

  ionViewDidEnter() {
    this.initializeForm()
  }

  patchRecipeValue() {

  }

  get getStepArray() {
    return (<FormArray>this.dynamicForm.get('steps'));
  }

  get getIngredientArray() {
    return (<FormArray>this.dynamicForm.get('ingredients'));
  }

  addStepFormControl() {
    const newControl = new FormControl('');
    this.getStepArray.push(newControl);
  }

  addIngFormControl() {
    const newControl = new FormControl('');
    this.getIngredientArray.push(newControl);
    console.log('After Update: ', this.dynamicForm.value);
  }

  removeStepFormControl(index: number) {
    this.getStepArray.removeAt(index);
  }

  removeIngFormControl(index: number) {
    this.getIngredientArray.removeAt(index);
  }

  initializeForm() {
    const IngArray = this.fb.array([]);
    const stepArray = this.fb.array([]);

    this.ingredient$.forEach((data) => {
      const ingFC = this.fb.control(data);
      IngArray.push(ingFC);
    });

    this.step$.forEach((data) => {
      const stepFC = this.fb.control(data);
      stepArray.push(stepFC);
    });
    this.dynamicForm.patchValue({
      name: this.recipe_name,
      type: this.recipe_type,
      image_path: this.imageUrl,
    })
    this.dynamicForm.setControl('ingredients', IngArray);
    this.dynamicForm.setControl('steps', stepArray);
  }

  onUpdate() {
    console.log(this.dynamicForm.value)
    var recipe_name = this.dynamicForm.get('name').value
    var recipe_type = this.dynamicForm.get('type').value
    var image = this.dynamicForm.get('image_path').value

    var step = JSON.stringify(this.dynamicForm.get('steps').value)
    var ing = JSON.stringify(this.dynamicForm.get('ingredients').value)
    const body = {
      id: this.recipe_id,
      name: recipe_name, type: recipe_type,
      image_path: image, ingredients: ing,
      steps: step
    }
    const new_state = {
      id: this.recipe_id,
      name: recipe_name,
      image_path: image,
      ingredients: this.dynamicForm.get('ingredients').value,
      steps: this.dynamicForm.get('steps').value
    }
    // console.log(body)
    this.dbService.updateData(body).then(res => {
      this.navigateWithState(new_state, recipe_type)
    })
  }

  navigateWithState(item, rtype) {
    const navExtras: NavigationExtras = {
      state: { type: rtype, recipe: item }
    };
    setTimeout(() => {
      this.router.navigate(['/detail'], navExtras)
    }, 200);
  }

  changeImage() {
    this.photoService.selectImage()
      .then(res => {
        this.imageUrl = res;
        this.dynamicForm.patchValue({ image_path: res })
        console.log(this.dynamicForm.value);

      })
  }


}

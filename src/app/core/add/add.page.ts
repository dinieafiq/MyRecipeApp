import { PhotoService } from './../../shared/services/photo.service';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray, FormControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { DbService } from 'src/app/shared/services/db.service';

@Component({
  selector: 'app-add',
  templateUrl: './add.page.html',
  styleUrls: ['./add.page.scss'],
})
export class AddPage implements OnInit {
  clickedImage: string =
    'assets/icon/add-photo.png';

  item: any
  recipe_name: any = [];
  imageUrl: any = 'assets/icon/add-photo.png';;
  ingredient$: any = [];
  step$: any = []
  recipeForm: FormGroup

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private dbService: DbService,
    private photoService: PhotoService) {
    this.route.queryParams.subscribe(params => {
      if (this.router.getCurrentNavigation().extras.state) {
        this.item = this.router.getCurrentNavigation().extras.state;
        const recipe = this.item['recipe']
        this.recipe_name = recipe['name']
        this.imageUrl = recipe['image_path']
        this.ingredient$ = recipe['ingredients']
        this.step$ = recipe['steps']

      }
    });

    this.recipeForm = this.fb.group({
      name: ['', [Validators.required]],
      type: ['', [Validators.required]],
      image_path: ['', []],
      ingredients: this.fb.array([]),
      steps: this.fb.array([])
    });

    this.ngOnInit();
  }

  async ngOnInit() {
    this.initializeForm()
    // this.dbService.readFilePath()
  }

  get getStepArray() {
    return (<FormArray>this.recipeForm.get('steps'));
  }

  get getIngredientArray() {
    return (<FormArray>this.recipeForm.get('ingredients'));
  }

  addStepFormControl() {
    const newControl = new FormControl('');
    this.getStepArray.push(newControl);
    // console.log('After Add: ', this.recipeForm.value);
  }

  addIngFormControl() {
    const newControl = new FormControl('');
    this.getIngredientArray.push(newControl);
    // console.log('After Add: ', this.recipeForm.value);
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

    this.recipeForm.setControl('ingredients', IngArray);
    this.recipeForm.setControl('steps', stepArray);
  }

  async onSave() {
    console.log(this.recipeForm.value)
    var recipe_name = this.recipeForm.get('name').value
    var recipe_type = this.recipeForm.get('type').value
    var image = this.recipeForm.get('image_path').value

    var step = JSON.stringify(this.recipeForm.get('steps').value)
    var ing = JSON.stringify(this.recipeForm.get('ingredients').value)
    const body = { name: recipe_name, type: recipe_type, image_path: image, ingredients: ing, steps: step }
    this.dbService.insertData(body).then(res => {
      console.log('SAVED', res)
      this.recipeForm.reset();
      this.router.navigate(['/menu'])
    })

  }

  changeImage() {
    this.photoService.selectImage()
      .then(res => {
        this.imageUrl = res;
        this.recipeForm.patchValue({ image_path: res })
        console.log(this.recipeForm.value);

      })
  }

}

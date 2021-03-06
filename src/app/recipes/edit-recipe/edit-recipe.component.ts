import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormBuilder, FormArray, Validators } from '@angular/forms';

import { RecipeService } from '../recipe.service';
import { Recipe } from '../recipe.model';

@Component({
  selector: 'app-edit-recipe',
  templateUrl: './edit-recipe.component.html',
  styleUrls: ['./edit-recipe.component.css'],
})
export class EditRecipeComponent implements OnInit {
  id: number;
  isEditMode = false;
  recipeForm: FormGroup;

  get ingredientControls() {
    return (<FormArray>this.recipeForm.get('ingredients')).controls;
  }

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private recipeService: RecipeService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.id = +params['id'];
      this.isEditMode = params['id'] != null;
      this.initForm();
    });
  }

  onFormSubmit() {
    console.log('Form on submit: ', this.recipeForm);
    const recipeValues = this.recipeForm.value;

    if (!this.isEditMode) {
      this.recipeService.addRecipe(recipeValues);
    } else {
      this.recipeService.updateRecipe(this.id, recipeValues);
    }
    this.router.navigate(['../'], { relativeTo: this.route });
  }

  addIngredient() {
    (<FormArray>this.recipeForm.get('ingredients')).push(
      this.fb.group({
        name: ['', Validators.required],
        amount: [
          '',
          [Validators.required, Validators.pattern(/^[1-9]+[0-9]*$/)],
        ],
      })
    );
  }

  onCancelClick() {
    this.router.navigate(['../'], { relativeTo: this.route });
  }

  onIngredientDelete(index: number) {
    (<FormArray>this.recipeForm.get('ingredients')).removeAt(index);
  }

  private initForm() {
    let name = '';
    let imagePath = '';
    let description = '';
    let ingredientControls = new FormArray([]);

    if (this.isEditMode) {
      let recipe = this.recipeService.getRecipeById(this.id);
      ({ name, imagePath, description } = recipe);
      if (recipe.ingredients) {
        recipe.ingredients.forEach((i) => {
          const newFormGroup = this.fb.group({
            name: [i.name, Validators.required],
            amount: [
              i.amount,
              [Validators.required, Validators.pattern(/^[1-9]+[0-9]*$/)],
            ],
          });
          ingredientControls.push(newFormGroup);
        });
      }
    }

    //Using FormBuilder
    this.recipeForm = this.fb.group({
      name: [name, Validators.required],
      imagePath: [imagePath, Validators.required],
      description: [description, Validators.required],
      ingredients: ingredientControls,
    });

    // this.recipeForm = new FormGroup({
    //   name: new FormControl(name),
    //   url: new FormControl(imagePath),
    //   description: new FormControl(description),
    // });
  }
}

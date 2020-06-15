import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';

import { Ingredient } from '../../shared/ingredient.model';
import { ShoppingListService } from '../shopping-list.service';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-shopping-edit',
  templateUrl: './shopping-edit.component.html',
  styleUrls: ['./shopping-edit.component.css'],
})
export class ShoppingEditComponent implements OnInit, OnDestroy {
  @ViewChild('f', { static: false }) form: NgForm;
  subscription: Subscription;
  isEditing = false;
  editingIngIndex: number;
  editedIng: Ingredient;

  constructor(private slService: ShoppingListService) {}

  ngOnInit() {
    this.subscription = this.slService.editingIngredient.subscribe((index) => {
      this.isEditing = true;
      this.editingIngIndex = index;
      this.editedIng = this.slService.getIngredientByIndex(
        this.editingIngIndex
      );
      this.form.setValue({
        name: this.editedIng.name,
        amount: this.editedIng.amount,
      });
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  onSubmit(form: NgForm) {
    const value = form.value;
    const newIngredient = new Ingredient(value.name, value.amount);
    if (this.isEditing) {
      this.slService.updateIngredientByIndex(
        this.editingIngIndex,
        newIngredient
      );
    } else {
      this.slService.addIngredient(newIngredient);
    }
    this.clearForm();
  }

  clearForm() {
    this.isEditing = false;
    this.editingIngIndex = null;
    this.editedIng = null;
    this.form.resetForm();
  }

  deleteIngredient() {
    this.slService.deleteIngByIndex(this.editingIngIndex);
    this.clearForm();
  }
}

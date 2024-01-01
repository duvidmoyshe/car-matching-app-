import { Component, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, NgForm, ValidationErrors, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable, map } from 'rxjs';
import { colorOptions } from '../../const/color-options.const';
import { hobbies } from '../../const/hobbies.const';
import { motorTypes } from '../../const/motor-types.const';
import { seats } from '../../const/seats.const';
import { MockLocationService } from '../../services/mock-location.service';
import { HeaderService } from 'src/app/services/header.service';

@Component({
  selector: 'app-car-form',
  templateUrl: './car-form.component.html',
  styleUrls: ['./car-form.component.scss'],
})
export class CarFormComponent implements OnInit {
  @ViewChild('formDirective')
  private formDirective!: NgForm; // Add this line
  carForm!: FormGroup;
  hobbies = hobbies;
  motorTypes = motorTypes;
  seats = seats;
  colorOptions = colorOptions;
  cities$: Observable<{ id: number; value: string; }[] | undefined> | undefined;
  countries$: Observable<{ id: number; value: string; }[] | undefined> | undefined;

  constructor(
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private mockLocationService: MockLocationService,
    private headerService: HeaderService
  ) {
    this.createForm();
  }

  ngOnInit() {
    this.headerService.setHeaderTitle('Car-Form');
    this.loadCountries();
  }

  createForm(): void {
    this.carForm = this.fb.group({
      fullName: ['', [Validators.required, this.nameValidator]],
      gender: ['', Validators.required],
      email: ['', [Validators.email, Validators.required]],
      birthDate: ['', [Validators.required, this.dateValidator]],
      address: ['', [Validators.required, this.addressValidator]],
      city: ['', Validators.required],
      country: ['', Validators.required],
      hobbies: ['', Validators.required],
      favoriteColor: ['', Validators.required],
      numOfSeats: ['', [Validators.min(2), Validators.max(7), Validators.required]],
      motorType: ['', Validators.required],
    });
  }

  submitForm(): void {
    if (this.carForm.valid) {
      const storedData = localStorage.getItem('formData') ? JSON.parse(localStorage.getItem('formData')!) : [];
      storedData.push(this.carForm.value);
      localStorage.setItem('formData', JSON.stringify(storedData));
      this.snackBar.open('Request sent. A mail with your match will be sent to you.', 'Close', {
        duration: 3000,
      });
      Object.keys(this.carForm.controls).forEach(key => {
        this.carForm.controls[key].setValue('');
        this.carForm.controls[key].markAsUntouched();
      })
    }
  }

  markFormGroupTouched(formGroup: FormGroup): void {
    (Object as any).values(formGroup.controls).forEach((control: any) => {
      control.markAsTouched();

      if (control.controls) {
        this.markFormGroupTouched(control);
      }
    });
  }

  loadCountries(): void {
    this.countries$ = this.mockLocationService.getCountries();
  }

  onCountryChange(event: any): void {
    const selectedCountry = this.carForm.get('country')?.value;
    if (selectedCountry) {
      this.cities$ = this.mockLocationService.getCitiesInCountry(selectedCountry).pipe(
        map(cities => cities.value)
      )
    }
  }

  nameValidator(control: AbstractControl): ValidationErrors | null {
    const nameRegex = /^[a-zA-Z\s]*$/;
    const isValid = nameRegex.test(control.value);
    return isValid ? null : { invalidName: true };
  }

  dateValidator(control: AbstractControl): ValidationErrors | null {
    const isValidDate = !isNaN(Date.parse(control.value));
    return isValidDate ? null : { invalidDate: true };
  }

  addressValidator(control: AbstractControl): ValidationErrors | null {
   const addressRegex = /^(?=.*?\d)(?=.*?[a-zA-Z])[a-zA-Z\d]+$/
    const isValidAddress = addressRegex.test(control.value);
    return isValidAddress ? null : { invalidAddress: true };
  }

}

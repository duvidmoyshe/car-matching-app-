import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { countries } from '../const/countries.const';
import { cities } from '../const/cities.const';

@Injectable({
  providedIn: 'root'
})

export class MockLocationService {
  constructor() { }

  getCountries(): Observable<{ id: number, value: string }[]> {
    return of(countries);
  }

  getCitiesInCountry(countryId: number): Observable<any> {
    const _cities = cities[countryId - 1] || [];
    return of(_cities);
  }
}

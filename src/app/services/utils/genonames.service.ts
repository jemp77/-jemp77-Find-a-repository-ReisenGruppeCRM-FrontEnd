import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class GeonamesService {
  private geonamesApiUrl = 'http://api.geonames.org';
  private username = 'santiagom';

  constructor(private http: HttpClient) {}

  search(term: string): Observable<any[]> {
    const url = `${this.geonamesApiUrl}/searchJSON?q=${term}&maxRows=10&username=${this.username}&lang=es`;
    return this.http.get<any>(url).pipe(
      map(response => response.geonames),
      catchError(error => {
        console.error('Error fetching data from Geonames API:', error);
        return [];
      })
    );
  }
}

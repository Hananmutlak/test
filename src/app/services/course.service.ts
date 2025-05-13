// src/app/services/course.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Course } from '../models/course.model';
import { Observable, catchError, of } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class CourseService {
  private apiUrl = 'https://webbutveckling.miun.se/files/ramschema.json';

  constructor(private http: HttpClient) { }

  getCourses(): Observable<Course[]> {
    return this.http.get<Course[]>(this.apiUrl).pipe(
      catchError((error) => {
        console.error('Error fetching data:', error);
        return of([]);
      })
    );
  }
}
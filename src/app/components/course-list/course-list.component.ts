// src/app/components/course-list/course-list.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CourseService } from '../../services/course.service';
import { Course } from '../../models/course.model';

@Component({
  selector: 'app-course-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './course-list.component.html',
  styleUrls: ['./course-list.component.css']
})
export class CourseListComponent implements OnInit {
  courses: Course[] = [];
  filteredCourses: Course[] = [];
  searchTerm: string = '';
  sortField: keyof Course = 'code';
  sortDirection: 'asc' | 'desc' = 'asc';

  constructor(private courseService: CourseService) { }

  ngOnInit(): void {
    this.loadCourses();
  }

  private loadCourses(): void {
    this.courseService.getCourses().subscribe({
      next: (data) => {
        if (Array.isArray(data)) {
          this.courses = data;
          this.filteredCourses = [...data];
          this.sortCourses();
        } else {
          console.error('Invalid data format:', data);
          this.filteredCourses = [];
        }
      },
      error: (err) => {
        console.error('Error loading courses:', err);
        this.filteredCourses = [];
      }
    });
  }

  applyFilter(): void {
    const term = this.searchTerm.toLowerCase();
    this.filteredCourses = this.courses.filter(course =>
      (course.code?.toLowerCase().includes(term) || 
      course.coursename?.toLowerCase().includes(term))
    );
    this.sortCourses();
  }

  sortCourses(field: keyof Course = this.sortField): void {
    if (!Array.isArray(this.filteredCourses)) return;

    if (field === this.sortField) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortField = field;
      this.sortDirection = 'asc';
    }

    this.filteredCourses.sort((a, b) => {
      const valueA = a[field]?.toString().toLowerCase() || '';
      const valueB = b[field]?.toString().toLowerCase() || '';
      return this.sortDirection === 'asc' 
        ? valueA.localeCompare(valueB) 
        : valueB.localeCompare(valueA);
    });
  }

  getSortIcon(field: keyof Course): string {
    return this.sortField === field 
      ? this.sortDirection === 'asc' ? '↑' : '↓' 
      : '';
  }
}
# MongoDB Academic Records Project
 

## Project Objective
This project evaluates understanding of **MongoDB features and NoSQL design principles**, focusing on:  
- Document modeling  
- Embedded vs referenced data  
- CRUD operations  
- Query operators  
- Aggregation framework  
- Indexes and constraints  

The system stores **academic data for a university**, including:  
- Students  
- Courses  
- Semesters  
- Enrollments  
- Grades
---
  
## Database Schema and Design Decisions

### Collections
The project includes at least the following collections:  
1. **students**
   - Fields: `student_id`, `name`, `email`, `department`, `address`, `phone`
   - `address` is an embedded document containing `city`, `street`, and `zip`.
2. **courses**
   - Fields: `course_code`, `name`, `department`, `credits`
3. **semesters**
   - Fields: `semester_name`, `start_date`, `end_date`
4. **enrollments**
   - Fields: `student_id`, `course_id`, `semester_id`, `grade`
   - References `students`, `courses`, and `semesters` by their `_id`.
---
### Data Modeling Decisions
- **Embedded Data:**  
  The `address` of a student is embedded inside the `students` collection.  
  **Reason:** Address is tightly coupled with the student, and embedding avoids unnecessary joins and improves read performance.

- **Referenced Data:**  
  Enrollments reference students, courses, and semesters.  
  **Reason:** These entities can exist independently and are reused in multiple enrollments. Referencing avoids data duplication.

---

## Data Modeling include 
1. **Student email must be unique**.  
2. **A student cannot enroll in the same course in the same semester twice**.  
3. **Grades are stored per enrollment**.  
4. **At least one embedded structure must be used**.  
5. **At least one referenced relationship must be used**.  

---

## Indexes and Constraints
1. **Unique index on student email**  
   Ensures no two students can have the same email.
2. **Compound unique index on enrollments (`student_id`, `course_id`, `semester_id`)**  
   Prevents a student from enrolling in the same course in the same semester more than once.
3. **Additional indexes for performance:**  
   - `enrollments.student_id`  
   - `courses.department`  
   - `semesters.semester_name`

## CRUD Queries
The following operations are implemented in `queries.js`:
1. **Find all students in a specific department.**
   Finds the students department (CS).
2. **Find students with GPA greater than a given threshold.**
   Calculate the average grade for each student and
   return students whose average grade is greater than 85.
3. **Update a student’s email.**
   Update the email address of a specific student using student_id.
4. **Delete a dropped enrollment.**
   Delete enrollments with very low grades less than 65(considered dropped).
5. **List all courses taken by a specific student.**
   List all courses taken by a specific student along with grades.

---

## Aggregation Pipelines
Implemented in `aggregations.js`:

1. **Student Transcript**  
   *Purpose:*
   Displays a full transcript showing each student’s name, the courses they took, the semester, and the grade.

   *How it works:*
   Joins enrollments with students to get student names.
   Joins with courses to get course names.
   Joins with semesters to get semester names.
   Uses $project to display only readable fields.

   *Result:*
   A detailed list similar to a transcript:
   Student Name | Course Name | Semester | Grade

2. **Semester GPA Report**  
   *Purpose:*
   Calculates the average grade (GPA) for each student in each semester.

   *How it works:*
   Groups enrollment records by student_id + semester_id.
   Calculates the average grade using $avg.
   Joins with students to show student names.
   Rounds the GPA to 2 decimal places.

   *Result:*
   Student Name | Semester | Average Grade (GPA)

3. **Course Statistics**  
   *Purpose:*
   Provides statistics for each course, including how many students enrolled and the average grade.

   *How it works:*
   Groups enrollments by course_id.
   Counts students using $sum.
   Calculates average grade using $avg.
   Joins with courses to display course names.
   Rounds the average grade.

   *Result:*
   Course Name | Number of Students | Average Grade

4. **Top Performing Students**  
   *Purpose:*
   Ranks students from highest to lowest based on their overall average grade.

   *How it works:*
   Groups enrollments by student_id.
   Calculates each student’s overall average grade.
   Joins with students to display names.
   Sorts results in descending order of average grade.
   Rounds the average grade.

   *Result:*
   Student Name | Average Grade (Ranked)

---

## Data Inserted
- **Students:** 10
- **Courses:** 5
- **Semesters:** 2
- **Enrollments:** 50

---


## Project Folder Structure

- MongoDB_ProjectNumber_StudentID
  - create_indexes.js       # Script to create all indexes and constraints
  - insert_data.js          # Script to insert students, courses, semesters, and enrollments
  - queries.js              # CRUD queries (find, update, delete, list)
  - aggregations.js         # Aggregation pipelines (transcript, GPA, course stats, top students)
  - README.md               # Project documentation and explanation
  - screenshots
    - compass_view.png      # Screenshot of MongoDB Compass showing collections and indexes



## Entity-Relationship Diagram (ERD)
<img width="1205" height="413" alt="Schema V2" src="https://github.com/user-attachments/assets/eaac8ef8-3e18-420a-9f18-3985018ac3d4" />


## Database (compass_view)
<img width="1765" height="1010" alt="image" src="https://github.com/user-attachments/assets/a81a841d-c6a6-42d5-9b1f-0f571ca6228c" />


## Design Summary
- Embedded `address` for student convenience and faster reads.
- Referenced enrollments for normalized relationships.
- Indexes for uniqueness and performance.
- Aggregations for reporting and analytics.


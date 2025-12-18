## MongoDB Academic Records Project
 

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

##  Collections
The project includes at least the following collections:  
- `students`  
- `courses`  
- `semesters`  
- `enrollments`  

Additional collections can be added if justified in the README.  

## Data Modeling include 
1. **Student email must be unique**.  
2. **A student cannot enroll in the same course in the same semester twice**.  
3. **Grades are stored per enrollment**.  
4. **At least one embedded structure must be used**.  
5. **At least one referenced relationship must be used**.  


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


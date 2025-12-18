
db.students.insertMany([
  { 
    student_id: "S001",
    name: "Alice Johnson",
    email: "alice@example.com",
    department: "CS",
    address: { city: "Cairo", street: "El Nasr St", zip: "11511" },
    phone: "01011111111"
  },
  { 
    student_id: "S002",
    name: "Bob Smith",
    email: "bob@example.com",
    department: "CS",
    address: { city: "Giza", street: "Tahrir St", zip: "12345" },
    phone: "01022222222"
  },
  { 
    student_id: "S003",
    name: "Charlie Lee",
    email: "charlie@example.com",
    department: "Math",
    address: { city: "Alexandria", street: "Corniche St", zip: "21555" },
    phone: "01033333333"
  },
  { 
    student_id: "S004",
    name: "Dina Saad",
    email: "dina@example.com",
    department: "Math",
    address: { city: "Cairo", street: "Maadi St", zip: "11519" },
    phone: "01044444444"
  },
  { 
    student_id: "S005",
    name: "Ehab Ali",
    email: "ehab@example.com",
    department: "Physics",
    address: { city: "Cairo", street: "Dokki St", zip: "11518" },
    phone: "01055555555"
  },
  { 
    student_id: "S006",
    name: "Fatma Omar",
    email: "fatma@example.com",
    department: "CS",
    address: { city: "Cairo", street: "Heliopolis St", zip: "11512" },
    phone: "01066666666"
  },
  { 
    student_id: "S007",
    name: "Gamal Hassan",
    email: "gamal@example.com",
    department: "Math",
    address: { city: "Cairo", street: "Nasr City St", zip: "11513" },
    phone: "01077777777"
  },
  { 
    student_id: "S008",
    name: "Hana Youssef",
    email: "hana@example.com",
    department: "Physics",
    address: { city: "Giza", street: "6th October St", zip: "12346" },
    phone: "01088888888"
  },
  { 
    student_id: "S009",
    name: "Ibrahim Fathy",
    email: "ibrahim@example.com",
    department: "CS",
    address: { city: "Alexandria", street: "Stanley St", zip: "21556" },
    phone: "01099999999"
  },
  { 
    student_id: "S010",
    name: "Jana Karim",
    email: "jana@example.com",
    department: "Math",
    address: { city: "Cairo", street: "Zamalek St", zip: "11514" },
    phone: "01010101010"
  }
]);

print("✅ 10 students inserted with embedded addresses");

print("✅ 10 students inserted");


// 2 Insert Courses

db.courses.insertMany([
  { course_code: "CS101", name: "Intro to CS", department: "CS", credits: 3 },
  { course_code: "CS102", name: "Data Structures", department: "CS", credits: 3 },
  { course_code: "MATH101", name: "Calculus I", department: "Math", credits: 4 },
  { course_code: "PHYS101", name: "Physics I", department: "Physics", credits: 4 },
  { course_code: "MATH102", name: "Linear Algebra", department: "Math", credits: 3 }
]);

print("✅ 5 courses inserted");


// 3 Insert Semesters

db.semesters.insertMany([
  { semester_name: "Fall 2025", start_date: new Date("2025-09-01"), end_date: new Date("2025-12-31") },
  { semester_name: "Spring 2026", start_date: new Date("2026-01-15"), end_date: new Date("2026-05-15") }
]);

print("✅ 2 semesters inserted");


//  Insert Enrollments


// Collect the ObjectIds of all students, courses, semesters
const studentIds = [];
db.students.find().forEach(s => studentIds.push(s._id));

const courseIds = [];
db.courses.find().forEach(c => courseIds.push(c._id));

const semesterIds = [];
db.semesters.find().forEach(sem => semesterIds.push(sem._id));

// Generate 20 enrollments
const enrollments = [];
for (let i = 0; i < 20; i++) {
  enrollments.push({
    student_id: studentIds[i % studentIds.length],
    course_id: courseIds[i % courseIds.length],
    semester_id: semesterIds[i % semesterIds.length],
    grade: Math.floor(Math.random() * 41) + 60 // random grade 60-100
  });
}

// Insert enrollments
db.enrollments.insertMany(enrollments);

print("✅ 20 enrollments inserted successfully!");

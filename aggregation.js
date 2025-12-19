const readline = require("readline");
const { connectDB, closeDB } = require("./db_connection.js");

/* 1 Student – Course – Semester – Grade */
async function studentCourseSemesterGrades() {
  const db = await connectDB();

  return db.collection("enrollments").aggregate([
    { $lookup: { from: "students", localField: "student_id", foreignField: "student_id", as: "student" } },
    { $unwind: "$student" },
    { $lookup: { from: "courses", localField: "course_id", foreignField: "course_code", as: "course" } },
    { $unwind: "$course" },
    { $lookup: { from: "semesters", localField: "semester_id", foreignField: "semester_name", as: "semester" } },
    { $unwind: "$semester" },
    {
      $project: {
        _id: 0,
        studentName: "$student.name",
        courseName: "$course.name",
        semesterName: "$semester.semester_name",
        grade: 1
      }
    }
  ]).toArray();
}

/* 2 Average grade per student per semester */
async function avgGradePerStudentSemester() {
  const db = await connectDB();

  return db.collection("enrollments").aggregate([
    {
      $group: {
        _id: { student: "$student_id", semester: "$semester_id" },
        avgGrade: { $avg: "$grade" }
      }
    },
    { $lookup: { from: "students", localField: "_id.student", foreignField: "student_id", as: "student" } },
    { $unwind: "$student" },
    {
      $project: {
        _id: 0,
        studentName: "$student.name",
        semesterName: "$_id.semester",
        avgGrade: { $round: ["$avgGrade", 2] }
      }
    }
  ]).toArray();
}

/* 3 Course statistics */
async function courseStatistics() {
  const db = await connectDB();

  return db.collection("enrollments").aggregate([
    {
      $group: {
        _id: "$course_id",
        numberOfStudents: { $sum: 1 },
        avgGrade: { $avg: "$grade" }
      }
    },
    { $lookup: { from: "courses", localField: "_id", foreignField: "course_code", as: "course" } },
    { $unwind: "$course" },
    {
      $project: {
        _id: 0,
        courseName: "$course.name",
        numberOfStudents: 1,
        avgGrade: { $round: ["$avgGrade", 2] }
      }
    }
  ]).toArray();
}

/* 4 Students ranked by average grade */
async function studentsRankedByAvgGrade() {
  const db = await connectDB();

  return db.collection("enrollments").aggregate([
    { $group: { _id: "$student_id", avgGrade: { $avg: "$grade" } } },
    { $lookup: { from: "students", localField: "_id", foreignField: "student_id", as: "student" } },
    { $unwind: "$student" },
    { $sort: { avgGrade: -1 } },
    {
      $project: {
        _id: 0,
        studentName: "$student.name",
        avgGrade: { $round: ["$avgGrade", 2] }
      }
    }
  ]).toArray();
}



async function runAggregation() {
    console.log("-------------------------------");
    console.log("1. Student Transcript: Student info + courses + grades");
    console.log("2. : GPA per Student per Semester");
    console.log("3. Course Statistics: Number of students + average grade per course");
    console.log("4. Students Ranked by Average Grade");
    console.log("-------------------------------");
    const  rl= readline.createInterface({
    input: process.stdin,
    output: process.stdout
    });
rl.question("Enter your choice (1-4): ", async (choice) => {
  try {
    let result;

    switch (choice.trim()) {
      case "1":
        result = await studentCourseSemesterGrades();
        break;
      case "2":
        result = await avgGradePerStudentSemester();
        break;
      case "3":
        result = await courseStatistics();
        break;
      case "4":
        result = await studentsRankedByAvgGrade();
        break;
      default:
        console.log("❌ Invalid choice");
        rl.close();
        return;
    }

    console.table(result);
  } catch (err) {
    console.error("Error:", err.message);
  } finally {
    await closeDB();
    rl.close();
  }}
);
}
runAggregation();

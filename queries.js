const { connectDB, closeDB } = require("./db_connection.js");
const readline = require("readline");

async function findCSStudents(db) {
  const students = await db.collection("students").find({ department: "CS" }).toArray();
  console.log("✅ Students in CS department:", students);
}

async function avgGradeAbove85(db) {
  const result = await db.collection("enrollments").aggregate([
    {
      $group: { _id: "$student_id", avgGrade: { $avg: "$grade" } }
    },
    {$lookup: { from: "students", localField: "_id", foreignField: "student_id", as: "student" } },
    { $match: { avgGrade: { $gt: 85 } } },
    { $project: { _id: 0, student_id: "$_id", studentName: { $arrayElemAt: ["$student.name", 0] }, avgGrade: 1 } }
  ]).toArray();
  console.log("✅ Students with avg grade > 85:", result);
}

async function updateStudentEmail(db) {
  const studentId = "S001"; 
  const newEmail = "alice.new@example.com";
  const result = await db.collection("students").updateOne(
    { student_id: studentId },
    { $set: { email: newEmail } }
  );
  console.log(`✅ Updated student ${studentId} email:`, result.modifiedCount, "document(s) modified");
}

async function deleteLowGrades(db) {
  const result = await db.collection("enrollments").deleteMany({ grade: { $lt: 65 } });
  console.log("✅ Deleted enrollments with grade < 65:", result.deletedCount, "document(s)");
}

async function listStudentCourses(db) {
  const studentId = "S001"; 
  const result = await db.collection("enrollments").aggregate([
    { $match: { student_id: studentId } },
    {
      $lookup: {
        from: "courses",
        localField: "course_id",
        foreignField: "course_code",
        as: "course"
      }
    },
    { $unwind: "$course" },
    { $project: { _id: 0, courseName: "$course.name", grade: 1 } }
  ]).toArray();
  console.log(`✅ Courses taken by ${studentId}:`, result);
}


async function runQuery() {
  const db = await connectDB();

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  console.log(`
Choose an operation:
1. Find all students in CS department
2. Avg grade > 85
3. Update student email
4. Delete low grades
5. List courses for a student
`);

  rl.question("Enter choice: ", async (choice) => {
    try {
      switch (choice) {
        case "1":
          await findCSStudents(db);
          break;
        case "2":
          await avgGradeAbove85(db);
          break;
        case "3":
          await updateStudentEmail(db);
          break;
        case "4":
          await deleteLowGrades(db);
          break;
        case "5":
          await listStudentCourses(db);
          break;
        default:
          console.log("Invalid choice");
      }
    } catch (err) {
      console.error(" Error:", err.message);
    } finally {
      rl.close();
      await closeDB(); 
    }
  });
}

runQuery();

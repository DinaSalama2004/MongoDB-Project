// const { connectDB, closeDB } = require("./db_connection.js");
// const readline = require("readline");

// async function findCSStudents(db) {
//   const students = await db.collection("students").find({ department: "CS" }).toArray();
//   console.log("✅ Students in CS department:", students);
// }

// async function avgGradeAbove85(db) {
//   const result = await db.collection("enrollments").aggregate([
//     {
//       $group: { _id: "$student_id", avgGrade: { $avg: "$grade" } }
//     },
//     {$lookup: { from: "students", localField: "_id", foreignField: "student_id", as: "student" } },
//     { $match: { avgGrade: { $gt: 85 } } },
//     { $project: { _id: 0, student_id: "$_id", studentName: { $arrayElemAt: ["$student.name", 0] }, avgGrade: 1 } }
//   ]).toArray();
//   console.log("✅ Students with avg grade > 85:", result);
// }

// async function updateStudentEmail(db) {
//   const studentId = "S001"; 
//   const newEmail = "alice.new@example.com";
//   const result = await db.collection("students").updateOne(
//     { student_id: studentId },
//     { $set: { email: newEmail } }
//   );
//   console.log(`✅ Updated student ${studentId} email:`, result.modifiedCount, "document(s) modified");
// }

// async function deleteLowGrades(db) {
//   const result = await db.collection("enrollments").deleteMany({ grade: { $lt: 65 } });
//   console.log("✅ Deleted enrollments with grade < 65:", result.deletedCount, "document(s)");
// }

// async function listStudentCourses(db) {
//   const studentId = "S001"; 
//   const result = await db.collection("enrollments").aggregate([
//     { $match: { student_id: studentId } },
//     {
//       $lookup: {
//         from: "courses",
//         localField: "course_id",
//         foreignField: "course_code",
//         as: "course"
//       }
//     },
//     { $unwind: "$course" },
//     { $project: { _id: 0, courseName: "$course.name", grade: 1 } }
//   ]).toArray();
//   console.log(`✅ Courses taken by ${studentId}:`, result);
// }


// async function runQuery() {
//   const db = await connectDB();

//   const rl = readline.createInterface({
//     input: process.stdin,
//     output: process.stdout
//   });

//   console.log(`
// Choose an operation:
// 1. Find all students in CS department
// 2. Avg grade > 85
// 3. Update student email
// 4. Delete low grades
// 5. List courses for a student
// `);

//   rl.question("Enter choice: ", async (choice) => {
//     try {
//       switch (choice) {
//         case "1":
//           await findCSStudents(db);
//           break;
//         case "2":
//           await avgGradeAbove85(db);
//           break;
//         case "3":
//           await updateStudentEmail(db);
//           break;
//         case "4":
//           await deleteLowGrades(db);
//           break;
//         case "5":
//           await listStudentCourses(db);
//           break;
//         default:
//           console.log("Invalid choice");
//       }
//     } catch (err) {
//       console.error(" Error:", err.message);
//     } finally {
//       rl.close();
//       await closeDB(); 
//     }
//   });
// }

// runQuery();



const { connectDB, closeDB } = require("./db_connection");
const readline = require("readline");

/* -------------------- 1. Find students in a department -------------------- */
async function findStudentsByDepartment(db, department) {
  const students = await db.collection("students")
    .find({ department })
    .project({ _id: 0, student_id: 1, name: 1, email: 1 })
    .toArray();

  console.log(`\n✅ Students in ${department} department:`);
  console.table(students);
}

/* -------------------- 2. Find students with GPA > X -------------------- */
async function findStudentsWithGPA(db, minGPA) {
  const result = await db.collection("enrollments").aggregate([
    {
      $group: {
        _id: "$student_id",
        gpa: { $avg: "$grade" }
      }
    },
    {
      $match: { gpa: { $gt: minGPA } }
    },
    {
      $lookup: {
        from: "students",
        localField: "_id",
        foreignField: "student_id",
        as: "student"
      }
    },
    { $unwind: "$student" },
    {
      $project: {
        _id: 0,
        student_id: "$_id",
        name: "$student.name",
        GPA: { $round: ["$gpa", 2] }
      }
    }
  ]).toArray();

  console.log(`\n✅ Students with GPA > ${minGPA}:`);
  console.table(result);
}

/* -------------------- 3. Update student email -------------------- */
async function updateStudentEmail(db, studentId, newEmail) {
  const result = await db.collection("students").updateOne(
    { student_id: studentId },
    { $set: { email: newEmail } }
  );

  if (result.modifiedCount === 1) {
    console.log(`\n✅ Email updated for student ${studentId}`);
  } else {
    console.log(`\n⚠️ No student found with ID ${studentId}`);
  }
}

/* -------------------- 4. Delete dropped enrollment -------------------- */
async function deleteDroppedEnrollment(db, studentId, courseId) {
  const result = await db.collection("enrollments").deleteOne({
    student_id: studentId,
    course_id: courseId
  });

  if (result.deletedCount === 1) {
    console.log(`\n✅ Enrollment deleted (Student: ${studentId}, Course: ${courseId})`);
  } else {
    console.log("\n⚠️ Enrollment not found");
  }
}

/* -------------------- 5. List courses taken by a student -------------------- */
async function listStudentCourses(db, studentId) {
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
    {
      $project: {
        _id: 0,
        course: "$course.name",
        grade: 1
      }
    }
  ]).toArray();

  console.log(`\n✅ Courses taken by student ${studentId}:`);
  console.table(result);
}

/* -------------------- INTERACTIVE MENU -------------------- */
async function runQueries() {
  const db = await connectDB();
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  console.log(`
========= QUERY MENU =========
1. Find all students in a department
2. Find students with GPA > X
3. Update a student email
4. Delete a dropped enrollment
5. List courses taken by a student
0. Exit
==============================
`);

  rl.question("Enter your choice: ", async (choice) => {
    try {
      switch (choice) {
        case "1":
          rl.question("Enter department: ", async (dept) => {
            await findStudentsByDepartment(db, dept);
            rl.close();
            await closeDB();
          });
          break;

        case "2":
          rl.question("Enter minimum GPA: ", async (gpa) => {
            await findStudentsWithGPA(db, Number(gpa));
            rl.close();
            await closeDB();
          });
          break;

        case "3":
          rl.question("Enter student ID: ", (sid) => {
            rl.question("Enter new email: ", async (email) => {
              await updateStudentEmail(db, sid, email);
              rl.close();
              await closeDB();
            });
          });
          break;

        case "4":
          rl.question("Enter student ID: ", (sid) => {
            rl.question("Enter course ID: ", async (cid) => {
              await deleteDroppedEnrollment(db, sid, cid);
              rl.close();
              await closeDB();
            });
          });
          break;

        case "5":
          rl.question("Enter student ID: ", async (sid) => {
            await listStudentCourses(db, sid);
            rl.close();
            await closeDB();
          });
          break;

        default:
          console.log("👋 Exiting...");
          rl.close();
          await closeDB();
      }
    } catch (err) {
      console.error("❌ Error:", err.message);
      rl.close();
      await closeDB();
    }
  });
}

runQueries();



/*
Operation 1:
Find all students in a specific department (CS).
*/
db.students.find(
  { department: "CS" }
);

/*
Operation 2:
Calculate the average grade for each student and
return students whose average grade is greater than 85.
*/
db.enrollments.aggregate([
  {
    $group: {
      _id: "$student_id",
      avgGrade: { $avg: "$grade" }
    }
  },
  {
    $match: { avgGrade: { $gt: 85 } }
  },
  {
    $project: {
      _id: 0,
      student_id: "$_id",
      avgGrade: 1
    }
  }
]);

/*
Operation 3:
Update the email address of a specific student using student_id.
*/
db.students.updateOne(
  { student_id: "S001" },
  { $set: { email: "alice.new@example.com" } }
);

/*
Operation 4:
Delete enrollments with very low grades (considered dropped).
*/
db.enrollments.deleteMany(
  { grade: { $lt: 65 } }
);

/*
Operation 5:
List all courses taken by a specific student along with grades.
*/
db.enrollments.aggregate([
  { $match: { student_id: ObjectId("PUT_STUDENT_OBJECT_ID_HERE") } },
  {
    $lookup: {
      from: "courses",
      localField: "course_id",
      foreignField: "_id",
      as: "course"
    }
  },
  { $unwind: "$course" },
  {
    $project: {
      _id: 0,
      courseName: "$course.name",
      grade: 1
    }
  }
]);


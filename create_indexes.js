const { MongoClient } = require("mongodb");

const url = "mongodb://localhost:27017";
const dbName = "university_db";

async function createIndexes() {
  const client = new MongoClient(url);

  try {
    await client.connect();
    console.log("Connected to MongoDB");

    const db = client.db(dbName);

  
    // Unique index on student email
  
    await db.collection("students").createIndex(
      { email: 1 },
      { unique: true }
    );
    console.log("Unique index created on students.email");

  
    // 2 Compound index to prevent duplicate enrollment
  

    await db.collection("enrollments").createIndex(
  {
    student_id: 1,
    course_id: 1,
    semester_id: 1
  },
  { unique: true }
);


// Additional indexes for performance optimization
  db.enrollments.createIndex({ student_id: 1 });
  db.courses.createIndex({ department: 1 });
  db.semesters.createIndex({ semester_name: 1 });
    console.log("Compound unique index created on enrollments");

  } catch (error) {
    console.error("Error creating indexes:", error.message);
  } finally {
    await client.close();
  }
}

createIndexes();

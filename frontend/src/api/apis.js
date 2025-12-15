import axios from "axios";

const backend_url = import.meta.env.VITE_BACKEND_URL;

// --------------------
// Authentication
// --------------------
// Login user
export async function login(credentials) {
  const response = await axios.post(
    `${backend_url}/api/v1/user/login`,
    credentials
  );
  if (response) return response.data;
}

// Logout user
export async function logout() {
  const response = await axios.post(`${backend_url}/api/v1/user/logout`);
  if (response) return response.data;
}

// change user password
export async function changePassword(userId, passwordData) {
  const response = await axios.put(
    `${backend_url}/api/v1/user/change_password/${userId}`,
    passwordData
  );
  if (response) return response.data;
}

// --------------------
// Admin
// --------------------
// get admin
export async function getAdmin(adminId) {
  const response = await axios.get(`${backend_url}/api/v1/admin/get/${adminId}`);
  if (response) return response.data;
}

// get update admin
export async function updatedmin(adminId,adminData) {
  const response = await axios.put(
    `${backend_url}/api/v1/admin/update/${adminId}`,
    adminData
  );
  if (response) return response.data;
}

// get all records data
export async function getAllRecords() {
  const response = await axios.get(`${backend_url}/api/v1/admin/records`);
  if (response) return response.data;
}

// --------------------
// Student
// --------------------
// Register student
export async function registerStudent(studentData) {
  const response = await axios.post(
    `${backend_url}/api/v1/student/register`,
    studentData
  );
  if (response) return response.data;
}

// get single student
export async function getStudent(studentId) {
  const response = await axios.get(
    `${backend_url}/api/v1/student/single/${studentId}`
  );
  if (response) return response.data;
}

// get all student
export async function getAllStudent() {
  const response = await axios.get(`${backend_url}/api/v1/student/all`);
  if (response) return response.data;
}

// get update student
export async function updateStudent(studentId, studentData) {
  const response = await axios.put(
    `${backend_url}/api/v1/student/update/${studentId}`,
    studentData
  );
  if (response) return response.data;
}

// delete student
export async function deleteStudent(studentId) {
  const response = await axios.delete(
    `${backend_url}/api/v1/student/delete/${studentId}`
  );
  if (response) return response.data;
}

// --------------------
// Teacher
// --------------------
// Register teacher
export async function registerTeacher(teacherData) {
  const response = await axios.post(
    `${backend_url}/api/v1/teacher/register`,
    teacherData
  );
  if (response) return response.data;
}

// get single teacher
export async function getTeacher(teacherId) {
  const response = await axios.get(
    `${backend_url}/api/v1/teacher/single/${teacherId}`
  );
  if (response) return response.data;
}

// get all teacher
export async function getAllTeacher() {
  const response = await axios.get(`${backend_url}/api/v1/teacher/all`);
  if (response) return response.data;
}

// get update teacher
export async function updateTeacher(teacherId, teacherData) {
  const response = await axios.put(
    `${backend_url}/api/v1/teacher/update/${teacherId}`,
    teacherData
  );
  if (response) return response.data;
}

// delete teacher
export async function deleteTeacher(teacherId) {
  const response = await axios.delete(
    `${backend_url}/api/v1/teacher/delete/${teacherId}`
  );
  if (response) return response.data;
}

// --------------------
// Class
// --------------------
// create class
export async function createClass(classData) {
  const response = await axios.post(
    `${backend_url}/api/v1/class/create`,
    classData
  );
  if (response) return response.data;
}

// get single class
export async function getClass(classId) {
  const response = await axios.get(
    `${backend_url}/api/v1/class/single/${classId}`
  );
  if (response) return response.data;
}

// get all class
export async function getAllClass() {
  const response = await axios.get(`${backend_url}/api/v1/class/all`);
  if (response) return response.data;
}

// get update class
export async function updateClass(classId, classData) {
  const response = await axios.put(
    `${backend_url}/api/v1/class/update/${classId}`,
    classData
  );
  if (response) return response.data;
}

// delete class
export async function deleteClass(classId) {
  const response = await axios.delete(
    `${backend_url}/api/v1/class/delete/${classId}`
  );
  if (response) return response.data;
}

// --------------------
// Schedule
// --------------------
// create schedule
export async function createSchedule(scheduleData) {
  const response = await axios.post(
    `${backend_url}/api/v1/schedule/create`,
    scheduleData
  );
  if (response) return response.data;
}

// get single schedule
export async function getSchedule(scheduleId) {
  const response = await axios.get(
    `${backend_url}/api/v1/schedule/single/${scheduleId}`
  );
  if (response) return response.data;
}

// get all schedule
export async function getAllSchedule() {
  const response = await axios.get(`${backend_url}/api/v1/schedule/all`);
  if (response) return response.data;
}

// get update schedule
export async function updateSchedule(scheduleId, scheduleData) {
  const response = await axios.put(
    `${backend_url}/api/v1/schedule/update/${scheduleId}`,
    scheduleData
  );
  if (response) return response.data;
}

// delete schedule
export async function deleteSchedule(scheduleId) {
  const response = await axios.delete(
    `${backend_url}/api/v1/schedule/delete/${scheduleId}`
  );
  if (response) return response.data;
}

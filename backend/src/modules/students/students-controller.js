const asyncHandler = require("express-async-handler");
const { getAllStudents, addNewStudent, getStudentDetail, setStudentStatus, updateStudent } = require("./students-service");
const { handleControllerError } = require("../../utils/apiErrorHandler");
const { ApiError } = require("../../utils");

const handleGetAllStudents = asyncHandler(async (req, res) => {
    try {
        const { name, className, section, roll } = req.query;
        const students = await getAllStudents({ name, className, section, roll });
        res.status(200).json({ students });
    } catch (error) {
        // No match is not an error for a list endpoint — return empty array
        if (error instanceof ApiError && error.statusCode === 404) {
            return res.status(200).json({ students: [] });
        }
        handleControllerError(error, "Failed to retrieve students");
    }
});

const handleAddStudent = asyncHandler(async (req, res) => {
    try {
        const payload = req.body;
        const message = await addNewStudent(payload);
        res.status(201).json(message);
    } catch (error) {
        handleControllerError(error, "Failed to add student");
    }
});

const handleUpdateStudent = asyncHandler(async (req, res) => {
    try {
        const { id: userId } = req.params;
        const payload = req.body;
        const message = await updateStudent({ ...payload, userId });
        res.status(200).json(message);
    } catch (error) {
        handleControllerError(error, "Failed to update student");
    }
});

const handleGetStudentDetail = asyncHandler(async (req, res) => {
    try {
        const { id } = req.params;
        const student = await getStudentDetail(id);
        if (!student) {
            throw new ApiError(404, "Student not found");
        }
        res.status(200).json(student);
    } catch (error) {
        handleControllerError(error, "Failed to retrieve student details");
    }
});

const handleStudentStatus = asyncHandler(async (req, res) => {
    try {
        const payload = req.body;
        const { id: userId } = req.params;
        const { id: reviewerId } = req.user;
        const message = await setStudentStatus({ ...payload, userId, reviewerId });
        res.status(200).json(message);
    } catch (error) {
        handleControllerError(error, "Failed to update student status");
    }
});

module.exports = {
    handleGetAllStudents,
    handleGetStudentDetail,
    handleAddStudent,
    handleStudentStatus,
    handleUpdateStudent,
};

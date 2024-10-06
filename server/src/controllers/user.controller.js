const catchAsync = require('../utils/catchAsync');
const { userService } = require('../services');

const getAllusers = catchAsync(async (req, res) => {
    const { page, limit, search } = req.query
    let currentPage = parseInt(page) || 1
    let recordCount = parseInt(limit) || 30

    const result = await userService.getUsers({ page: currentPage, limit: recordCount, search });
    res.send(result);
});

const createNewUser = catchAsync(async (req, res) => {
    const result = await userService.createNewUser(req.body);
    res.send(result);
});

const updateUser = catchAsync(async (req, res) => {
    const result = await userService.updateUser(req.params.id, req.body);
    res.send(result);
});



const getRoles = catchAsync(async (req, res) => {
    const result = await userService.getRoles();
    res.send(result);
});


const changeStatus = catchAsync(async (req, res) => {
    const result = await userService.changeStatus(req.params.id);
    res.send(result);
});



module.exports = {
    getAllusers,
    createNewUser,
    getRoles,
    changeStatus,
    updateUser
};

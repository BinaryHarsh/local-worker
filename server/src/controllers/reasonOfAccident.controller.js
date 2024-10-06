const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const ReasonOfAccidentService = require('../services/reasonOfAccident.service')

const getReasonOfAccident = catchAsync(async (req, res) => {
 const data = await ReasonOfAccidentService.getReasonOfAccident();
  res.status(httpStatus.OK).send(data);
});

module.exports = {
    getReasonOfAccident
};


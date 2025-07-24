const yup = require('yup');

const getRecords = yup.object().shape({
    contractId: yup.number().required('Contract ID is required'),
});

const addRecord = yup.object().shape({
    ContractID: yup.number().required('Contract ID is required'),
    MemberEntityID: yup.number().required('Member Entity ID is required'),
    ReportAmount: yup.number().required('Report Amount is required'),
    ReportItem: yup.string().trim().required('Report Item is required'),
});

const deleteRecord = yup.object().shape({
    recordId: yup.number().required('Record ID is required'),
});

const updateRecordParams = yup.object().shape({
    recordId: yup.number().required('Record ID is required'),
});

const updateRecordBody = yup.object().shape({
    MemberEntityID: yup.number().required('Member Entity ID is required'),
    ReportAmount: yup.number().required('Report Amount is required'),
    ReportItem: yup.string().trim().required('Report Item is required'),
});

module.exports = {
    getRecords,
    addRecord,
    deleteRecord,
    updateRecordParams,
    updateRecordBody
};

const { sql } = require("../configs/db.config");

const getContracts = async (id) => {
  const result = await sql.query(
    `Select * From dbo.ContractT Where EntityID=${id} and IsActive=1`
  );
  if (result.recordset && result.recordset.length > 0) {
    const contracts = result.recordset;
    return contracts;
  } else {
    const error = new Error("Contracts Not Found!");
    error.code = 404;
    throw error;
  }
};

const getRecordsByContract = async (contractId) => {
  const result = await sql.query(`Select CurrentQtr from dbo.S_DefaultT`);
  if (result.recordset && result.recordset.length > 0) {
    const CurrentQtr = result.recordset[0].CurrentQtr;
    const result2 = await sql.query(
      `Select * From dbo.ReportQ Where ContractID=${contractId} and ReportQtr='${CurrentQtr}'`
    );
    if (result2.recordset && result2.recordset.length > 0) {
      const records = result2.recordset;
      return records;
    } else {
      const error = new Error("Records Not Found Against This Contract!");
      error.code = 404;
      throw error;
    }
  } else {
    const error = new Error("Default Quater Not Found!");
    error.code = 404;
    throw error;
  }
};

const getMembersList = async () => {
  const result = await sql.query(
    `Select EntityID, EntityName From dbo.EntityT Where EntityGroup='Member' Order By EntityName`
  );
  if (result.recordset && result.recordset.length > 0) {
    const members = result.recordset;
    return members;
  } else {
    const error = new Error("Members Not Found!");
    error.code = 404;
    throw error;
  }
};

const addRecord = async (data) => {
  const { ContractID, MemberEntityID, ReportAmount, ReportItem } = data;
  const result = await sql.query(`Select CurrentQtr from dbo.S_DefaultT`);
  if (result.recordset && result.recordset.length > 0) {
    const CurrentQtr = result.recordset[0].CurrentQtr;
    // console.log("CurrentQtr: ", CurrentQtr);
    const result2 = await sql.query(
      `Insert Into dbo.ReportT (ContractID, MemberEntityID, ReportItem, ReportAmount, ReportQtr) Values (${ContractID},${MemberEntityID},'${ReportItem}',${ReportAmount},'${CurrentQtr}')`
    );
    if (result2.rowsAffected[0] <= 0) {
      const error = new Error("Unable To Add Record!");
      error.code = 400;
      throw error;
    }
  } else {
    const error = new Error("Default Quater Not Found!");
    error.code = 404;
    throw error;
  }
};

const deleteRecord = async (recordId) => {
  const result = await sql.query(
    `Delete from dbo.ReportT Where ReportID=${recordId}`
  );
  if (result.rowsAffected[0] <= 0) {
    const error = new Error("Unable To Delete Report!");
    error.code = 400;
    throw error;
  }
};

const updateRecord = async (data, recordId) => {
  const { MemberEntityID, ReportItem, ReportAmount } = data;
  const result = await sql.query(
    `Update dbo.ReportT set MemberEntityID=${MemberEntityID}, ReportItem='${ReportItem}',ReportAmount=${ReportAmount} where ReportID=${recordId}`
  );
  if (result.rowsAffected[0] <= 0) {
    const error = new Error("Unable To Update Report!");
    error.code = 400;
    throw error;
  }
};

module.exports = {
  getContracts,
  getRecordsByContract,
  getMembersList,
  addRecord,
  deleteRecord,
  updateRecord,
};

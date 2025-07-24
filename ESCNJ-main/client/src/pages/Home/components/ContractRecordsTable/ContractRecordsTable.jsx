import "./ContractRecordsTable.css";
import { MdEdit, MdDelete } from "react-icons/md";
import { useDispatch } from "react-redux";
import { HideLoading, ShowLoading } from "../../../../redux/loaderSlice";
import { message, Popconfirm } from "antd";
import contractService from "../../../../services/contractService";

const ContractRecordsTable = ({
  records,
  fetchRecordsByContract,
  setEditReport,
}) => {
  const dispatch = useDispatch();

  const handleEdit = (record) => {
    const data = {
      ReportID: record.ReportID,
      ReportItem: record.ReportItem,
      ReportAmount: record.ReportAmount,
      MemberEntityID: record.MemberEntityID,
      EntityName: record.EntityName,
    };
    // console.log("Record to edit: ", data);
    setEditReport(data);
  };

  const handleDelete = async (recordId) => {
    try {
      dispatch(ShowLoading());
      const response = await contractService.deleteRecord(recordId);
      // console.log("Response: ", response);
      message.success(response.message);
      fetchRecordsByContract();
    } catch (error) {
      message.error(error?.response?.data?.error || "Something Went Wrong!");
    } finally {
      dispatch(HideLoading());
    }
  };

  return (
    <table className="contract-records-table">
      <thead>
        <tr>
          <th style={{ width: "50%" }}>Member Name</th>
          <th style={{ width: "30%" }}>Item</th>
          <th style={{ width: "10%" }}>Amount</th>
          <th style={{ width: "10%" }}>Action</th>
        </tr>
      </thead>
      <tbody>
        {records.map((record, index) => (
          <tr className="contract-record-row" key={index}>
            <td>{record.EntityName}</td>
            <td>{record.ReportItem}</td>
            <td>{record.ReportAmount}</td>
            <td className="table-action">
              <div
                className="table-action-icon"
                onClick={() => handleEdit(record)}
              >
                <MdEdit size={22} className="icon" />
              </div>
              <Popconfirm
                title="Delete the report"
                description="Are you sure to delete this report?"
                onConfirm={() => handleDelete(record.ReportID)}
                onCancel={() => {}}
                okText="Yes"
                cancelText="No"
              >
                <div className="table-action-icon">
                  <MdDelete size={22} className="icon" />
                </div>
              </Popconfirm>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default ContractRecordsTable;

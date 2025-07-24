import { useState, useEffect } from "react";
import "./Contracts.css";
import { useDispatch } from "react-redux";
import { HideLoading, ShowLoading } from "../../../../redux/loaderSlice";
import ContractRecords from "../ContractRecords/ContractRecords";
import contractService from "../../../../services/contractService";

const Contracts = () => {
  const [contracts, setContracts] = useState([]);
  const [state, setState] = useState("loading");
  const [selectedContract, setSelectedContract] = useState(null);
  const [records, setRecords] = useState([]);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchContracts = async () => {
      try {
        dispatch(ShowLoading());
        const response = await contractService.getContracts();
        // console.log("Response: ", response);
        setContracts(response.contracts);
      } catch (error) {
        console.log(
          "Error: ",
          error?.response?.data?.error || "Something Went Wrong!"
        );
      } finally {
        dispatch(HideLoading());
        setState("done");
      }
    };

    fetchContracts();
  }, []);

  const fetchRecordsByContract = async () => {
    try {
      dispatch(ShowLoading());
      const response = await contractService.getRecordsByContract(
        selectedContract
      );
      //   console.log("Response: ", response);
      setRecords(response.records);
    } catch (error) {
      setRecords([]);
      console.log(
        "Error: ",
        error?.response?.data?.error || "Something Went Wrong!"
      );
    } finally {
      dispatch(HideLoading());
    }
  };

  useEffect(() => {
    if (selectedContract) {
      fetchRecordsByContract();
    }
  }, [selectedContract]);

  const formatDate = (isoDateStr) => {
    const date = new Date(isoDateStr);
    const month = String(date.getUTCMonth() + 1).padStart(2, "0");
    const day = String(date.getUTCDate()).padStart(2, "0");
    const year = date.getUTCFullYear();
    return `${month}/${day}/${year}`;
  };

  const handleContractClick = (contractId) => {
    // console.log("Selected Contract Id: ", contractId);
    setSelectedContract(contractId);
  };

  return (
    <>
      <div className="contract-wrapper">
        {state === "loading" ? (
          <></>
        ) : state === "done" && (!contracts || contracts.length <= 0) ? (
          <div>No active contracts.</div>
        ) : (
          <>
            <div className="contracts">
              {contracts.map((contract, index) => (
                <div
                  key={index}
                  className={`contract ${
                    selectedContract === contract.ContractID
                      ? "selected-contract"
                      : "non-selected-contract"
                  }`}
                  onClick={() => handleContractClick(contract.ContractID)}
                >
                  <div>Name: {contract.ContractName}</div>
                  <div>Start Date: {formatDate(contract.StartDate)}</div>
                  <div>End Date: {formatDate(contract.EndDate)}</div>
                </div>
              ))}
            </div>
            <ContractRecords
              records={records}
              contractId={selectedContract}
              fetchRecordsByContract={fetchRecordsByContract}
            />
          </>
        )}
      </div>
    </>
  );
};

export default Contracts;

import { useEffect, useState } from 'react';
import './ContractRecords.css';
import ContractRecordsTable from '../ContractRecordsTable/ContractRecordsTable';
import CustomModal from '../../../../components/CustomModal/CustomModal';
import ReportForm from '../ReportForm/ReportForm';

const ContractRecords = ({ records, contractId, fetchRecordsByContract }) => {
    const [showModal, setShowModal] = useState(false);
    const [editReport, setEditReport] = useState(null);

    useEffect(() => {
        if (editReport) {
            handleClick();
        }
    }, [editReport]);

    const handleClick = () => {
        setShowModal(true);
    };

    const handleModalClose = () => {
        setShowModal(false);
        if (editReport) {
            setEditReport(null);
        }
    };

    return (
        <div className='contract-records'>
            {contractId && <button className="new-report-button" onClick={handleClick}>Add New Report</button>}
            {(records && records.length > 0) &&
                <ContractRecordsTable records={records} fetchRecordsByContract={fetchRecordsByContract} setEditReport={setEditReport} />
            }
            <CustomModal isOpen={showModal} onRequestClose={handleModalClose} contentLabel="Report Form" width='40%'>
                <ReportForm contractId={contractId} handleModalClose={handleModalClose} fetchRecordsByContract={fetchRecordsByContract} editReport={editReport} />
            </CustomModal>
        </div>
    )
};

export default ContractRecords;

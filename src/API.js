import axios from 'axios';
import * as XLSX from 'xlsx';
import { downloadExcel } from 'react-export-table-to-excel';

const apiKey = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsIng1dCI6Ik1ZR0FtX2hHeWRvYWhrSGtlcjRlaTRiTXRSUSIsImtpZCI6Ik1ZR0FtX2hHeWRvYWhrSGtlcjRlaTRiTXRSUSJ9.eyJpc3MiOiJUaXBheCIsImF1ZCI6IlRpcGF4L3Jlc291cmNlcyIsImV4cCI6MTczODU5NjQ0NywibmJmIjoxNjk5NzE2NDQ3LCJjbGllbnRfaWQiOiJUaXBheC1BUElVc2VyWG1vbnRoIiwic2NvcGUiOlsib3BlbmlkIiwicHJvZmlsZSIsInVzZXJfaW5mbyJdLCJzdWIiOiI4ZGViMGJlNi01OWE5LTQ2NzQtODg2ZC1kNTJlYTZhNDE1YzAiLCJhdXRoX3RpbWUiOjE2OTk3MTY0NDcsImlkcCI6Imlkc3J2IiwicHJpbWFyeV9zaWQiOiI4ZGViMGJlNi01OWE5LTQ2NzQtODg2ZC1kNTJlYTZhNDE1YzAiLCJ1cG4iOiI4ZGViMGJlNi01OWE5LTQ2NzQtODg2ZC1kNTJlYTZhNDE1YzAiLCJuYW1lIjoiOGRlYjBiZTYtNTlhOS00Njc0LTg4NmQtZDUyZWE2YTQxNWMwIiwiZ2l2ZW5fbmFtZSI6IjhkZWIwYmU2LTU5YTktNDY3NC04ODZkLWQ1MmVhNmE0MTVjMCIsImp0aSI6ImJjZmMzYjE4NTljNWQ2ODM2MWM5ZDA1ZjRlOWMyYTZmIiwiYW1yIjpbImN1c3RvbSJdfQ.Nmj0s0b3SpkzkSYNI0yngQe3zIdL9vMv07baVpVyPDBqpPH09z6ItFzCQD_JwUahnMYGhQ7o6861D39v2EPIlk41ce28sdveKqAam79G7axWmrGNKrysYEpGSVypqgYQDGu73Fx7OKfOQklUDpVUsVfwBHf8vSZAanv4SnxJaXj80d3UTldi7eWM9T3dDO9AxKGh1zLATIuH1t2z7WqsOeFovGX-Pgas4MSEv85Ot0-nEJbtwB0q1roO1-1IqHloYFB7ObufgU4yYGcOcueW1Xam_STddipuU5Hlz9wWC6gVbw3tGkBoBXq-5bnZ1UWLglhZNtsft7HvMTm0iuBwtQ'
function handleDownloadExcel(data, category, date) {
    const jsonDataset = data;
    const header = Object.keys(jsonDataset[0]);
    const body = Object.values(jsonDataset);
    downloadExcel({
        fileName: `${urls[category]} - ${date}`,
        sheet: "Sheet1",
        tablePayload: {
            header,
            body: body,
        },
    });
};
function handleDownloadExcel2(data, category, date) {
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
    XLSX.writeFile(workbook, `${urls[category]} - ${date}.xlsx`);
};
const urls = {
    'GetFinActCODReportData': 'گزارش روزانه COD',
    'GetFinActEkhtetamReportData': 'گزارش روزانه اختتام',
    'GetFinActPickupNewCommReportData': 'گزارش روزانه جمع آوری - مدل درآمدی جدید',
    'GetFinActDeliveryNewCommReportData': 'گزارش روزانه توزیع - مدل درآمدی جدید',
    'GetFinActPickupReportData': 'گزارش روزانه جمع آوری - مالی',
    'GetFinActDeliveryReportData': 'گزارش روزانه توزیع - مالی',
    'GetFinActReturnReportData': 'گزارش روزانه عودتی',
}
export async function getRequest(element, date, pdate) {
    return await axios({
        url: `http://jet.tipax.ir:200/odata/Tipax/ReportArgs/Tipax.${element}(mdate='${date}',branchid=00000000-0000-0000-0000-000000000000)`,
        method: "GET",
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${apiKey}`,
        },
        withCredentials: true,
    }).then(res => {
        console.log('Ok!')
        handleDownloadExcel2(res.data.value, element, pdate)
        return true;
    }).catch(err => {
        console.log('Error:', err)
        return false;
    });
};

export async function postRequest(date) {
    const res = await axios({
        url: 'http://jet.tipax.ir:200/odata/Tipax/DspDispatchInfoForSendToHubs/Tipax.GetCountOfParcelNotSendForhub',
        data: { branchid: '00000000-0000-0000-0000-000000000000' },
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${apiKey}`,
        },
        withCredentials: true,
    }).then(res => {
        console.log(res)
        return res.data.value
    }).catch(err => {
        console.log(err)
        return err
    });
};
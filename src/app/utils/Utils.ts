import moment from "moment";

function formatDate(dateString: any, formattedDateFormat:any) {
    return dateString ? moment(dateString).format(formattedDateFormat) : "";
}

export default {
    formatDate
}
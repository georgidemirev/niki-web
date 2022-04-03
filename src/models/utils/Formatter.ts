import { DateFormat, TimeFormat } from '../Types';

const months = {
    0: ['01', 'Jan', 'January'],
    1: ['02', 'Feb', 'February'],
    2: ['03', 'Mar', 'March'],
    3: ['04', 'Apr', 'April'],
    4: ['05', 'Mai', 'Mai'],
    5: ['06', 'Jun', 'June'],
    6: ['07', 'Jul', 'July'],
    7: ['08', 'Aug', 'August'],
    8: ['09', 'Sep', 'September'],
    9: ['10', 'Oct', 'October'],
    10: ['11', 'Nov', 'November'],
    11: ['12', 'Dec', 'December'],
};
class Formatter {
    formatDate = (_date: Date, format?: DateFormat) => {
        const date = `0${_date.getDate()}`.slice(-2);
        const month = _date.getMonth();
        const year = _date.getFullYear();
        if (!!date && !!month && !!year) {
            switch (format) {
                case 'yyyy-mm-dd':
                    return `${year}-${months[month][0]}-${date}`;
                case 'mmm dd yyyy':
                    return `${months[month][1]} ${date}, ${year}`;
                case 'dd mmm yyyy':
                    return `${date} ${months[month][1]} ${year}`;
                case 'dd.mm.yyyy':
                    return `${date}.${months[month][0]}.${year}`;
                default:
                    return `${date}.${months[month][0]}.${year}`; // dd.mm.yyyy
            }
        }
    };

    formatDateTime = (date: Date, timeFormat?: TimeFormat) => {
        if (date) {
            switch (timeFormat) {
                case 'hh:mm':
                    return `${date.getHours()}:${
                        date.getMinutes() < 10 ? '0' : ''
                    }${date.getMinutes()}`;
                default:
                    return `${date.getHours()}:${
                        date.getMinutes() < 10 ? '0' : ''
                    }${date.getMinutes()}`;
            }
        }
    };

    kFormatter(value: any) {
        return (
            Math.abs(value) > 999 ? `${(value / 1000).toFixed(1)}k` : value
        ).toString();
    }

    roundUpEngRate(doubleNum: number) {
        return (Math.round((doubleNum + Number.EPSILON) * 10) / 10).toString();
    }
}

const formatter = new Formatter();

export default formatter;

interface DateRange {
    startDate: string;
    endDate: string;
}

export class Campaign {
    title: string;

    start_date: string;

    end_date: string;

    dateRange: DateRange;

    hashtags: string[];

    target: string;

    mentions: string[];

    budget: string;

    objective: string;

    constructor() {
        this.title = '';
        this.start_date = '';
        this.end_date = '';
        this.dateRange = {
            startDate: '',
            endDate: '',
        };
        this.hashtags = [];
        this.target = '';
        this.mentions = [];
        this.budget = '';
        this.objective = '';
    }
}

import { Attachment } from './Attachment';

export class Comment {
    _id?: string;

    body: string;

    sender: any;

    date: string;

    attachments?: Attachment[];

    constructor() {
        this._id = '';
        this.body = '';
        this.date = '';
        this.attachments = [];
    }
}

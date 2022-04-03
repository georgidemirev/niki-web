import {
    Card,
    Hbox,
    TextArea,
    TextField,
    Vbox,
    _Button as Button,
} from 'components/common';
import { APP_CONFIG } from 'config';
import { action, observable } from 'mobx';
import { observer } from 'mobx-react';
import { Creative } from 'models/classes';
import Formatter from 'models/utils/Formatter';
import React from 'react';
import { Calendar } from 'react-date-range';
import { withTranslation } from 'react-i18next';
import { withRouter } from 'react-router-dom';
import { store } from 'state/Store';

interface EditCreativeProps {
    history: any;
    match: any;
    location: any;
    staticContext: any;
    i18n: any;
    t(key, opts?): any;
}

@observer
class EditCreative extends React.Component<EditCreativeProps> {
    dateFieldRef = React.createRef<HTMLDivElement>();

    calendarRef = React.createRef<HTMLDivElement>();
    // editCreativeContainerRef = React.createRef<Vbox>()

    @observable uploadDate;

    @observable showDatePicker = false;

    @observable hashtags = '';

    @observable mentions = '';

    @observable postCaption = '';

    @observable notes = '';

    @observable file: any = null;

    @observable fileUrl = '';

    @observable campaignId;

    @observable creative;

    toggleDatePicker = () => {
        this.showDatePicker = !this.showDatePicker;
    };

    // Calculate the y position of the text field
    get left() {
        if (this.dateFieldRef.current) {
            return this.dateFieldRef.current?.offsetLeft - 1;
        }
        return 'auto';
    }

    // Calculate the x position of the TextField
    get top() {
        if (
            this.dateFieldRef.current?.children[1].children[0].getBoundingClientRect()
        ) {
            return this.dateFieldRef.current?.offsetTop; // + this.dateFieldRef.current?.offsetHeight - this.dateFieldRef.current?.children[1].children[0].getBoundingClientRect().height
        }
        return 'auto';
    }

    @action
    setUploadDate = (date) => {
        this.uploadDate = date;
        this.toggleDatePicker();
    };

    get creativeDate() {
        if (this.creative?.post_date) {
            const date = Formatter.formatDate(
                new Date(this.creative.post_date),
                'dd mmm yyyy'
            );
            return `${date}`;
        }
        return '';
    }

    get creativeHashtags() {
        let hashtagsStr = '';
        if (this.creative?.hashtags) {
            this.creative?.hashtags.forEach((hashtag) => {
                hashtagsStr += ` ${hashtag}`;
            });
        } else hashtagsStr = '-';

        return hashtagsStr;
    }

    get creativeMentions() {
        let mentionsStr = '';
        if (this.creative?.mentions) {
            this.creative?.mentions.forEach((mention) => {
                mentionsStr += ` ${mention}`;
            });
        }
        return mentionsStr;
    }

    loadData = async () => {
        // todo: check role and call the right endpoint
        this.creative = await store.campaignStore.loadInfluencerCreative(
            this.campaignId,
            this.props.match.params.creative_id
        );
        store.isFetching = false;
    };

    editCreative = async () => {
        store.isFetching = true;
        const newCreative = new Creative();
        newCreative.post_date = this.uploadDate
            ? Formatter.formatDate(new Date(this.uploadDate), 'yyyy-mm-dd')
            : this.creative?.post_date;
        newCreative.post_text = this.postCaption
            ? this.postCaption
            : this.creative?.post_text;
        newCreative.hashtags = this.hashtags
            ? this.hashtags.split(' ')
            : this.creative?.hashtags;
        newCreative.mentions = this.mentions
            ? this.mentions.split(' ')
            : this.creative?.mentions;
        newCreative.notes = this.notes ? this.notes : this.creative?.notes;

        await store.campaignStore.updateCreative(
            newCreative,
            this.campaignId,
            this.props.match.params.creative_id,
            this.file
        );

        const { params } = this.props.match;
        params.campaign_id = this.campaignId;
        this.props.history.push(`/creative/${params.creative_id}`, { params });
    };

    uploadHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (!event.target.files) {
            return;
        }
        this.file = event.target.files[0];
        this.fileUrl = URL.createObjectURL(this.file);
    };

    componentDidMount() {
        const { params } = this.props.location.state;
        this.campaignId = params.campaign_id;
        store.isFetching = true;
        this.loadData();
    }

    render() {
        const { t } = this.props;
        return (
            <Vbox
                fullwidth
                borderbox
                className="App-Content_wrapper card-centered gradient-container gradient-row-55"
            >
                <Vbox
                    className="upload-form"
                    style={{ marginTop: '2vh', width: '60%' }}
                >
                    <span className="title bold">
                        {' '}
                        {t('creatives_upload_edit.edit_creative')}
                    </span>
                    <Card fullwidth borderbox style={{ marginTop: '2vh' }}>
                        <Hbox fullwidth borderbox className="" valign="stretch">
                            <Vbox
                                className="image-upload"
                                style={{ width: '49%' }}
                                align="stretch"
                                valign="between"
                            >
                                <Hbox fullwidth>
                                    <span className="label">
                                        {t(
                                            'creatives_upload_edit.upload_asset'
                                        )}
                                    </span>
                                </Hbox>
                                <Vbox
                                    className=""
                                    style={{
                                        border: '1px solid #3C3F44',
                                        borderStyle: 'dashed',
                                        height: '52vh',
                                        width: '20vw',
                                    }}
                                    valign="center"
                                    align="center"
                                >
                                    <Vbox
                                        valign="center"
                                        style={{
                                            opacity: 0.6,
                                            marginTop: '2vh',
                                        }}
                                    >
                                        <input
                                            type="file"
                                            name="post_file"
                                            onChange={this.uploadHandler}
                                        />
                                        <img
                                            style={{
                                                maxWidth: '25vw',
                                                height: '25vh',
                                                borderRadius: '8px',
                                                marginBottom: '5vh',
                                            }}
                                            src={
                                                this.fileUrl === ''
                                                    ? `${APP_CONFIG.BASE_URL}/static/${this.campaignId}/${this.creative?.post_file}`
                                                    : this.fileUrl
                                            }
                                            className="responsive_img"
                                        />
                                        <span className="text light">
                                            {t(
                                                'creatives_upload_edit.best_sizes'
                                            )}
                                        </span>
                                        <span className="text light">
                                            {t('creatives_upload_edit.square')}
                                        </span>
                                        <span className="text light">
                                            {t(
                                                'creatives_upload_edit.portrait'
                                            )}
                                        </span>
                                        <span className="text light">
                                            {t(
                                                'creatives_upload_edit.landscape'
                                            )}
                                        </span>
                                    </Vbox>
                                </Vbox>
                            </Vbox>
                            <Vbox
                                className="creative-form"
                                style={{ width: '49%' }}
                            >
                                <TextField
                                    ref={this.dateFieldRef}
                                    value={
                                        this.uploadDate
                                            ? Formatter.formatDate(
                                                  this.uploadDate
                                              )
                                            : this.creativeDate
                                    }
                                    label={t('creatives_upload_edit.post_date')}
                                    placeholder={t(
                                        'creatives_upload_edit.choose_date'
                                    )}
                                    onClick={() => this.toggleDatePicker()}
                                />
                                <div
                                    ref={this.calendarRef}
                                    style={{
                                        display: this.showDatePicker
                                            ? 'block'
                                            : 'none',
                                        position: 'absolute',
                                        zIndex: 1,
                                        left: this.left,
                                        top: this.top,
                                    }}
                                >
                                    <Calendar
                                        date={this.uploadDate}
                                        onChange={(date) =>
                                            this.setUploadDate(date)
                                        }
                                    />
                                </div>

                                <TextField
                                    fullwidth
                                    value={
                                        this.hashtags === ''
                                            ? this.creativeHashtags
                                            : this.hashtags
                                    }
                                    label={t('creatives_upload_edit.hashtags')}
                                    placeholder={t(
                                        'creatives_upload_edit.hashtags_placeholder'
                                    )}
                                    onChange={(event) =>
                                        (this.hashtags = event.target.value)
                                    }
                                />
                                <TextField
                                    fullwidth
                                    value={
                                        this.mentions === ''
                                            ? this.creativeMentions
                                            : this.mentions
                                    }
                                    label={t('creatives_upload_edit.mentions')}
                                    placeholder={t(
                                        'creatives_upload_edit.mentions_placeholder'
                                    )}
                                    onChange={(event) =>
                                        (this.mentions = event.target.value)
                                    }
                                />
                                <TextArea
                                    label={t(
                                        'creatives_upload_edit.post_caption'
                                    )}
                                    value={
                                        this.postCaption === ''
                                            ? this.creative?.post_text
                                            : this.postCaption
                                    }
                                    containerStyle={{
                                        marginTop: '1vh',
                                        width: '100%',
                                    }}
                                    placeholder={t(
                                        'creatives_upload_edit.caption_placeholder'
                                    )}
                                    style={{ minHeight: '5vh', padding: '1vw' }}
                                    onChange={(event) =>
                                        (this.postCaption = event.target.value)
                                    }
                                    rows={2}
                                    maxLength={300}
                                />

                                <TextArea
                                    label={t('creatives_upload_edit.notes')}
                                    value={
                                        this.notes === ''
                                            ? this.creative?.notes
                                            : this.notes
                                    }
                                    containerStyle={{
                                        marginTop: '2vh',
                                        width: '100%',
                                    }}
                                    placeholder={t(
                                        'creatives_upload_edit.notes_placeholder'
                                    )}
                                    style={{ minHeight: '5vh', padding: '1vw' }}
                                    onChange={(event) =>
                                        (this.notes = event.target.value)
                                    }
                                    rows={2}
                                    maxLength={300}
                                />
                                <Hbox
                                    fullwidth
                                    borderbox
                                    align="right"
                                    style={{ marginTop: '2vh' }}
                                >
                                    <Button
                                        text={t(
                                            'creatives_upload_edit.update_creative'
                                        )}
                                        onClick={() => this.editCreative()}
                                    />
                                </Hbox>
                            </Vbox>
                        </Hbox>
                    </Card>
                </Vbox>
            </Vbox>
        );
    }
}

const wrapped = withRouter(EditCreative);

export default withTranslation()(wrapped);

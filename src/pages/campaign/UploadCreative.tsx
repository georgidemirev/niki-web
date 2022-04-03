import {
    Card,
    Hbox,
    TextArea,
    TextField,
    Vbox,
    VBox,
    _Button as Button,
} from 'components/common';
import { action, observable } from 'mobx';
import { observer } from 'mobx-react';
import { Creative } from 'models/classes';
import { NaviProps } from 'models/interfaces';
import Formatter from 'models/utils/Formatter';
import React from 'react';
import { Calendar } from 'react-date-range';
import { withTranslation } from 'react-i18next';
import { withRouter } from 'react-router-dom';
import { store } from 'state/Store';
import './styles/UploadCreative.css';

interface Props {
    className?: string;
    containerStyle?: any;
    i18n: any;
    t(key, opts?): any;
}

@observer
class UploadCreative extends React.Component<Props & NaviProps> {
    dateFieldRef = React.createRef<HTMLDivElement>();

    calendarRef = React.createRef<HTMLDivElement>();

    uploadCreativeContainerRef = React.createRef<VBox>();

    @observable uploadDate;

    @observable showDatePicker = false;

    @observable hashtags = '';

    @observable mentions = '';

    @observable postCaption = '';

    @observable notes = '';

    @observable file: any = null;

    @observable fileUrl = '';

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

    uploadCreative = async () => {
        store.isFetching = true;
        const newCreative = new Creative();
        newCreative.post_date =
            Formatter.formatDate(new Date(this.uploadDate), 'yyyy-mm-dd') ?? '';
        newCreative.post_text = this.postCaption;
        newCreative.hashtags = this.hashtags.split(' ');
        newCreative.mentions = this.mentions.split(' ');
        newCreative.notes = this.notes;

        store.isFetching = false;
    };

    uploadHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (!event.target.files) {
            return;
        }
        this.file = event.target.files[0];
        this.fileUrl = URL.createObjectURL(this.file);
    };

    render() {
        const { t } = this.props;
        return (
            <VBox
                borderbox
                className={`${this.props?.className} upload-creative-card__container`}
                style={{
                    ...this.props?.containerStyle,
                }} /* ref={this.uploadCreativeContainerRef} */
            >
                <span className="subtitle bold">
                    {t('creatives_upload_edit.upload_asset')}
                </span>
                <Card fullwidth borderbox className="upload-catetive__card">
                    <div className="upload-card__subcontaier">
                        <Vbox
                            className="image-upload"
                            align="stretch"
                            valign="between"
                        >
                            <Hbox fullwidth>
                                <span className="label">
                                    {t('creatives_upload_edit.upload_asset')}
                                </span>
                            </Hbox>
                            <Vbox
                                borderbox
                                className="dashed__container"
                                valign="center"
                                align="center"
                            >
                                <Vbox
                                    className="image__container"
                                    valign="center"
                                >
                                    <input
                                        type="file"
                                        name="post_file"
                                        onChange={this.uploadHandler}
                                        style={{ marginBottom: '3.7%' }}
                                    />

                                    {this.fileUrl && (
                                        <img
                                            src={this.fileUrl}
                                            className="responsive_img"
                                        />
                                    )}
                                    <VBox
                                        fullwidth
                                        borderbox
                                        style={{ marginTop: '3.7%' }}
                                    >
                                        <span className="text bright">
                                            {t(
                                                'creatives_upload_edit.best_sizes'
                                            )}
                                        </span>
                                        <span className="text bright">
                                            {t('creatives_upload_edit.square')}
                                        </span>
                                        <span className="text bright">
                                            {t(
                                                'creatives_upload_edit.portrait'
                                            )}
                                        </span>
                                        <span className="text bright">
                                            {t(
                                                'creatives_upload_edit.landscape'
                                            )}
                                        </span>
                                    </VBox>
                                </Vbox>
                            </Vbox>
                        </Vbox>

                        <Vbox
                            className="creative__form"
                            style={{ marginTop: '3.7%' }}
                        >
                            <TextField
                                ref={this.dateFieldRef}
                                value={
                                    this.uploadDate
                                        ? Formatter.formatDate(this.uploadDate)
                                        : ''
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
                                value={this.hashtags}
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
                                value={this.mentions}
                                label={t('creatives_upload_edit.mentions')}
                                placeholder={t(
                                    'creatives_upload_edit.mentions_placeholder'
                                )}
                                onChange={(event) =>
                                    (this.mentions = event.target.value)
                                }
                            />
                            <TextArea
                                label={t('creatives_upload_edit.post_caption')}
                                value={this.postCaption}
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
                                value={this.notes}
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
                                        'creatives_upload_edit.upload_asset'
                                    )}
                                    onClick={() => this.uploadCreative()}
                                />
                            </Hbox>
                        </Vbox>
                    </div>
                </Card>
            </VBox>
        );
    }
}

const wrapped = withRouter(UploadCreative);

export default withTranslation()(wrapped);

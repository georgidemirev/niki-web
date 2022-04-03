import {
    Card,
    DropDownOutlined,
    HBox,
    Hbox,
    TextField,
    _Button as Button,
} from 'components/common';
import { action, observable } from 'mobx';
import { observer } from 'mobx-react';
import { Campaign } from 'models/classes';
import Formatter from 'models/utils/Formatter';
import React from 'react';
import { DateRange } from 'react-date-range';
import 'react-date-range/dist/styles.css'; // main style file
import 'react-date-range/dist/theme/default.css'; // theme css file
import { store } from 'state/Store';
import './styles.css';
import { withTranslation } from 'react-i18next';
import { withRouter } from 'react-router-dom';

interface Props {
    history: any;
    match: any;
    lcation: any;
    staticContext: any;
    i18n: any;
    t(key, opts?): any;
}

@observer
export class EditCampaignView extends React.Component<Props> {
    dateFieldRef = React.createRef<HTMLDivElement>();
    // pickerRef = React.createRef<HTMLDivElement>()

    @observable campaign: Campaign | undefined = undefined; // store.campaignStore.currentCampaign;

    campaignId: any;

    @observable selectionRange = {
        startDate: new Date(),
        endDate: new Date(),
        key: 'selection',
        start: true,
        end: false,
    };

    @observable campaignName = '';

    @observable dateRange = { startDate: '', endDate: '' };

    @observable hashTags = '';

    @observable objective:
        | 'Brand Awareness'
        | 'Conversions'
        | 'Consideration'
        | string = 'Brand Awareness';

    @observable mentions = '';

    @observable budget = '';

    @observable errorMessage = '';

    @observable showDatePicker = false;

    @action
    setDateRange = (selection) => {
        if (this.selectionRange.end) {
            this.selectionRange = selection;
            this.dateRange.startDate =
                this.selectionRange.startDate.toDateString();
            this.dateRange.endDate = this.selectionRange.endDate.toDateString();
            this.selectionRange.end = false;
            this.toggleDatePicker();
        } else {
            this.selectionRange = selection;
            this.selectionRange.end = true;
        }

        // this.dateRange = selection
    };

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
            return (
                this.dateFieldRef.current?.offsetTop +
                this.dateFieldRef.current?.offsetHeight -
                this.dateFieldRef.current?.children[1].children[0].getBoundingClientRect()
                    .height
            );
        }
        return 'auto';
    }

    updateCampaign = async () => {
        const { t } = this.props;
        if (
            !this.campaignName ||
            !this.dateRange ||
            !this.hashTags ||
            !this.mentions ||
            !this.budget
        ) {
            this.errorMessage = `${t('create_campaign.error_message')}`;
        } else {
            this.errorMessage = '';
        }
        if (!this.errorMessage) {
            store.isFetching = true;
            const newCampaign = new Campaign();
            newCampaign.title = this.campaignName;
            newCampaign.dateRange = this.dateRange;
            newCampaign.hashtags = this.hashTags.split(' ');
            newCampaign.target = this.objective;
            newCampaign.mentions = this.mentions.split(' ');
            newCampaign.budget = this.budget;

            await store.campaignStore.updateCampaign(
                newCampaign,
                this.campaignId
            );
            store.isFetching = false;
            this.props.history.push('/home/dashboard');
        }
    };

    setTitle() {
        let title = '';
        if (this.campaign?.title) {
            title = this.campaign.title;
        } else title = '';
        this.campaignName = title;
    }

    setDate() {
        if (!!this.campaign?.start_date && this.campaign.end_date) {
            this.dateRange = {
                startDate: this.campaign?.start_date,
                endDate: this.campaign?.end_date,
            };
        }
    }

    setObjective() {
        let objective:
            | 'Brand Awareness'
            | 'Conversions'
            | 'Consideration'
            | string = 'Brand Awareness';
        if (this.campaign?.target) {
            objective = this.campaign.target;
        } else objective = '';
        this.objective = objective;
    }

    setMentions() {
        let mentionsStr = '';
        if (this.campaign?.mentions) {
            this.campaign?.mentions.forEach((mention) => {
                mentionsStr += ` ${mention}`;
            });
        } else mentionsStr = '-';
        this.mentions = mentionsStr;
    }

    setHashtags() {
        let hashtagsStr = '';
        if (this.campaign?.hashtags) {
            this.campaign?.hashtags.forEach((hashtag) => {
                hashtagsStr += ` ${hashtag}`;
            });
        } else hashtagsStr = '-';
        this.hashTags = hashtagsStr;
    }

    setBudget() {
        let budgetStr = '';
        if (this.campaign?.budget) {
            budgetStr = this.campaign.budget;
        } else budgetStr = '';
        this.budget = budgetStr;
    }

    loadData = async () => {
        this.campaignId = this.props.match.params.campaign_id;
        this.campaign = await store.campaignStore.loadCampaign(this.campaignId);
        this.setTitle();
        this.setDate();
        this.setHashtags();
        this.setMentions();
        this.setBudget();
        this.setObjective();
        store.isFetching = false;
    };

    componentDidMount() {
        store.isFetching = true;
        this.loadData();
    }

    get campaignDate() {
        const start = Formatter.formatDate(
            new Date(this.dateRange.startDate),
            'dd mmm yyyy'
        );
        const end = Formatter.formatDate(
            new Date(this.dateRange.endDate),
            'dd mmm yyyy'
        );
        return `${start} - ${end} `;
    }

    render() {
        const { t } = this.props;
        return (
            <div className="App-Content_wrapper card-centered gradient-container">
                <Card className="create-campaign__card">
                    <span className="title bold gradient">
                        {t('create_campaign.edit_campaign')}{' '}
                    </span>

                    <Hbox
                        style={{ width: '100%', marginTop: '7%' }}
                        align="between"
                    >
                        <TextField
                            style={styles.textfield}
                            value={this.campaignName}
                            className={
                                !this.campaignName && !!this.errorMessage
                                    ? 'errorField'
                                    : ''
                            }
                            label={t('create_campaign.campaign_name')}
                            placeholder=""
                            onChange={(event) =>
                                (this.campaignName = event.target.value)
                            }
                        />
                        <TextField
                            ref={this.dateFieldRef}
                            style={styles.textfield}
                            value={this.campaignDate}
                            className={`${
                                !this.dateRange && !!this.errorMessage
                                    ? 'errorField'
                                    : ''
                            }`}
                            label={t('create_campaign.tracking_dates')}
                            placeholder=""
                            onClick={() => this.toggleDatePicker()}
                        />
                        <div
                            // ref={this.pickerRef}
                            style={{
                                display: this.showDatePicker ? 'block' : 'none',
                                position: 'absolute',
                                zIndex: 1,
                                left: this.left,
                                top: this.top,
                            }}
                        >
                            <DateRange
                                rangeColors={['#8d06ff']}
                                // scroll={{ enabled: true }}
                                moveRangeOnFirstSelection
                                editableDateInputs
                                showMonthAndYearPickers={false}
                                ranges={[this.selectionRange]}
                                onChange={(item) =>
                                    this.setDateRange(item.selection)
                                }
                            />
                        </div>
                    </Hbox>

                    <HBox
                        style={{ width: '100%', marginTop: '1vh' }}
                        align="between"
                        valign="bottom"
                    >
                        {/* <TextField style={styles.textfield} value={this.hashTags} className={!this.hashTags && !!this.errorMessage ? 'errorField' : ''} label='Hashtags' placeholder='example: #influencermarketing' onChange={(event) => this.hashTags = event.target.value} /> */}
                        <DropDownOutlined
                            label={t('create_campaign.objective_title')}
                            labelId="objective"
                            menuItems={[
                                {
                                    value: 'Brand Awareness',
                                    text: this.props.t(
                                        'create_campaign.objective.brandAwareness'
                                    ),
                                },
                                {
                                    value: 'Conversions',
                                    text: this.props.t(
                                        'create_campaign.objective.conversions'
                                    ),
                                },
                                {
                                    value: 'Consideration',
                                    text: this.props.t(
                                        'create_campaign.objective.consideration'
                                    ),
                                },
                            ]}
                            value={this.objective}
                            onChange={(event) =>
                                (this.objective = event.target.value)
                            }
                        />

                        <TextField
                            style={styles.textfield}
                            value={this.budget}
                            className={
                                !this.budget && !!this.errorMessage
                                    ? 'errorField'
                                    : ''
                            }
                            label={t('create_campaign.budget')}
                            placeholder={t(
                                'create_campaign.budget_placeholder'
                            )}
                            onChange={(event) =>
                                (this.budget = event.target.value)
                            }
                        />
                    </HBox>
                    {/*
          <HBox style={{ width: '100%', marginTop: '1vh' }} align='between'>
            <TextField style={styles.textfield} value={this.mentions} className={!this.mentions && !!this.errorMessage ? 'errorField' : ''} label='Mentions' placeholder='' onChange={(event) => this.mentions = event.target.value} />
            <TextField style={styles.textfield} value={this.budget} className={!this.budget && !!this.errorMessage ? 'errorField' : ''} label='Budget' placeholder='' onChange={(event) => this.budget = event.target.value} />
          </HBox> */}

                    <HBox
                        style={{ width: '100%', marginTop: '7%' }}
                        align="right"
                    >
                        <Button
                            text={t('create_campaign.update_campaign')}
                            onClick={() => this.updateCampaign()}
                        />
                    </HBox>
                </Card>
            </div>
        );
    }
}

const wrapped = withRouter(EditCampaignView);

export default withTranslation()(wrapped);

const styles = {
    textfield: {
        maxWidth: '48%',
    },
};

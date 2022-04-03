import {
    Card,
    DropDownOutlined,
    HBox,
    Hbox,
    TextField,
    VBox,
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
class CreateCampaignView extends React.Component<Props> {
    dateFieldRef = React.createRef<HTMLDivElement>();
    // pickerRef = React.createRef<HTMLDivElement>()

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

    @observable objective;

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

    createCampaign = async () => {
        // todo: remove hashtags and mentions from 'create campaign'
        this.hashTags = 'empty';
        this.mentions = 'empty';
        if (
            !this.campaignName ||
            !this.dateRange ||
            !this.hashTags ||
            !this.mentions ||
            !this.budget
        ) {
            this.errorMessage = 'Please fill up all fields';
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
            const campaignId = await store.campaignStore.createCampaign(
                newCampaign
            );
            store.isFetching = false;
            // this.props.history.push('/create-campaign/add-influencers', { campaignId: campaignId })
            this.props.history.push('/create-campaign/brief/default', {
                campaignId,
            });
        }
    };

    render() {
        const { t } = this.props;
        return (
            <div className="App-Content_wrapper card-centered create-campaign gradient-container">
                <Card className="create-campaign__card">
                    <span className="title bold gradient">
                        {t('create_campaign.create_campaign')}
                    </span>

                    <VBox
                        fullwidth
                        borderbox
                        align="center"
                        style={{ marginTop: '3.7%' }}
                    >
                        <Hbox style={{ width: '100%' }} align="between">
                            <TextField
                                style={styles.textfield}
                                className={
                                    !this.campaignName && !!this.errorMessage
                                        ? 'errorField'
                                        : ''
                                }
                                label={t('create_campaign.campaign_name')}
                                placeholder={t(
                                    'create_campaign.name_placeholder'
                                )}
                                onChange={(event) =>
                                    (this.campaignName = event.target.value)
                                }
                            />
                            <TextField
                                ref={this.dateFieldRef}
                                style={styles.textfield}
                                value={
                                    this.dateRange.startDate
                                        ? `${Formatter.formatDate(
                                              new Date(this.dateRange.startDate)
                                          )} - ${Formatter.formatDate(
                                              new Date(this.dateRange.endDate)
                                          )}`
                                        : ''
                                }
                                className={`${
                                    !this.dateRange && !!this.errorMessage
                                        ? 'errorField'
                                        : ''
                                }`}
                                label={t('create_campaign.tracking_dates')}
                                placeholder={t('create_campaign.date_range')}
                                onClick={() => this.toggleDatePicker()}
                            />

                            <div
                                className="dateRange-wrap"
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
                            className=""
                            style={{ width: '100%', marginTop: '3.7%' }}
                            align="between"
                            valign="bottom"
                        >
                            {/* <TextField
								style={styles.textfield}
								className={!this.hashTags && !!this.errorMessage ? 'errorField' : ''}
								label='Hashtags'
								placeholder='example: #influencermarketing'
								onChange={(event) => this.hashTags = event.target.value}
							/> */}
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
                        <HBox
                            style={{ width: '100%', marginTop: '3.7%' }}
                            align="right"
                        >
                            <Button
                                text={t('create_campaign.create_campaign')}
                                onClick={() => this.createCampaign()}
                            />
                        </HBox>
                    </VBox>
                </Card>
            </div>
        );
    }
}

const wrapped = withRouter(CreateCampaignView);

export default withTranslation()(wrapped);

const styles = {
    textfield: {
        maxWidth: '48%',
    },
};

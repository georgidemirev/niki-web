import { FadeIn, Icon, IconTypes } from 'components/common';
import { action } from 'mobx';
import { observer } from 'mobx-react';
import { ROLE } from 'models/Enum';
import Formatter from 'models/utils/Formatter';
import React from 'react';
import { withTranslation } from 'react-i18next';
import { withRouter } from 'react-router-dom';
import { store } from 'state/Store';
import './CampaignsTable.css';
import DropDownTable from './DropDownTable';

interface TableProps {
    data: any;
    history: any;
    match: any;
    // location: any,
    staticContext: any;
    onDeleteCampaign(id): void;
    i18n: any;
    t(key, opts?): any;
}

@observer
class CampaignsTable extends React.Component<TableProps> {
    @action
    redirectTo = async (path, campaign) => {
        this.props.history.push(path, {
            campaign: {
                id: campaign._id,
                title: campaign.title,
                start: campaign.start_date,
                end: campaign.end_date,
            },
        });
    };

    @action deleteCampaign = (campaignId) => {
        store.campaignStore.deleteCampaign(campaignId);
        this.props.onDeleteCampaign(campaignId);
    };

    dateRange = (start, end) => {
        const startDate = Formatter.formatDate(new Date(start), 'mmm dd yyyy');
        const endDate = Formatter.formatDate(new Date(end), 'mmm dd yyyy');

        return `${startDate} - ${endDate}`;
    };

    getInfluencerData = (campaignId, infleuncerId) => {
        return this.props.data
            .find((campaign) => campaign._id === campaignId)
            .influencers?.find(
                (influencer) => influencer.influencer === infleuncerId
            );
    };

    numOfInfluencers(campaignId) {
        return this.props.data.find((campaign) => campaign._id === campaignId)
            .influencers?.length;
    }

    calculateCampaignPosts(campaignId) {
        let numOfPosts = 0;
        for (const influencer of this.props.data.find(
            (campaign) => campaign._id === campaignId
        ).influencers) {
            numOfPosts += influencer.n_posts;
        }
        return numOfPosts;
    }

    calculateCampaignStories(campaignId) {
        let numOfStories = 0;
        for (const influencer of this.props.data.find(
            (campaign) => campaign._id === campaignId
        ).influencers) {
            numOfStories += influencer.n_stories;
        }
        return numOfStories;
    }

    calculateCampaignVideos(campaignId) {
        let numOfVideos = 0;
        for (const influencer of this.props.data.find(
            (campaign) => campaign._id === campaignId
        ).influencers) {
            numOfVideos += influencer.n_videos;
        }
        return numOfVideos;
    }

    redirectUrl(campaignId) {
        return store.userRole === 'influencer'
            ? `/campaign/${campaignId}/${
                  this.getInfluencerData(campaignId, store.user.user?._id)._id
              }`
            : `/campaign/${campaignId}`;
    }

    getInfluencerInfo = (campaign) => {
        return store?.userRole === 'influencer'
            ? this.getInfluencerData(campaign._id, store.user?.user?._id).status
            : this.numOfInfluencers(campaign._id);
    };

    getPostN = (campaign) => {
        return store?.userRole === 'influencer'
            ? this.getInfluencerData(campaign._id, store.user?.user?._id)
                  ?.n_posts
            : this.calculateCampaignPosts(campaign._id);
    };

    getStoriesN = (campaign) => {
        return this.calculateCampaignStories(campaign._id).toString();
    };

    getVideosN = (campaign) => {
        return store?.userRole === 'influencer'
            ? this.getInfluencerData(campaign._id, store.user?.user?._id)
                  ?.n_videos ?? 0
            : this.calculateCampaignVideos(campaign._id);
    };

    get tableHeadColumns() {
        const { t } = this.props;
        const defaultColumns = [
            t('dashboard.title'),
            t('dashboard.date_range'),
            t('dashboard.objectiveTitle'),
            t('dashboard.influencers'),
            t('dashboard.posts'),
            t('dashboard.stories'),
            t('dashboard.videos'),
        ];
        if (store?.userRole === 'manager')
            return [...defaultColumns, t('dashboard.budget')];
        return defaultColumns;
    }

    redirectToCampaign = (item) =>
        this.redirectTo(this.redirectUrl(item._id), item);

    render() {
        const { t } = this.props;

        return (
            <div className="CampaignTable">
                <TableHead columns={[...this.tableHeadColumns, '']} />
                <div className="campaign-table">
                    {this.props.data.map((item, index) => (
                        <div key={index} className="table-row">
                            <div className="mobile campaign-title__div">
                                <span className="title bold">{item.title}</span>
                                <TableDataIcon
                                    icon={IconTypes.more_dots}
                                    onPressIcon={() =>
                                        this.redirectTo(
                                            `/campaign/${item._id}/edit`,
                                            item
                                        )
                                    }
                                />
                            </div>
                            <TableRow>
                                <div
                                    className="data-container__div"
                                    onClick={() =>
                                        this.redirectTo(
                                            this.redirectUrl(item._id),
                                            item
                                        )
                                    }
                                >
                                    <TableData
                                        className="web"
                                        mobileHead={t('dashboard.title')}
                                        rowData={item.title}
                                    />
                                    <TableData
                                        mobileHead={t('dashboard.date_range')}
                                        rowData={this.dateRange(
                                            item.start_date,
                                            item.end_date
                                        )}
                                    />
                                    <TableData
                                        mobileHead={t(
                                            'dashboard.objectiveTitle'
                                        )}
                                        rowData={item.target}
                                    />
                                    <TableData
                                        mobileHead={
                                            store?.userRole === 'influencer'
                                                ? 'Status'
                                                : 'Influencers'
                                        }
                                        rowData={this.getInfluencerInfo(item)}
                                    />
                                    <TableData
                                        mobileHead={t('dashboard.posts')}
                                        rowData={this.getPostN(item)}
                                    />
                                    <TableData
                                        mobileHead={t('dashboard.stories')}
                                        rowData={this.getStoriesN(item)}
                                    />
                                    <TableData
                                        mobileHead={t('dashboard.videos')}
                                        rowData={this.getVideosN(item) ?? 0}
                                    />
                                    {!(store?.userRole === 'influencer') && (
                                        <TableData
                                            mobileHead={t('dashboard.budget')}
                                            rowData={item.budget}
                                        />
                                    )}
                                </div>
                                {store.userRole === ROLE.MANAGER && (
                                    <DropDownTable
                                        redirect={() =>
                                            this.redirectTo(
                                                `/campaign/${item._id}/edit`,
                                                item
                                            )
                                        }
                                        delete={() =>
                                            this.deleteCampaign(item._id)
                                        }
                                    />
                                )}
                            </TableRow>
                        </div>
                    ))}
                </div>
            </div>
        );
    }
}

interface TableHeadProps {
    columns: string[];
}
function TableHead(props: TableHeadProps) {
    return (
        <div className="table-head row web">
            {props.columns.map((th, index) => (
                <span key={index} className="label bright">
                    {th}
                </span>
            ))}
        </div>
    );
}

interface TableRowProps {
    children: any;
    onClick?(): void;
}
function TableRow(props: TableRowProps) {
    return (
        <div className="campaign-data" onClick={props.onClick}>
            {props.children}
        </div>
    );
}

interface TableDataProps {
    mobileHead: string;
    rowData: string;
    className?: string;
    rowDataIcon?: any;
    onPressRow?(): void;
}
function TableData(props: TableDataProps) {
    return (
        <div
            className={`${props.className ?? ''} row-data`}
            onClick={props.onPressRow}
        >
            <span className="table-hd mobile subtitle bold bright">
                {props.mobileHead}
            </span>
            <span className="table-td label">{props.rowData?.toString()}</span>
        </div>
    );
}

interface TableDataIconProps {
    icon: string;
    className?: string;
    onPressIcon?(): void;
    onClick?(): void;
}

function TableDataIcon(props: TableDataIconProps) {
    return (
        <div className={`${props.className ?? ''}`}>
            <FadeIn onPress={props.onPressIcon}>
                <Icon
                    icon={props.icon}
                    open={props.onClick}
                    size={20}
                    style={{ cursor: 'pointer' }}
                />
            </FadeIn>
        </div>
    );
}

const wrapped = withRouter(CampaignsTable);

export default withTranslation()(wrapped);

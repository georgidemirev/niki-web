import { Avatar, Drawer } from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import {
    Card,
    Hbox,
    HBox,
    Messenger,
    Status,
    VBox,
    Vbox,
    _Button as Button,
} from 'components/common';
import { Box } from 'components/common/Box_';
import { ReadMore } from 'components/ReadMore';
import { action, observable } from 'mobx';
import { observer } from 'mobx-react';
import { Campaign, Influencer, Post, Story } from 'models/interfaces';
import Formatter from 'models/utils/Formatter';
import React from 'react';
import { withTranslation } from 'react-i18next';
import { store } from 'state/Store';
import { withRouter } from 'react-router-dom';
import Creatives from './Creatives';
// import CreativesView from '../CreativesView'
// import UploadCreative from '../UploadCreative'
import './styles/BriefDetailView.css';

interface Props {
    history: any;
    match: any;
    staticContext: any;
    i18n: any;
    t(key, opts?): any;
}

@observer
class BriefDetailView extends React.Component<Props> {
    @observable commentSectionsIsOpened = false;

    @observable influencer: Influencer | undefined = undefined;

    @observable creatives?: any[];

    @observable campaign: Campaign | undefined = undefined;

    @observable showCreatives = true;

    @observable isLoading;

    @action
    toggleCommentSection() {
        this.commentSectionsIsOpened = !this.commentSectionsIsOpened;
    }

    @action
    submitDecision = async (decision: string) => {
        store.isFetching = true;

        const campaignId = this.props.match.params.campaign_id;
        const invitationToken = this.props.match.params.invitation_token;

        if (this.influencer?.influencer) {
            await store.campaignStore.joinDecisionExistingInfluencer(
                campaignId,
                invitationToken,
                decision
            );
        } else {
            await store.campaignStore.joinDecisionNewInfluencer(
                campaignId,
                invitationToken,
                decision
            );
        }
        store.isFetching = false;

        if (decision === 'accept') {
            this.props.history.push(
                `/campaign/${campaignId}/${this.influencer?._id}`
            );
            window.location.reload();
        } else {
            this.props.history.replace(`/home/dashboard`);
        }
    };

    @action
    loadData = async () => {
        store.isFetching = true;
        const campaignId = this.props.match.params.campaign_id;
        const influencerId = this.props.match.params.influencer_id;

        if (store.userRole === 'influencer') {
            if (this.props.match.params.invitation_token) {
                this.campaign =
                    await store.campaignStore.getInfluencerInvitationData(
                        this.props.match.params.campaign_id,
                        this.props.match.params.invitation_token
                    );
            } else {
                this.campaign =
                    await store.campaignStore.loadInfluencerCampaign(
                        campaignId
                    );
            }
        } else {
            this.campaign = await store.campaignStore.loadCampaign(campaignId);
        }

        if (this.props.match.params.invitation_token) {
            this.influencer = this.campaign?.influencers?.pop();
        } else {
            this.influencer = this.campaign?.influencers?.find(
                (influencer) => influencer._id === influencerId
            );
        }

        this.creatives = this.influencer?.creatives;
        const creativesLength = this.influencer?.creatives?.length ?? 0;
        this.showCreatives = creativesLength > 0;
    };

    componentDidMount() {
        this.loadData();
        store.isFetching = false;
    }

    get campaignDate() {
        if (!!this.campaign?.start_date && this.campaign.end_date) {
            const start = Formatter.formatDate(
                new Date(this.campaign.start_date),
                'dd mmm yyyy'
            );
            const end = Formatter.formatDate(
                new Date(this.campaign.end_date),
                'dd mmm yyyy'
            );
            return `${start} - ${end} `;
        }
        return '';
    }

    get campaignHashtags() {
        let hashtagsStr = '';
        if (this.influencer?.hashtags) {
            this.influencer?.hashtags.forEach((hashtag) => {
                hashtagsStr += ` ${hashtag}`;
            });
        } else hashtagsStr = '-';

        return hashtagsStr;
    }

    get campaignMentions() {
        let mentionsStr = '';
        if (this.influencer?.mentions) {
            this.influencer?.mentions.forEach((mention) => {
                mentionsStr += ` ${mention}`;
            });
        }
        return mentionsStr;
    }

    // get all posts and stories for influencer sorted
    get allposts() {
        const allposts: Array<Story & Post> = [];
        const posts =
            this.influencer?.posts.map((post) => ({ ...post, type: 'post' })) ??
            [];
        const stories =
            this.influencer?.stories.map((story) => ({
                ...story,
                type: 'story',
            })) ?? [];
        allposts.push(...posts, ...stories);
        return allposts.sort((post, next) => {
            const postDate = new Date(post.timestamp);
            const nextDate = new Date(next.timestamp);
            return -(postDate.valueOf() - nextDate.valueOf()); // return the older posts first
        });
    }

    // avgBudget() {
    // 	let budget = 0
    // 	budget = this.influencer?.influencer?.post_price * this.influencer?.n_posts + this.influencer?.influencer?.story_price * this.influencer?.n_stories + this.influencer?.influencer?.video_price * this.influencer?.n_videos
    // 	return budget
    // }

    hasAccepted = () => {
        if (this.influencer?.status === 'accepted') {
            return true;
        }
        return false;
    };

    loadingIsDone = () =>
        !!this.influencer && !!this.campaign && !!this.creatives;

    render() {
        if (this.loadingIsDone()) {
            const { t } = this.props;
            return (
                <Vbox
                    valign="between"
                    className="App-Content_wrapper gradient-container gradient-row-62 content_wrapper BriefView"
                >
                    {!this.hasAccepted() && store.userRole === 'influencer' && (
                        <div
                            className=""
                            style={{
                                marginBottom: '3.7%',
                                width: '100%',
                                boxSizing: 'border-box',
                            }}
                        >
                            <Alert severity="info">
                                {t('brief_detail.invited_collaborate')}{' '}
                                {this.campaign?.organization?.name}
                            </Alert>
                        </div>
                    )}
                    <Box
                        className="influencer-info__container"
                        fullwidth
                        borderbox
                        style={{ marginBottom: '3vh' }}
                    >
                        <HBox className="info" borderbox>
                            <Avatar
                                src={
                                    store.userRole === 'influencer'
                                        ? undefined
                                        : this.influencer?.influencer
                                              ?.profile_picture
                                }
                                className="card-img classes.large"
                                style={{ cursor: 'pointer' }}
                                onClick={() =>
                                    this.props.history.push(
                                        `/influencer/${this.influencer?.influencer?._id}`
                                    )
                                }
                            />
                            <div
                                className="info-right"
                                style={{
                                    width: '65%',
                                    paddingLeft: '1vw',
                                    paddingRight: '1vw',
                                }}
                            >
                                <span className="bold subtitle">
                                    {store.userRole === 'influencer'
                                        ? this.campaign?.organization?.name
                                        : this.influencer?.name}
                                </span>
                                <Vbox
                                    borderbox
                                    style={{ width: '100%' }}
                                    valign="around"
                                >
                                    <span className="label bold">
                                        {t('brief_detail.contacts')}
                                    </span>
                                    <Hbox
                                        borderbox
                                        align="between"
                                        style={{ width: '100%' }}
                                        className=""
                                    >
                                        <span className="text bright">
                                            {store.userRole === 'influencer'
                                                ? this.influencer?.manager
                                                      ?.email
                                                : this.influencer?.email}
                                        </span>
                                        {/* <span className='text bright'>+359 222 234 321</span> */}
                                    </Hbox>
                                </Vbox>
                                <div className="mobile buttons">
                                    {this.hasAccepted() ? (
                                        <div>
                                            {/* <span className='text' style={{ fontSize: 15, color: '#ED0238', marginRight: '0.3vw' }}>1</span>
											<Icon icon={IconTypes.bell} size={20} style={{ marginRight: '1vw', color: '#ED0238' }} /> */}
                                            <Button
                                                text={t(
                                                    'brief_detail.messages'
                                                )}
                                                type="outlined"
                                                onClick={() =>
                                                    this.toggleCommentSection()
                                                }
                                            />
                                        </div>
                                    ) : store.userRole === 'influencer' ? (
                                        <div>
                                            <Button
                                                text={t('brief_detail.accept')}
                                                marginRight="1.5%"
                                                type="primary"
                                                onClick={() =>
                                                    this.submitDecision(
                                                        'accept'
                                                    )
                                                }
                                            />
                                            <Button
                                                text={t(
                                                    'brief_detail.messages'
                                                )}
                                                type="outlined"
                                                onClick={() =>
                                                    this.submitDecision(
                                                        'decline'
                                                    )
                                                }
                                            />
                                        </div>
                                    ) : (
                                        <HBox
                                            className="buttons__container"
                                            valign="center"
                                        >
                                            <Button
                                                text={t(
                                                    'brief_detail.messages'
                                                )}
                                                type="outlined"
                                                onClick={() =>
                                                    this.toggleCommentSection()
                                                }
                                            />
                                            <Status
                                                status={
                                                    this.hasAccepted()
                                                        ? 'accepted'
                                                        : 'waiting'
                                                }
                                                style={{ marginLeft: '3.7%' }}
                                            />
                                        </HBox>
                                    )}
                                </div>
                            </div>
                        </HBox>

                        <Card borderbox>
                            <div className="influencer-metrics__container">
                                <MetricItem
                                    descriptionID={t('brief_detail.dates')}
                                    value={this.campaignDate ?? ''}
                                />
                                <MetricItem
                                    descriptionID={t('brief_detail.posts')}
                                    value={`${this.influencer?.n_posts}` ?? ''}
                                />
                                <MetricItem
                                    descriptionID={t('brief_detail.stories')}
                                    value={
                                        `${this.influencer?.n_stories}` ?? ''
                                    }
                                />
                                <MetricItem
                                    descriptionID={t('brief_detail.videos')}
                                    value={`${this.influencer?.n_videos}` ?? ''}
                                />
                                <MetricItem
                                    descriptionID={t('brief_detail.offer')}
                                    value={`${this.influencer?.budget ?? ''}`}
                                />
                            </div>
                        </Card>
                    </Box>

                    <div
                        className="brief-info__container"
                        style={{ width: '100%' }}
                    >
                        <div className="brief-info__subcontainer">
                            <BriefItem
                                descriptionID={t('brief_detail.campaign_name')}
                                value={this.campaign?.title ?? ''}
                            />
                            <BriefItem
                                descriptionID={t('brief_detail.hashtags')}
                                value={this.campaignHashtags ?? ''}
                            />
                            <BriefItem
                                descriptionID={t('brief_detail.mentions')}
                                value={this.campaignMentions ?? ''}
                            />
                            <ReadMore>
                                <BriefItem
                                    descriptionID={t(
                                        'brief_detail.requirements_guidelines'
                                    )}
                                    value={this.influencer?.requirements ?? ''}
                                />
                            </ReadMore>
                            <ReadMore>
                                <BriefItem
                                    descriptionID={t(
                                        'brief_detail.vision_other'
                                    )}
                                    value={this.influencer?.vision ?? ''}
                                />
                            </ReadMore>
                            <ReadMore>
                                <BriefItem
                                    descriptionID={t(
                                        'brief_detail.special_notes'
                                    )}
                                    value={this.influencer?.special_notes ?? ''}
                                />
                            </ReadMore>
                            {this.hasAccepted() ? (
                                <HBox
                                    borderbox
                                    className="web buttons__container"
                                >
                                    <Button
                                        text={t('brief_detail.messages')}
                                        type="outlined"
                                        onClick={() =>
                                            this.toggleCommentSection()
                                        }
                                    />
                                </HBox>
                            ) : store.userRole === 'influencer' ? (
                                <HBox
                                    borderbox
                                    className="web two buttons__container"
                                >
                                    <Button
                                        marginRight="1.5%"
                                        text={t('brief_detail.accept')}
                                        type="primary"
                                        onClick={() =>
                                            this.submitDecision('accept')
                                        }
                                    />
                                    <Button
                                        text={t('brief_detail.decline')}
                                        type="outlined"
                                        onClick={() =>
                                            this.submitDecision('decline')
                                        }
                                    />
                                </HBox>
                            ) : (
                                <HBox
                                    className="web buttons__container"
                                    valign="center"
                                >
                                    <Button
                                        text={t('brief_detail.messages')}
                                        type="outlined"
                                        onClick={() =>
                                            this.toggleCommentSection()
                                        }
                                    />
                                    <Status
                                        status={
                                            this.hasAccepted()
                                                ? 'accepted'
                                                : 'waiting'
                                        }
                                        style={{ marginLeft: '3.7%' }}
                                    />
                                </HBox>
                            )}
                        </div>
                    </div>

                    {this.hasAccepted() && <Creatives posts={this.allposts} />}

                    <Drawer
                        anchor="right"
                        open={this.commentSectionsIsOpened}
                        onClose={() => (this.commentSectionsIsOpened = false)}
                    >
                        <Messenger
                            status={this.influencer?.status}
                            influencerName={this.influencer?.name ?? ''}
                            influencerId={
                                this.props.match.params.influencer_id ?? ''
                            }
                            campaignId={this.props.match.params.campaign_id}
                            comments={this.influencer?.comments ?? []}
                            onPressClose={() =>
                                (this.commentSectionsIsOpened = false)
                            }
                        />
                    </Drawer>
                </Vbox>
            );
        }
        return <div />;
    }
}

const wrapped = withRouter(BriefDetailView);

export default withTranslation()(wrapped);

interface InfoProps {
    descriptionID: string;
    value: string;
}

function MetricItem(props: InfoProps) {
    return (
        <VBox valign="between" style={{ height: 'inherit' }}>
            <span className="text bright">{`${props.descriptionID}:`}</span>
            <span className="text bold">{props.value}</span>
        </VBox>
    );
}

function BriefItem(props: InfoProps) {
    return (
        <VBox borderbox>
            <span className="label">{props.descriptionID}</span>
            <span className="text bright">{props.value}</span>
        </VBox>
    );
}

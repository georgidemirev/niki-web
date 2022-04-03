import {
    Card,
    Counter,
    HBox,
    Hbox,
    TextArea,
    TextField,
    VBox,
    _Button as Button,
} from 'components/common';
import { action, observable } from 'mobx';
import { observer } from 'mobx-react';
import { CampaignBrief } from 'models/classes';
import React from 'react';
import { store } from 'state/Store';
import { withTranslation } from 'react-i18next';
import { withRouter } from 'react-router-dom';

interface Props {
    history: any;
    match: any;
    location: any;
    staticContext: any;
    i18n: any;
    t(key, opts?): any;
}

@observer
class BriefInfluencersView extends React.Component<Props> {
    // @observable currentInfluencer: Influencer = new Influencer()
    @observable creativePostSelected = false;

    @observable creativeStorySelected = false;

    @observable creativeVideoSelected = false;

    @observable posts = 1;

    @observable stories = 1;

    @observable videos = 1;

    @observable hashtags = '';

    @observable mentions = '';

    @observable requirements = '';

    @observable vision = '';

    @observable notes = '';

    @observable budget = 0;

    @observable campaign;

    @action
    async resetFields() {
        this.creativePostSelected = false;
        this.creativeStorySelected = false;
        this.creativeVideoSelected = false;
        this.posts = 1;
        this.stories = 1;
        this.videos = 1;
        this.requirements = '';
        this.vision = '';
        this.notes = '';
        this.hashtags = '';
        this.mentions = '';
        this.budget = 0;
    }

    @action
    incrementNumberOfPosts = () => {
        ++this.posts;
    };

    @action
    decrementNumberOfPosts = () => {
        if (this.posts > 1) {
            --this.posts;
        }
    };

    @action
    incrementNumberOfStories = () => {
        ++this.stories;
    };

    @action
    decrementNumberOfStories = () => {
        if (this.stories > 1) {
            --this.stories;
        }
    };

    @action
    incrementNumberOfVideos = () => {
        ++this.videos;
    };

    @action
    decrementNumberOfVideos = () => {
        if (this.videos > 1) {
            --this.videos;
        }
    };

    @action
    toggleCreativePostsSelected = () => {
        this.creativePostSelected = !this.creativePostSelected;
        if (this.creativePostSelected === false) {
            this.posts = 0;
        }
    };

    @action
    toggleCreativeStoriesSelected = () => {
        this.creativeStorySelected = !this.creativeStorySelected;
        if (this.creativeStorySelected === false) {
            this.stories = 0;
        }
    };

    @action
    toggleCreativeVideosSelected = () => {
        this.creativeVideoSelected = !this.creativeVideoSelected;
        if (this.creativeVideoSelected === false) {
            this.videos = 0;
        }
    };

    @action
    setRequirements = (requirements) => {
        this.requirements = requirements;
    };

    @action
    setVision = (vision) => {
        this.vision = vision;
    };

    @action
    setHashtags = (hashtags) => {
        this.hashtags = hashtags;
    };

    @action
    setMentions = (mentions) => {
        this.mentions = mentions;
    };

    @action
    setNotes = (notes) => {
        this.notes = notes;
    };

    @action
    setBudget = (budget) => {
        this.budget = budget;
    };

    @action
    inviteInfluencer = async () => {
        const brief = new CampaignBrief();
        brief.n_posts = this.posts;
        brief.n_stories = this.stories;
        brief.n_videos = this.videos;
        brief.requirements = this.requirements;
        brief.vision = this.vision;
        brief.hashtags = this.hashtags.split(' ');
        brief.mentions = this.mentions.split(' ');
        brief.special_notes = this.notes;
        brief.budget = this.budget;

        store.campaignStore.influencer.campaignBrief = brief;

        const campaignId = this.props.location?.state?.campaignId;
        const influencerId = this.props.location?.state?.influencerId;

        if (influencerId) {
            await store.campaignStore.inviteExistingInfluencer(
                campaignId,
                influencerId
            );
        } else {
            await store.campaignStore.inviteNewInfluencer(campaignId);
        }

        this.props.history.push(`/campaign/${campaignId}`);
    };

    @action
    createDefaultBrief = async () => {
        const brief = new CampaignBrief();
        brief.n_posts = this.posts;
        brief.n_stories = this.stories;
        brief.n_videos = this.videos;
        brief.requirements = this.requirements;
        brief.vision = this.vision;
        brief.hashtags = this.hashtags.split(' ');
        brief.mentions = this.mentions.split(' ');
        brief.special_notes = this.notes;
        brief.budget = this.budget;

        const campaignId = this.props.location?.state?.campaignId;
        await store.campaignStore.createCampaignBrief(brief, campaignId);
        this.props.history.replace(`/campaign/${campaignId}`);
    };

    hashtagsString(hashtags) {
        let hashtagsStr = '';
        hashtags.forEach((hashtag) => {
            hashtagsStr += ` ${hashtag}`;
        });

        return hashtagsStr;
    }

    mentionsString(mentions) {
        let mentionsStr = '';
        mentions.forEach((mention) => {
            mentionsStr += ` ${mention}`;
        });

        return mentionsStr;
    }

    loadCampaign = async (campaignId) => {
        this.campaign = await store.campaignStore.loadCampaign(campaignId);

        this.creativePostSelected = true
            ? this.campaign.default_brief?.n_posts > 0
            : false;
        this.creativeStorySelected = true
            ? this.campaign.default_brief?.n_stories > 0
            : false;
        this.creativeVideoSelected = true
            ? this.campaign.default_brief?.n_videos > 0
            : false;
        this.posts = this.campaign.default_brief?.n_posts
            ? this.campaign.default_brief?.n_posts
            : 0;
        this.stories = this.campaign.default_brief?.n_stories
            ? this.campaign.default_brief?.n_stories
            : 0;
        this.videos = this.campaign.default_brief?.n_videos
            ? this.campaign.default_brief?.n_videos
            : 0;
        this.requirements = this.campaign.default_brief?.requirements;
        this.vision = this.campaign.default_brief?.vision;
        this.notes = this.campaign.default_brief?.special_notes;
        this.hashtags = this.hashtagsString(
            this.campaign.default_brief?.hashtags
        );
        this.mentions = this.mentionsString(
            this.campaign.default_brief?.mentions
        );
        this.budget = this.campaign.default_brief?.budget;

        store.isFetching = false;
    };

    componentDidMount() {
        store.isFetching = true;
        const campaignId = this.props.location?.state?.campaignId;
        this.loadCampaign(campaignId);
    }

    render() {
        const { t } = this.props;
        return (
            <div className="App-Content_wrapper card-centered create-campaign gradient-container">
                <Card className="create-campaign__card">
                    <HBox fullwidth style={{ marginBottom: '1.125em' }}>
                        {this.props.match.path ===
                        '/create-campaign/edit-brief' ? (
                            <span className="title bold gradient">
                                {' '}
                                {t('brief_influencers.edit_brief')}{' '}
                            </span>
                        ) : (
                            <span className="title bold gradient">
                                {' '}
                                {t('brief_influencers.default_Brief')}{' '}
                            </span>
                        )}
                    </HBox>

                    <VBox fullwidth style={{ marginTop: '1vh' }} className="">
                        <span className="label" style={{ fontSize: '0.882em' }}>
                            {' '}
                            {t('brief_influencers.select_types')}{' '}
                        </span>
                        <HBox borderbox fullwidth>
                            <Button
                                marginRight="1.5%"
                                text={t('brief_influencers.post')}
                                type={
                                    this.creativePostSelected
                                        ? 'primary'
                                        : 'outlined'
                                }
                                onClick={() =>
                                    this.toggleCreativePostsSelected()
                                }
                            />
                            <Button
                                marginRight="1.5%"
                                text={t('brief_influencers.story')}
                                type={
                                    this.creativeStorySelected
                                        ? 'primary'
                                        : 'outlined'
                                }
                                onClick={() =>
                                    this.toggleCreativeStoriesSelected()
                                }
                            />
                            <Button
                                text={t('brief_influencers.video')}
                                type={
                                    this.creativeVideoSelected
                                        ? 'primary'
                                        : 'outlined'
                                }
                                onClick={() =>
                                    this.toggleCreativeVideosSelected()
                                }
                            />
                        </HBox>
                    </VBox>

                    <Hbox fullwidth className="">
                        {this.creativePostSelected && (
                            <Hbox
                                fullwidth
                                style={{ marginTop: '1vh' }}
                                align="left"
                                valign="center"
                            >
                                <span
                                    className="label"
                                    style={{
                                        minWidth: '25%',
                                        fontSize: '0.882em',
                                        textAlign: 'start',
                                        margin: 0,
                                    }}
                                >
                                    {' '}
                                    {t('brief_influencers.number_posts')}{' '}
                                </span>
                                <Counter
                                    value={this.posts}
                                    increment={() =>
                                        this.incrementNumberOfPosts()
                                    }
                                    decrement={() =>
                                        this.decrementNumberOfPosts()
                                    }
                                />
                            </Hbox>
                        )}
                        {this.creativeStorySelected && (
                            <Hbox
                                fullwidth
                                style={{ marginTop: '1vh' }}
                                align="left"
                                valign="center"
                            >
                                <span
                                    className="label"
                                    style={{
                                        minWidth: '25%',
                                        fontSize: '0.882em',
                                        textAlign: 'start',
                                        margin: 0,
                                    }}
                                >
                                    {' '}
                                    {t('brief_influencers.number_stories')}{' '}
                                </span>
                                <Counter
                                    value={this.stories}
                                    increment={() =>
                                        this.incrementNumberOfStories()
                                    }
                                    decrement={() =>
                                        this.decrementNumberOfStories()
                                    }
                                />
                            </Hbox>
                        )}
                        {this.creativeVideoSelected && (
                            <Hbox
                                fullwidth
                                style={{ marginTop: '1vh' }}
                                align="left"
                                valign="center"
                            >
                                <span
                                    className="label"
                                    style={{
                                        minWidth: '25%',
                                        fontSize: '0.882em',
                                        textAlign: 'start',
                                        margin: 0,
                                    }}
                                >
                                    {' '}
                                    {t('brief_influencers.number_videos')}{' '}
                                </span>
                                <Counter
                                    value={this.videos}
                                    increment={() =>
                                        this.incrementNumberOfVideos()
                                    }
                                    decrement={() =>
                                        this.decrementNumberOfVideos()
                                    }
                                />
                            </Hbox>
                        )}
                    </Hbox>

                    {this.props.match.path ===
                        '/create-campaign/edit-brief' && (
                        <Hbox
                            fullwidth
                            style={{ marginTop: '1vh' }}
                            align="between"
                        >
                            <TextField
                                style={{ maxWidth: '48%' }}
                                value={this.budget.toString()}
                                className="budget"
                                type="number"
                                label={t('brief_influencers.offer')}
                                placeholder={t(
                                    'brief_influencers.offer_placeholder'
                                )}
                                onChange={(event) =>
                                    (this.budget = event.target.value)
                                }
                            />
                        </Hbox>
                    )}

                    <TextArea
                        containerStyle={{ width: '100%', marginTop: '3.7%' }}
                        value={this.requirements}
                        label={t(
                            'brief_influencers.requirements_guidelines_restrictions'
                        )}
                        placeholder={t(
                            'brief_influencers.requirements_placeholder'
                        )}
                        onChange={(event) =>
                            this.setRequirements(event.target.value)
                        }
                    />

                    <TextArea
                        containerStyle={{ marginTop: '2vh' }}
                        value={this.vision}
                        label={t('brief_influencers.share_vision_creatives')}
                        placeholder={t(
                            'brief_influencers.share_vision_placeholder'
                        )}
                        onChange={(event) => this.setVision(event.target.value)}
                    />

                    <Hbox
                        fullwidth
                        style={{ marginTop: '2vh' }}
                        align="between"
                    >
                        <TextField
                            style={{ maxWidth: '48%' }}
                            value={this.hashtags}
                            label={t('brief_influencers.special_hashtags')}
                            placeholder={t(
                                'brief_influencers.hashtags_placeholder'
                            )}
                            onChange={(event) =>
                                this.setHashtags(event.target.value)
                            }
                        />
                        <TextField
                            style={{ maxWidth: '48%' }}
                            value={this.mentions}
                            label={t('brief_influencers.special_mentions')}
                            placeholder={t(
                                'brief_influencers.mentions_placeholder'
                            )}
                            onChange={(event) =>
                                this.setMentions(event.target.value)
                            }
                        />
                    </Hbox>

                    <TextArea
                        containerStyle={{ marginTop: '2vh' }}
                        value={this.notes}
                        label={t('brief_influencers.special_notes')}
                        placeholder={t('brief_influencers.notes_placeholder')}
                        onChange={(event) => this.setNotes(event.target.value)}
                    />
                    <Hbox align="right" fullwidth style={{ marginTop: '2vh' }}>
                        {this.props.match.path ===
                        '/create-campaign/edit-brief' ? (
                            <Button
                                text={t('brief_influencers.invite_influencer')}
                                type="primary"
                                onClick={() => this.inviteInfluencer()}
                            />
                        ) : (
                            <Button
                                text={t(
                                    'brief_influencers.create_default_brief'
                                )}
                                type="primary"
                                onClick={() => this.createDefaultBrief()}
                            />
                        )}
                    </Hbox>
                </Card>
            </div>
        );
    }
}

const wrapped = withRouter(BriefInfluencersView);

export default withTranslation()(wrapped);

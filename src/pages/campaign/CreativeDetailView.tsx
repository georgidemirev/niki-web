import { Drawer } from '@material-ui/core';
import { Hbox, Status, Vbox, _Button as Button } from 'components/common';
import { APP_CONFIG } from 'config';
import { action, observable } from 'mobx';
import { observer } from 'mobx-react';
import Formatter from 'models/utils/Formatter';
import React from 'react';
import { withTranslation } from 'react-i18next';
import { withRouter } from 'react-router-dom';
import { store } from 'state/Store';

interface CreativeDetailProps {
    history: any;
    match: any;
    location: any;
    staticContext: any;
    i18n: any;
    t(key, opts?): any;
}

@observer
class CreativeDetailView extends React.Component<CreativeDetailProps> {
    @observable commentSectionsIsOpened = false;

    @observable influencerId;

    @observable campaignId;

    @observable creativeId;

    @observable creative;

    @action
    toggleCommentSection() {
        this.commentSectionsIsOpened = !this.commentSectionsIsOpened;
    }

    onClickEdit = (creativeId?) => {
        const { params } = this.props.match;
        params.campaign_id = this.campaignId;
        this.props.history.push(`/creative/${creativeId}/edit`, { params });
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
        if (store.userRole === 'influencer') {
            this.creative = await store.campaignStore.loadInfluencerCreative(
                this.campaignId,
                this.creativeId
            );
        } else {
            this.creative = await store.campaignStore.loadCreative(
                this.campaignId,
                this.influencerId,
                this.creativeId
            );
        }
        store.isFetching = false;
    };

    componentDidMount() {
        const { params } = this.props.location.state;
        this.influencerId = params.influencer_id;
        this.campaignId = params.campaign_id;
        this.creativeId = this.props.match.params.creative_id;
        store.isFetching = true;
        this.loadData();
    }

    // todo: - change the URL for Prod (? create env var)
    render() {
        const { t } = this.props;
        return (
            <Vbox
                fullwidth
                borderbox
                className="App-Content_wrapper gradient-container gradient-row-55 content_wrapper"
            >
                <Vbox style={{ width: '45%' }}>
                    <Hbox
                        fullwidth
                        borderbox
                        style={{ paddingTop: '1vh', paddingBottom: '1vh' }}
                        valign="center"
                        align="between"
                    >
                        <span className="text bold title">
                            {' '}
                            Creative Review{' '}
                        </span>{' '}
                        <Status status="waiting" />
                    </Hbox>
                    <div className="testDiv">
                        <img
                            style={{ maxWidth: '100%', borderRadius: '8px' }}
                            src={`${APP_CONFIG.BASE_URL}/static/${this.campaignId}/${this.creative?.post_file}`}
                            className="responsive_img"
                        />
                    </div>
                    <Vbox fullwidth borderbox style={{ marginTop: '3vh' }}>
                        <Hbox fullwidth valign="center">
                            <span
                                className="text bold"
                                style={{
                                    ...styles.spanLabelRight,
                                    ...styles.spanSpace,
                                }}
                            >
                                {t('creatives_upload_edit.post_date')}
                            </span>{' '}
                            <span className="text bright">
                                {this.creativeDate}
                            </span>
                        </Hbox>
                        <Hbox fullwidth valign="center">
                            <span
                                className="text bold"
                                style={{
                                    ...styles.spanLabelRight,
                                    ...styles.spanSpace,
                                }}
                            >
                                {t('creatives_upload_edit.hashtags')}
                            </span>{' '}
                            <span className="text bright">
                                {this.creativeHashtags}
                            </span>
                        </Hbox>
                        <Hbox fullwidth valign="center">
                            <span
                                className="text bold"
                                style={{
                                    ...styles.spanLabelRight,
                                    ...styles.spanSpace,
                                }}
                            >
                                {t('creatives_upload_edit.mentions')}
                            </span>{' '}
                            <span className="text bright">
                                {this.creativeMentions}
                            </span>
                        </Hbox>
                        <Hbox fullwidth valign="center">
                            <span
                                className="text bold"
                                style={{
                                    ...styles.spanLabelRight,
                                    ...styles.spanSpace,
                                }}
                            >
                                {t('creatives_upload_edit.post_caption')}
                            </span>{' '}
                            <span className="text bright">
                                {this.creative?.post_text}
                            </span>
                        </Hbox>
                        <Hbox fullwidth valign="center">
                            <span
                                className="text bold"
                                style={{
                                    ...styles.spanLabelRight,
                                    ...styles.spanSpace,
                                }}
                            >
                                {t('creatives_upload_edit.notes')}
                            </span>{' '}
                            <span className="text bright">
                                {this.creative?.notes}
                            </span>
                        </Hbox>
                        <Hbox fullwidth align="right" valign="center">
                            {/* <span className='text' style={{ fontSize: 15, color: '#ED0238', marginRight: '0.3vw' }}>1</span> */}
                            {/* <Icon icon={IconTypes.bell} size={20} style={{ marginRight: '1vw', color: '#ED0238' }} /> */}
                            {store.userRole === 'influencer' ? (
                                <Button
                                    text={t('creatives_upload_edit.edit')}
                                    onClick={() =>
                                        this.onClickEdit(this.creativeId)
                                    }
                                />
                            ) : null}
                            <Button
                                text={t('creatives_upload_edit.comment')}
                                onClick={() => this.toggleCommentSection()}
                            />
                        </Hbox>
                    </Vbox>
                </Vbox>
                <Drawer
                    anchor="right"
                    open={this.commentSectionsIsOpened}
                    onClose={() => (this.commentSectionsIsOpened = false)}
                >
                    {/* <CommentSection
						influencerId={this.influencerId}
						campaignId={this.campaignId}
						creativeId={this.creativeId}
						comments={this.creative?.comments}
						onPressClose={() => this.commentSectionsIsOpened = false}
					/> */}
                </Drawer>
            </Vbox>
        );
    }
}
const wrapped = withRouter(CreativeDetailView);

export default withTranslation()(wrapped);

const styles = {
    spanLabelRight: {
        minWidth: '20%',
    },
    spanSpace: {
        paddingTop: '1vh',
        paddingBottom: '1vh',
    },
};

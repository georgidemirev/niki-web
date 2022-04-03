import { Modal } from '@material-ui/core';
import { Card } from 'components/common';
import { observable } from 'mobx';
import { observer } from 'mobx-react';
import { MEDIA_TYPE } from 'models/Enum';
import { Post, Story } from 'models/interfaces';
import Formatter from 'models/utils/Formatter';
import React, { useEffect } from 'react';
import { withTranslation } from 'react-i18next';
import { withRouter } from 'react-router-dom';
import CreativeModal from './CreativeModal';
import './styles/Creatives/Creatives.css';

interface CreativeViewProps {
    posts: Array<Post & Story>;
    history: any;
    match: any;
    location: any;
    staticContext: any;
    i18n: any;
    t(key, opts?): any;
}
@observer
class Creatives extends React.Component<CreativeViewProps> {
    @observable openModal = false;

    @observable currentPost: Post | Story | undefined = undefined;

    onClickShowMore = (creativeId?) => {
        const { params } = this.props.match;
        this.props.history.push(`/creative/${creativeId}`, { params });
    };

    setCurrentPost = (post) => {
        this.currentPost = post;
        this.openModal = true;
    };

    kFormatter(value) {
        if (value !== undefined) {
            return (
                Math.abs(value) > 999 ? `${(value / 1000).toFixed(1)}K` : value
            ).toString();
        }
    }

    renderMedia = (post) => {
        if (post?.type === 'story') {
            if (
                !!post?.real_url &&
                post?.media_type.toUpperCase() === MEDIA_TYPE.VIDEO
            )
                return (
                    <CreativeVideo
                        src={`https://api.influ.ai${post.real_url}`}
                    />
                );

            const realUrl = post?.real_url
                ? `https://api.influ.ai${post.real_url}`
                : undefined;
            const src =
                realUrl ??
                post?.thumbnail_url ??
                `${process.env.PUBLIC_URL}/img/story-thumbnail.png`;
            return <CreativeImage src={src} />;

            /* else if (!!post?.thumbnail_url) return <CreativeImage src={post?.thumbnail_url}/>
			else return <CreativeImage src={`${process.env.PUBLIC_URL}/img/story-thumbnail.png`}/>  */
        }
        if (post?.media_url) {
            return <CreativeImage src={post?.media_url} />;
        }
        return <CreativeImage src={post?.media_url} />;
    };

    renderMetrics = (post) => {
        const { t } = this.props;
        if (post) {
            return (
                <div className="creative-metrics">
                    <MetricItem
                        descriptionID={t('creatives.reach')}
                        value={this.kFormatter(post.reach) ?? 0}
                    />
                    <MetricItem
                        descriptionID={t('creatives.impressions')}
                        value={this.kFormatter(post.impressions) ?? 0}
                    />
                    {post?.engagement !== undefined && (
                        <MetricItem
                            descriptionID={t('creatives.engagement')}
                            value={Formatter.kFormatter(post?.engagement)}
                        />
                    )}
                    {post?.engagement_rate !== undefined && (
                        <MetricItem
                            descriptionID={t('creatives.eng_rate')}
                            value={Formatter.roundUpEngRate(
                                post.engagement_rate
                            )}
                        />
                    )}
                    {post?.like_count !== undefined && (
                        <MetricItem
                            descriptionID={t('creatives.likes')}
                            value={Formatter.kFormatter(post.like_count)}
                        />
                    )}
                    {post?.comments_count !== undefined && (
                        <MetricItem
                            descriptionID={t('creatives.comments')}
                            value={Formatter.kFormatter(post.comments_count)}
                        />
                    )}
                    {post?.exits !== undefined && (
                        <MetricItem
                            descriptionID={t('creatives.exits')}
                            value={Formatter.kFormatter(post.exits)}
                        />
                    )}
                    {post?.taps_forward !== undefined && (
                        <MetricItem
                            descriptionID={t('creatives.taps_forward')}
                            value={Formatter.kFormatter(post.taps_forward)}
                        />
                    )}
                    {post?.timestamp !== undefined && (
                        <MetricItem
                            descriptionID={t('creatives.date')}
                            value={
                                Formatter.formatDate(
                                    new Date(post.timestamp),
                                    'dd.mm.yyyy'
                                ) ?? ''
                            }
                        />
                    )}
                    {post?.timestamp !== undefined && (
                        <MetricItem
                            descriptionID={t('creatives.time')}
                            value={
                                Formatter.formatDateTime(
                                    new Date(post.timestamp)
                                ) ?? ''
                            }
                        />
                    )}
                </div>
            );
        }
    };

    render() {
        return (
            <div className="Creatives">
                <Modal
                    open={this.openModal}
                    onEscapeKeyDown={() => (this.openModal = false)}
                    onBackdropClick={() => (this.openModal = false)}
                >
                    <CreativeModal
                        post={this.currentPost}
                        isOpen={this.openModal}
                        onClose={() => (this.openModal = false)}
                        media={this.renderMedia(this.currentPost)}
                        metrics={this.renderMetrics(this.currentPost)}
                    />
                </Modal>
                {this.props.posts.map((post, index) => (
                    <Card
                        borderbox
                        style={{ cursor: 'pointer' }}
                        key={index}
                        onClick={() => this.setCurrentPost(post)}
                    >
                        {this.renderMedia(post)}
                        {this.renderMetrics(post)}
                    </Card>
                ))}
            </div>
        );
    }
}

interface CreativeImageProps {
    src: string;
}
function CreativeImage(props: CreativeImageProps) {
    return (
        <div
            style={{
                width: '100%',
                paddingBottom: '100%',
                borderRadius: 4,
                backgroundSize: 'cover',
                backgroundImage: `url(${props.src})`,
                backgroundPosition: 'center',
            }}
        />
    );
}

function CreativeVideo(props: CreativeImageProps) {
    const videoRef = React.createRef<HTMLVideoElement>();

    useEffect(() => {
        if (videoRef) videoRef.current?.play();
        return function cleanup() {
            if (videoRef) videoRef.current?.pause();
        };
    });

    return (
        // copied code from https://codepen.io/amdouglas/pen/eBddBd
        <div className="cell">
            <div className="content">
                <video ref={videoRef} webkit-playsinline playsInline muted loop>
                    <source src={props.src} type="video/mp4" />
                </video>
            </div>
        </div>
        // end copied code
    );
}

interface MetricItemProps {
    descriptionID: string;
    value: string;
}

export function MetricItem(props: MetricItemProps) {
    return (
        <div className="MetricItem">
            <span className="label" style={{ marginBottom: 0 }}>
                {props.descriptionID}
            </span>
            <span className="text bright">{props.value}</span>
        </div>
    );
}

const wrapped = withRouter(Creatives);

export default withTranslation()(wrapped);

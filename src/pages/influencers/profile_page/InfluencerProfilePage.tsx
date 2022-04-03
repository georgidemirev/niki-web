import { Avatar, Modal } from '@material-ui/core';
import ChartSection from 'components/charts/ChartSection';
import {
    Card,
    DropDownOutlined,
    HBox,
    Icon,
    SimpleTag,
    Vbox,
    _Button as Button,
} from 'components/common';
import { observer } from 'mobx-react';
import { Influencer } from 'models/classes';
import { ROLE } from 'models/Enum';
import { DropDownSelectItem, InfluencerProfile } from 'models/interfaces';
import formatter from 'models/utils/Formatter';
import React, { FC, forwardRef, useEffect, useState } from 'react';
import { useTranslation, withTranslation } from 'react-i18next';
import { useHistory, useParams, withRouter } from 'react-router-dom';
import { store } from 'state/Store';
import './styles/InfluencerProfilePage.css';

interface Props {
    history: any;
    match: any;
    staticContext: any;
    i18n: any;
    t(key, opts?): any;
}

const InfluencerProfilePage = observer((props: Props) => {
    const { influencerStore, user } = store;
    const { currentInfluencer, fetchInfluencerById } = influencerStore;
    // eslint-disable-next-line camelcase
    const { influencer_id } = useParams();
    const {
        i18n: { t },
    } = useTranslation();
    const history = useHistory();

    const [open, setOpen] = useState(false);

    useEffect(() => {
        // eslint-disable-next-line camelcase
        if (!currentInfluencer) fetchInfluencerById(influencer_id);
        window.scrollTo(0, 0);
        store.setSelectedTab(1);
    }, [currentInfluencer]);

    const handleClose = () => {
        setOpen(false);
    };

    type ButtonAction =
        | 'invite'
        | 'favorite'
        | 'approve'
        | 'dissaprove'
        | 'unfavorite'
        | 'connect';

    const handleClickButtonAction = (action: ButtonAction) => {
        switch (action) {
            case 'approve': {
                approveInfluencer(currentInfluencer?._id);
                break;
            }
            case 'dissaprove': {
                disapproveInfluencer(currentInfluencer?._id);
                break;
            }
            case 'invite': {
                addToCampaign();
                break;
            }
            case 'favorite': {
                user.toggleFavoriteInfluencer(currentInfluencer?._id);
                break;
            }
            case 'connect': {
                history.replace('/influencer_connect');
                break;
            }
        }
    };

    const approveInfluencer = (influencerId) => {
        store.user.approveInfluencer(influencerId);
        window.location.reload();
    };

    const disapproveInfluencer = (influencerId) => {
        store.user.disapproveInfluencer(influencerId);
        history.replace('/marketplace');
        window.location.reload();
    };

    const addToCampaign = () => {
        const campaignId = history.location.state?.campaignId;
        if (!campaignId) {
            setOpen(true);
        } else {
            inviteInfluencer(currentInfluencer?._id, campaignId);
        }
    };

    const inviteInfluencer = (influencerId, campaignId) => {
        const newInfluencer = new Influencer();
        newInfluencer.name = currentInfluencer?.name ?? '';
        newInfluencer.email = currentInfluencer?.email ?? '';

        store.campaignStore.influencer = newInfluencer;

        history.push('/create-campaign/edit-brief', {
            campaignId,
            influencerId,
        });
    };

    const getIcon = (index) => {
        switch (currentInfluencer?.channels[index]?.source) {
            case 'facebook':
                return 'facebook-color';
            case 'instagram':
                return 'instagram-color';
            case 'youtube':
                return 'youtube-color';
            case 'tiktok':
                return 'tiktok';
            case 'linkedin':
                return 'linkedin';
            case 'blog':
                return 'blog';
            default:
                return '';
        }
    };

    return (
        <>
            {currentInfluencer && (
                <Vbox
                    align="between"
                    className="App-Content_wrapper gradient-container gradient-row-62 InfluencerProfilePage"
                >
                    <div className="influencer-info__container">
                        <VCard
                            influencer={currentInfluencer}
                            onClickButton={handleClickButtonAction}
                        />
                        <Card
                            borderbox
                            fullwidth
                            className="card-with-socials"
                            style={{ padding: 0 }}
                        >
                            {currentInfluencer.channels.map(
                                (channel, index) => (
                                    <SocialChannel
                                        key={index}
                                        channelSource={channel.source}
                                        channelLink={channel.link}
                                        icon={getIcon(index)}
                                        followers={formatter.kFormatter(
                                            currentInfluencer?.instagram_total_followers ??
                                                ''
                                        )}
                                        engRate={
                                            currentInfluencer.instagram_engagement_rate?.toFixed(
                                                1
                                            ) ?? ''
                                        }
                                    />
                                )
                            )}
                        </Card>
                        <div className="about__container mobile">
                            <p className="text light about">
                                {currentInfluencer.about}
                            </p>
                        </div>
                    </div>

                    <HBox
                        className=""
                        borderbox
                        fullwidth
                        align="between"
                        valign="center"
                        style={{ marginTop: '3.7%' }}
                    >
                        <div className="report">
                            <span className="subtitle bold">
                                {t('influencer_profile.audience_report')}
                            </span>
                            <span className="text bright">
                                {t('influencer_profile.report_message')}
                            </span>
                        </div>
                        <ActionButtons
                            onClickButton={handleClickButtonAction}
                        />
                    </HBox>
                    {currentInfluencer.topics.length && (
                        <Card borderbox className="topics-card">
                            <div className="topic-card__content">
                                <span className="subtitle bold">
                                    {t('influencer_profile.topics')}
                                </span>
                                <div className="topics-container">
                                    {currentInfluencer.topics.map(
                                        (topic, index) => (
                                            <SimpleTag
                                                key={index}
                                                text={topic}
                                                editable={false}
                                            />
                                        )
                                    )}
                                </div>
                            </div>
                        </Card>
                    )}
                    {(!!currentInfluencer.post_price ||
                        !!currentInfluencer.story_price ||
                        !!currentInfluencer.video_price) && (
                        <Card fullwidth borderbox className="prices-card">
                            <div className="price-container">
                                <span className="subtitle bold">
                                    Average price{' '}
                                </span>
                                <div className="prices">
                                    {!!currentInfluencer?.post_price && (
                                        <PriceItem
                                            descriptionID="1 Post"
                                            value={`${currentInfluencer.post_price}`}
                                        />
                                    )}
                                    {!!currentInfluencer?.story_price && (
                                        <PriceItem
                                            descriptionID="1 Story"
                                            value={`${currentInfluencer.story_price}`}
                                        />
                                    )}
                                    {!!currentInfluencer?.video_price && (
                                        <PriceItem
                                            descriptionID="1 Video"
                                            value={`${currentInfluencer.video_price}`}
                                        />
                                    )}
                                </div>
                            </div>
                        </Card>
                    )}
                    <ChartSection influencer={currentInfluencer} />

                    <Modal open={open} onEscapeKeyDown={handleClose}>
                        <SelectCampaign onInfluencerInvite={inviteInfluencer} />
                    </Modal>
                </Vbox>
            )}
        </>
    );
});
/* ************************************** VCard ************************************** */
interface VCardProps {
    influencer: InfluencerProfile;
    onClickButton(action): void;
}

const VCard: FC<VCardProps> = ({ influencer, onClickButton }) => {
    return (
        <HBox className="VCard-hbox" borderbox fullwidth>
            <Avatar
                src={influencer.profile_picture}
                className="card-img classes.large"
            />

            <div className="vcard__right-container">
                <div className="info__container">
                    <span className="title bold"> {influencer.name}</span>
                    {store.user.userRole === ROLE.MANAGER && (
                        <div style={{ marginTop: '1.5%' }}>
                            <span
                                style={{ marginBottom: 0, marginTop: '1.5%' }}
                                className="label"
                            >
                                {influencer.email}
                            </span>
                            <span
                                style={{ marginBottom: 0, marginTop: '1.5%' }}
                                className="label"
                            >
                                {influencer.phone_number}
                            </span>
                        </div>
                    )}
                    <div className="topics-cats__container">
                        <HBox
                            borderbox
                            className="categories_hbox"
                            valign="center"
                        >
                            {influencer.categories.map((category, index) => {
                                const slash =
                                    index < influencer.categories.length - 1
                                        ? ' / '
                                        : '';
                                return (
                                    <span
                                        className="label bold"
                                        style={{ marginBottom: 0 }}
                                    >{`${category}${slash} `}</span>
                                );
                            })}
                        </HBox>
                        <div style={{ flexDirection: 'row' }}>
                            <span
                                style={{ marginRight: '5px' }}
                                className="text bright"
                            >
                                {`${influencer.country},`}
                            </span>
                            <span className="text bright">
                                {influencer.city}
                            </span>
                        </div>
                    </div>
                    <div className="about__container">
                        <p className="text light about web">
                            {influencer.about}
                        </p>
                    </div>
                </div>
                <ActionButtons onClickButton={onClickButton} device="mobile" />
            </div>
        </HBox>
    );
};
/* ************************************** ActionButtons ************************************** */
function ActionButtons({ onClickButton, device = '' }) {
    const {
        user: { user, isInFavorites },
        influencerStore: { currentInfluencer },
    } = store;
    // eslint-disable-next-line camelcase
    const { influencer_id } = useParams();
    const {
        i18n: { t },
    } = useTranslation();
    // eslint-disable-next-line camelcase
    const [fav, setFav] = useState(isInFavorites(influencer_id));

    const toggleFavorite = () => {
        setFav(!fav);
        onClickButton('favorite');
    };

    return (
        <HBox
            valign="baseline"
            align="between"
            borderbox
            className={`action-buttons ${device || 'web'}`}
            style={{ width: '35%' }}
        >
            {user?.role === ROLE.MANAGER ? (
                !currentInfluencer?.is_approved ? (
                    <HBox fullwidth align="right">
                        <Button
                            containerStyle={{ marginLeft: '1.7%' }}
                            type="outlined"
                            text={t('influencer_profile.disapprove')}
                            onClick={() => onClickButton('disapprove')}
                        />
                        <Button
                            text={t('influencer_profile.approve')}
                            onClick={() => onClickButton('approve')}
                        />
                    </HBox>
                ) : (
                    <HBox fullwidth align="right" className="">
                        <Button
                            type="outlined"
                            text={`${
                                fav
                                    ? t('influencer_profile.remove_favorites')
                                    : t('influencer_profile.add_favorites')
                            }`}
                            onClick={toggleFavorite}
                        />
                        <Button
                            containerStyle={{ marginLeft: '1.7%' }}
                            text={t('influencer_profile.invite_campaign')}
                            onClick={() => onClickButton('invite')}
                        />
                    </HBox>
                )
            ) : (
                user?.role === ROLE.INFLUENCER &&
                !user.fbgraph_token && (
                    <Button
                        text="Connect to Instagram"
                        onClick={() => onClickButton('connect')}
                    />
                )
            )}
        </HBox>
    );
}
/* ************************************** PriceItem ************************************** */
interface PriceItemProps {
    descriptionID: string;
    value: string;
}

function PriceItem(props: PriceItemProps) {
    return (
        <div className="price-item" style={{ height: 'inherit' }}>
            <span className="text bright">{`${props.descriptionID}:`}</span>
            <span className="text bold" /* style={{marginTop: '3.7%'}} */>
                {props.value}
            </span>
        </div>
    );
}

/* ************************************** SocialChannel ************************************** */
interface SocialChannelProps {
    key: number;
    channelSource: string;
    channelLink: string;
    followers: string;
    engRate: string;
    icon: string;
}

function SocialChannel(props: SocialChannelProps) {
    const {
        i18n: { t },
    } = useTranslation();
    return (
        <HBox
            className="channel"
            key={props.key}
            borderbox
            fullwidth
            valign="center"
            style={
                props.channelSource === 'instagram'
                    ? { ...styles.selected, ...styles.channel }
                    : { ...styles.channel }
            }
        >
            <a
                target="_blank"
                rel="noopener noreferrer"
                href={props.channelLink}
            >
                <Icon
                    className={`${
                        props.channelSource === 'instagram' ? 'insta_icon' : ''
                    } `}
                    icon={props.icon}
                    size={24}
                />
            </a>{' '}
            &nbsp;
            {props.channelSource === 'instagram' &&
            props.engRate !== undefined ? (
                <div className="channel_info">
                    <span className="text bold" style={{ fontSize: '14px' }}>
                        {props.followers}{' '}
                    </span>{' '}
                    &nbsp;
                    <span className="text bright light">
                        {t('influencer_profile.follow')} /
                    </span>{' '}
                    &nbsp;
                    <span className="text bold" style={{ fontSize: '14px' }}>
                        {props.engRate}
                    </span>{' '}
                    &nbsp;
                    <span className="text bright light">
                        {t('influencer_profile.eng_rate')}
                    </span>{' '}
                    &nbsp;
                </div>
            ) : (
                <div className="channel_info">
                    <span className="text bright light">
                        <a
                            target="_blank"
                            rel="noopener noreferrer"
                            href={props.channelLink}
                        >
                            {props.channelSource}
                        </a>
                    </span>
                </div>
            )}
        </HBox>
    );
}

/* ************************************** ModalContent ************************************** */
const SelectCampaign: FC<{ onInfluencerInvite }> = forwardRef((props, ref) => {
    const {
        campaignStore,
        influencerStore: { currentInfluencer },
    } = store;
    const [campaigns, setCampaigns] = useState<any[]>([]);

    const loadCampaigns = async () => {
        await campaignStore.getAllCampaigns();
        setCampaigns([
            ...campaignStore.campaigns.map((campaign) => ({
                value: campaign._id,
                text: campaign.title,
            })),
        ]);
    };

    useEffect(() => {
        loadCampaigns();
    }, [campaigns]);

    const handleInviteInfluencer = async (event) => {
        props.onInfluencerInvite(currentInfluencer?._id, event.target.value);
    };

    return (
        <HBox style={{ height: '100%' }} align="center" valign="center">
            <HBox
                fullwidth
                style={{
                    background: '#fff',
                    maxWidth: '50%',
                    padding: '1.3vw',
                }}
                valign="center"
                align="center"
            >
                <DropDownOutlined
                    label="Please, select a campaign"
                    style={{ width: '100%', marginTop: '2vh' }}
                    menuItems={campaigns as DropDownSelectItem[]}
                    value={campaigns}
                    labelId="campaigns"
                    onChange={handleInviteInfluencer}
                />
            </HBox>
        </HBox>
    );
});

const styles = {
    about: {
        fontFamily: 'Raleway, sans-serif',
    },

    selected: {
        backgroundColor: '#FBF0FF',
    },

    channel: {
        padding: '3.7%',
    },

    instaicon: {
        fill: 'url(#instaGradient)  #9C27B0',
    },

    chartCard: {
        minWidth: '25vw',
        paddingLeft: '2vw',
        paddingRight: '2vw',
    },

    horizontal: {
        minWidth: '30vw',
        flexWrap: 'none',
    },

    chartSection: {
        marginTop: '3vh',
    },
};

const wrapped = withRouter(InfluencerProfilePage);

export default withTranslation()(wrapped);

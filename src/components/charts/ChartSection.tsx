import {
    Avatar,
    List,
    ListItem,
    ListItemAvatar,
    ListItemText,
} from '@material-ui/core';
import {
    Card,
    Hbox,
    HBox,
    Icon,
    IconTypes,
    Tooltip,
    VBox,
} from 'components/common';
import Formatter from 'models/utils/Formatter';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { withRouter } from 'react-router-dom';
import { store } from 'state/Store';
import {
    VictoryArea,
    VictoryAxis,
    VictoryBar,
    VictoryChart,
    VictoryContainer,
} from 'victory';
import { BarChart } from './BarChart';
import { DonutChart } from './DonutChart';

interface ChartProps {
    influencer: any;
    history: any;
    match: any;
    location: any;
    staticContext: any;
    className?: string;
}

class ChartSection extends React.Component<ChartProps> {
    submit = async () => {
        store.errorMessage = '';
        const url = await store.user.connectToInstagram();
        if (!store.errorMessage) {
            if (url) {
                // user has to authorize for facebook
                window.location = url;
            } else {
                store.isFetching = false;
                store.userIsLoggedIn = true;
                this.props.history.replace('/home/dashboard');
            }
        } else {
            store.isFetching = false;
        }
    };

    get followers() {
        const male = this.props.influencer?.instagram_followers?.male;
        const female = this.props.influencer?.instagram_followers?.female;
        const total = male + female;

        return {
            male: {
                percentage: Math.round((male / total) * 100 + Number.EPSILON),
                number: male,
            },
            female: {
                percentage: Math.round((female / total) * 100 + Number.EPSILON),
                number: female,
            },
        };
    }

    get donutData() {
        const menY = this.followers.male.percentage / 100;
        const womenY = this.followers.female.percentage / 100;
        if (!!menY && !!womenY)
            return [
                { x: 'women', y: womenY },
                { x: 'men', y: menY },
            ];
        return [];
    }

    get followersAge() {
        const followersData = this.props.influencer?.instagram_age;
        const keys = Object.keys(followersData ?? []);

        return keys
            .slice()
            .sort()
            .map((item) => ({
                x: item,
                y: followersData[item],
            }));
    }

    get followersLocation() {
        const locations = this.props.influencer?.instagram_cities;

        const keys = Object.keys(locations ?? []);

        let totalCount = 0;

        keys.forEach((city) => (totalCount += locations[city]));

        return keys
            ?.slice()
            .sort((a, b) => -(locations[a] - locations[b]))
            .map((city) => ({
                x: city.split(',')[0],
                y: Math.round(
                    (locations[city] / totalCount) * 100 + Number.EPSILON
                ),
            }));
    }

    get hashTags() {
        const hashtags = this.props.influencer?.instagram_hashtags;
        let keys = hashtags ?? [];
        keys = keys?.slice().sort((a, b) => b.count - a.count);
        return keys;
    }

    get collaborations() {
        const collabs = this.props.influencer?.instagram_collaborations;
        if (collabs) {
            return collabs.map((collab) => {
                const date = new Date(collab.timestamp);
                return {
                    account_link: `https://www.instagram.com/${collab.mention}`,
                    account_name: collab.mention,
                    profile_pic: `https://api.influ.ai/profile_images/${collab.mention}.jpeg`,
                    date: Formatter.formatDate(date, 'dd.mm.yyyy'),
                };
            });
        }
        return [];
    }

    get engagement() {
        const engagement = this.props.influencer?.instagram_monthly_engagement;
        if (engagement) {
            const months = Object.keys(engagement);
            return months?.map((month) => ({
                x: month.split(' ').join('\n'),
                y: engagement[month],
            }));
            // return months?.map(month => ({x: month.split(" ")[0], y: this.kFormatter(engagement[month])}))
        }
        return [];
    }

    render() {
        return (
            <div className="ChartSection" style={{ marginTop: '3.7%' }}>
                {!store.user.user?.fbgraph_token &&
                store.userRole === 'influencer' ? (
                    <> </>
                ) : (
                    <div className="charts-container">
                        {!!this.donutData.length && (
                            <FGenderDonutChart
                                data={this.donutData}
                                femalePercentage={
                                    this.followers.female.percentage
                                }
                                malePercentage={this.followers.male.percentage}
                            />
                        )}

                        {!!this.hashTags.length && (
                            <TopHashtags data={this.hashTags} />
                        )}

                        {!!this.followersAge.length && (
                            <FAgeBarChart data={this.followersAge} />
                        )}

                        {!!this.followersLocation.length && (
                            <FLocationBarChart data={this.followersLocation} />
                        )}

                        {!!this.collaborations.length && (
                            <Collaborations data={this.collaborations} />
                        )}

                        {!!this.engagement.length && (
                            <LastEngagement data={this.engagement} />
                        )}
                    </div>
                )}
            </div>
        );
    }
}
export default withRouter(ChartSection);

// todo move to utils
const kFormatter = (value) => {
    return (
        Math.abs(value) > 999 ? `${(value / 1000).toFixed(1)}k` : value
    ).toString();
};

interface DonutChartProps {
    data: { x: string; y: any }[];
    femalePercentage: any;
    malePercentage: any;
}

function FGenderDonutChart(props: DonutChartProps) {
    const {
        i18n: { t },
    } = useTranslation();
    return (
        <Card
            borderbox
            className="donut chart-card"
            style={styles.chartCard}
            align="baseline"
        >
            <span className="title bold" style={{ fontSize: '18px' }}>
                {t('influencer_profile.followers_gender')}
            </span>
            <Hbox borderbox fullwidth align="center">
                <DonutChart data={props.data} />
            </Hbox>

            <Hbox borderbox fullwidth align="center">
                <span className="text bold" style={{ color: '#0085FF' }}>
                    {`Women - ${props.femalePercentage}%`}{' '}
                </span>{' '}
                &nbsp; &nbsp;
                <span
                    className="text bold"
                    style={{ color: '#53D689' }}
                >{`Men - ${props.malePercentage}%`}</span>
            </Hbox>
        </Card>
    );
}

interface TopHashtagsProps {
    data: any;
}

function TopHashtags(props: TopHashtagsProps) {
    const { t } = useTranslation();

    return (
        <Card
            className="top-tags chart-card"
            borderbox
            style={styles.chartCard}
        >
            <span className="title bold" style={{ fontSize: '18px' }}>
                {t('influencer_profile.top_tags')}
            </span>
            <VBox
                borderbox
                fullwidth
                style={{
                    overflow: 'auto',
                    marginTop: '3.7%',
                    paddingBottom: '1.7%',
                }}
            >
                {props.data.slice(0, 10).map((item) => {
                    return (
                        <Hbox
                            key={item.name}
                            fullwidth
                            borderbox
                            align="between"
                            style={{ marginTop: '1vh', marginBotton: '2vh' }}
                        >
                            <span className="text">{item.name}</span>
                            <span className="text bold">{item.count}</span>
                        </Hbox>
                    );
                })}
            </VBox>
        </Card>
    );
}

interface FAgeBarchartProps {
    data: any;
}

function FAgeBarChart(props: FAgeBarchartProps) {
    const {
        i18n: { t },
    } = useTranslation();
    return (
        <Card borderbox className="age chart-card" style={styles.chartCard}>
            <span className="title bold" style={{ fontSize: '18px' }}>
                {t('influencer_profile.followers_age')}
            </span>
            <BarChart data={props.data} />
        </Card>
    );
}

interface FLocationBarchartProps {
    data: any;
}

function FLocationBarChart(props: FLocationBarchartProps) {
    const {
        i18n: { t },
    } = useTranslation();
    return (
        <Card
            borderbox
            className="chart-card"
            style={{ ...styles.chartCard, ...styles.horizontal }}
        >
            <span className="title bold" style={{ fontSize: '18px' }}>
                {t('influencer_profile.followers_location')}
            </span>
            <VictoryChart
                containerComponent={
                    <VictoryContainer
                        style={{
                            pointerEvents: 'auto',
                            userSelect: 'auto',
                            touchAction: 'auto',
                        }}
                    />
                }
                width={400}
                height={200}
                padding={{ left: 110, top: 0, bottom: 20, right: 50 }}
                domainPadding={{ x: 50, y: 40 }}
            >
                <VictoryAxis
                    fixLabelOverlap
                    style={{ axis: { stroke: 'none' } }}
                />
                <VictoryBar
                    horizontal
                    cornerRadius={{ top: 2, bottom: 2 }}
                    barRatio={0.6}
                    barWidth={15}
                    style={{ data: { fill: 'url(#barChartGradient)' } }}
                    data={props.data.slice(0, 5).reverse()}
                    labels={({ datum }) => `${datum.y}%`}
                />
            </VictoryChart>
        </Card>
    );
}

interface TopPartnersProps {
    data: any;
}

function Collaborations(props: TopPartnersProps) {
    const {
        i18n: { t },
    } = useTranslation();
    return (
        <Card borderbox className="chart-card" style={styles.chartCard}>
            <span className="title bold" style={{ fontSize: 18 }}>
                {t('influencer_profile.top_paid')}
            </span>
            <div style={{ overflow: 'auto', width: '100%', marginTop: '3.7%' }}>
                <List style={{ width: '100%' }} disablePadding>
                    {props.data.map((partner) => {
                        return (
                            <ListItem
                                onClick={() =>
                                    window.open(partner.account_link, '_blank')
                                }
                                style={{ cursor: 'pointer' }}
                            >
                                <ListItemAvatar>
                                    <Avatar
                                        alt={partner.brand_name}
                                        src={`${partner?.profile_pic}`}
                                    />
                                </ListItemAvatar>
                                <ListItemText
                                    primary={`@${partner.account_name}`}
                                    secondary={partner.date}
                                />
                            </ListItem>
                        );
                    })}
                </List>
            </div>
        </Card>
    );
}

interface LastEngagementProps {
    data: any;
}

function LastEngagement(props: LastEngagementProps) {
    const {
        i18n: { t },
    } = useTranslation();
    return (
        <Card borderbox className="chart-card" style={styles.chartCard}>
            <HBox
                style={{
                    justifyContent: 'space-between',
                    flexDirection: 'row',
                    width: '100%',
                }}
            >
                <div>
                    <span className="title bold" style={{ fontSize: 18 }}>
                        {t('influencer_profile.engagement')}
                    </span>
                </div>

                <Tooltip text={t('influencer_profile.tooltip_message')}>
                    <div>
                        <Icon
                            className="gradient"
                            icon={IconTypes.questionmark_circled}
                            size={18}
                            style={{
                                fontFamily: 'IBM Plex Mono, monospace',
                                cursor: 'pointer',
                            }}
                        />
                    </div>
                </Tooltip>
            </HBox>

            <VictoryChart
                width={400}
                height={200}
                containerComponent={
                    <VictoryContainer
                        style={{
                            pointerEvents: 'auto',
                            userSelect: 'auto',
                            touchAction: 'auto',
                        }}
                    />
                }
            >
                <VictoryAxis
                    style={{
                        axis: { stroke: 'rgba(0, 133, 255, .5)' },
                        tickLabels: {
                            padding: 15,
                            verticalAnchor: 'middle',
                            textAnchor: 'middle',
                        },
                    }}
                />
                <VictoryArea
                    data={props.data}
                    style={{
                        data: {
                            stroke: '#53D689',
                            fill: 'rgba(83, 214, 137, .2)',
                        },
                    }}
                    labels={({ datum }) => kFormatter(datum.y)}
                />
            </VictoryChart>
        </Card>
    );
}

const styles = {
    chartCard: {
        minWidth: '30vw',
        paddingLeft: '3.7%',
        paddingRight: '3.7%',
    },

    horizontal: {
        minWidth: '30vw',
        flexWrap: 'none',
    },

    chartSection: {
        marginTop: '3vh',
    },
};

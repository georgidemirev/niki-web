import { HBox } from 'components/common/HBox';
import InfluencerCard from 'components/common/InfluencerCard/InfluencerCard';
import React from 'react';
import { withRouter } from 'react-router-dom';

interface Props {
    history: any;
    match: any;
    location: any;
    staticContext: any;
}

class InfluencersView extends React.Component<Props> {
    influencers = [
        {
            title: 'Mona Gocheff',
            image: 'instagram.com/monagocheff-image-url',
            subTitle: 'monagocheff',
            followers: '12k',
            engRate: '12',
            style: 'any',
        },
        {
            title: 'Mona Gocheff',
            image: 'instagram.com/monagocheff-image-url',
            subTitle: 'monagocheff',
            followers: '12k',
            engRate: '12',
            style: 'any',
        },
        {
            title: 'Mona Gocheff',
            image: 'instagram.com/monagocheff-image-url',
            subTitle: 'monagocheff',
            followers: '12k',
            engRate: '12',
            style: 'any',
        },
        {
            title: 'Mona Gocheff',
            image: 'instagram.com/monagocheff-image-url',
            subTitle: 'monagocheff',
            followers: '12k',
            engRate: '12',
            style: 'any',
        },
        {
            title: 'Mona Gocheff',
            image: 'instagram.com/monagocheff-image-url',
            subTitle: 'monagocheff',
            followers: '12k',
            engRate: '12',
            style: 'any',
        },
        {
            title: 'Mona Gocheff',
            image: 'instagram.com/monagocheff-image-url',
            subTitle: 'monagocheff',
            followers: '12k',
            engRate: '12',
            style: 'any',
        },
        {
            title: 'Mona Gocheff',
            image: 'instagram.com/monagocheff-image-url',
            subTitle: 'monagocheff',
            followers: '12k',
            engRate: '12',
            style: 'any',
        },
    ];

    redirectTo = (path) => {
        this.props.history.push(path);
    };

    render() {
        return (
            <div style={styles.gridContainer}>
                {this.influencers.map((item, index) => (
                    <HBox style={{ width: '100%' }} align="left">
                        <InfluencerCard
                            key={index}
                            title={item.title}
                            image={item.image}
                            subTitle={item.subTitle}
                            followers={item.followers}
                            engRate={item.engRate}
                            style={item.style}
                        />
                    </HBox>
                ))}
            </div>
        );
    }
}

export default withRouter(InfluencersView);

const styles = {
    gridContainer: {
        display: 'grid',
        gridTemplateColumns: '25% 25% 25% 25%',
    },
};

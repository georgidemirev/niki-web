import React from 'react';
import { VictoryPie, VictoryContainer } from 'victory';
import './Charts.css';

interface DonutData {
    data: { x: string; y: any }[];
}

export class DonutChart extends React.Component<DonutData> {
    render() {
        return (
            <div className="donutChart">
                <VictoryPie
                    containerComponent={
                        <VictoryContainer
                            style={{
                                pointerEvents: 'auto',
                                userSelect: 'auto',
                                touchAction: 'auto',
                            }}
                        />
                    }
                    colorScale={['#0085FF', '#53D689']}
                    startAngle={90}
                    endAngle={480}
                    innerRadius={100}
                    data={this.props.data}
                    labels={({ datum }) => ''}
                />
            </div>
        );
    }
}

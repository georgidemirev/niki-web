import React from 'react';
import { VictoryAxis, VictoryBar, VictoryChart } from 'victory';
import './Charts.css';

export class HorizontalBarChart extends React.Component {
    data = [
        { x: '13-17', y: 2430 },
        { x: '18-24', y: 4328 },
        { x: '25-34', y: 11234 },
        { x: '34-44', y: 4332 },
        { x: '45-50', y: 1234 },
        { x: '50-65', y: 4322 },
    ];

    render() {
        return (
            <div className="barchart">
                <VictoryChart width={400} height={200}>
                    <VictoryAxis style={{ axis: { stroke: 'none' } }} />
                    <VictoryBar
                        range={{ y: [500, 1234] }}
                        cornerRadius={{ top: 4, bottom: 4 }}
                        barRatio={0.8}
                        barWidth={26}
                        style={{ data: { fill: '#0085FF' } }}
                        data={this.data}
                    />
                </VictoryChart>
            </div>
        );
    }
}

import React from 'react';
import {
    VictoryAxis,
    VictoryBar,
    VictoryChart,
    VictoryContainer,
} from 'victory';
import './Charts.css';

interface BarData {
    horizontal?: boolean;
    data: any[];
    colorFill?: string;
    barRatio?: number;
    barWidth?: number;
}
export class BarChart extends React.Component<BarData> {
    render() {
        return (
            <div className="barchart">
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
                >
                    <VictoryAxis
                        fixLabelOverlap
                        style={{ axis: { stroke: 'none' } }}
                    />
                    <VictoryBar
                        {...this.props}
                        cornerRadius={{ top: 4, bottom: 4 }}
                        barRatio={this.props?.barRatio ?? 0.8}
                        barWidth={this.props?.barWidth ?? 26}
                        style={{
                            data: { fill: this.props?.colorFill ?? '#0085FF' },
                        }}
                        labels={({ datum }) => `${datum.y}`}
                    />
                </VictoryChart>
            </div>
        );
    }
}

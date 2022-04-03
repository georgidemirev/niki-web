import { CSSProperties } from '@material-ui/core/styles/withStyles';
import React from 'react';
import './Box.css';

interface BoxProps {
    direction?: 'horizontal' | 'vertical';
    children?: any;
    fullwidth?: boolean;
    borderbox?: boolean;
    style?: any;
    align?:
        | 'left'
        | 'center'
        | 'right'
        | 'around'
        | 'between'
        | 'evenly'
        | 'stretch'
        | 'baseline';
    valign?:
        | 'top'
        | 'center'
        | 'bottom'
        | 'baseline'
        | 'stretch'
        | 'around'
        | 'between'
        | 'evenly';
    bgColor?: string;
    bgOpacity?: number;
    className?: string;
    ref?: any;
}

export class Box extends React.Component<BoxProps> {
    get align():
        | 'flex-start'
        | 'flex-end'
        | 'center'
        | 'space-between'
        | 'space-around'
        | 'space-evenly' {
        switch (this.props.align) {
            case 'left':
                return 'flex-start';
            case 'center':
                return 'center';
            case 'right':
                return 'flex-end';
            case 'around':
                return 'space-around';
            case 'between':
                return 'space-between';
            case 'evenly':
                return 'space-evenly';
            default:
                return 'flex-start';
        }
    }

    get valign():
        | 'flex-start'
        | 'flex-end'
        | 'center'
        | 'stretch'
        | 'baseline' {
        switch (this.props.valign) {
            case 'top':
                return 'flex-start';
            case 'center':
                return 'center';
            case 'bottom':
                return 'flex-end';
            case 'stretch':
                return 'stretch';
            case 'baseline':
                return 'baseline';
            default:
                return 'flex-start';
        }
    }

    get width() {
        return this.props.fullwidth ? '100%' : '';
    }

    get boxsizing() {
        return this.props.borderbox ? 'border-box' : '';
    }

    render() {
        const styles = {
            default: {
                display: 'flex',
                justifyContent: this.align,
                alignItems: this.valign,
                flexWrap: 'wrap',
                width: this.width,
                boxSizing: this.boxsizing,
            } as CSSProperties,
        };
        return (
            <div
                ref={this.props?.ref}
                {...this.props}
                className={`box ${this.props.className}`}
                style={{
                    ...styles.default,
                    ...(this.props?.style as CSSProperties),
                }}
            >
                {this.props?.children}
            </div>
        );
    }
}

import { Card, HBox, Icon, IconTypes, VBox } from 'components/common';
import { ReadMore } from 'components/ReadMore';
import { Post, Story } from 'models/interfaces';
import React from 'react';
import './styles/Creatives/Creatives.css';

interface Props {
    post: Post | Story | undefined;
    media: any;
    metrics: any;
    isOpen: boolean;
    onClose(): void;
}

export class CreativeModal extends React.Component<Props> {
    render() {
        return (
            <div className="CreativeModalView">
                <Card borderbox className="Card-Modal">
                    <HBox
                        style={{ height: '25px' }}
                        fullwidth
                        valign="center"
                        align="right"
                    >
                        <Icon
                            className="close-icon"
                            style={{ cursor: 'pointer' }}
                            color="rgba(60, 63, 68, .6)"
                            icon={IconTypes.close}
                            onClick={this.props.onClose}
                        />
                    </HBox>
                    <div className="mainModal-container">
                        <div className="imageModal-container">
                            {this.props.media}
                        </div>
                        <div className="metrics-caption">
                            {this.props.metrics}
                            <VBox className="caption-modal" borderbox>
                                <ReadMore maxText={300}>
                                    <CaptionItem
                                        value={this.props.post?.caption ?? ''}
                                    />
                                </ReadMore>
                            </VBox>
                        </div>
                    </div>
                </Card>
            </div>
        );
    }
}
interface CaptionItemProps {
    value: string;
}
function CaptionItem(props: CaptionItemProps) {
    return <span className="text bright">{props.value}</span>;
}

export default CreativeModal;

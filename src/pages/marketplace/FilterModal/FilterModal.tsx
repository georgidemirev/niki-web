import { Modal } from '@material-ui/core';
import React from 'react';
import InfluencerFilter from '../InfluencersFilter/InfluencerFilter';
import './FilterModal.css';

interface Props {
    show: boolean;
    onClose(): void;
}

export class FilterModal extends React.Component<Props> {
    render() {
        return (
            <Modal
                className="FilterModal mobile"
                open={this.props.show}
                onClose={this.props.onClose}
            >
                <div className="content__div">
                    <InfluencerFilter onCloseModal={this.props.onClose} />
                </div>
            </Modal>
        );
    }
}

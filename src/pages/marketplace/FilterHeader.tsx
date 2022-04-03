import { DropDown, HBox, HideAppBar, Icon, IconTypes } from 'components/common';
import { action } from 'mobx';
import { observer } from 'mobx-react';
import { DropDownSelectItem } from 'models/interfaces';
import React, { RefObject } from 'react';
import { withTranslation } from 'react-i18next';
import { withRouter } from 'react-router-dom';

interface Props {
    sortValue: string;
    ref?: RefObject<any>;
    dropDownSortOptions: DropDownSelectItem[];
    onClickFilter(): void;
    onClickSort(value): void;
    i18n: any;
    t(key, opts?): any;
}

@observer
class FilterHeader extends React.Component<Props> {
    @action handleSort = (value) => {
        this.props.onClickSort(value);
    };

    render() {
        const { t } = this.props;
        return (
            <HideAppBar ref={this.props?.ref}>
                <div className="tooltip-content">
                    <div
                        className="filter__button"
                        onClick={this.props.onClickFilter}
                    >
                        <div style={{ width: 'inherit' }}>
                            <Icon
                                className="gradient"
                                icon={IconTypes.equalizer}
                                size={16}
                            />
                            <span
                                className="text gradient bold"
                                style={{ fontSize: '15px', marginLeft: '5%' }}
                            >
                                {' '}
                                {t('marketplace.filter')}{' '}
                            </span>
                        </div>
                    </div>
                    <div
                        className="sortby__button"
                        onClick={this.props.onClickSort}
                    >
                        <HBox borderbox align="right" valign="center">
                            <span className="text light">
                                {t('marketplace.sort_by')}: &nbsp;
                            </span>
                            <DropDown
                                onChange={this.handleSort}
                                labelId="sortDropDId"
                                menuItems={this.props.dropDownSortOptions}
                                value={this.props.sortValue}
                            />
                        </HBox>
                    </div>
                </div>
            </HideAppBar>
        );
    }
}
const wrapped = withRouter(FilterHeader);

export default withTranslation()(wrapped);

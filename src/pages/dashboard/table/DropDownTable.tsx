import { Menu, MenuItem } from '@material-ui/core';
import { Icon, IconTypes } from 'components/common';
import React from 'react';
import { withTranslation } from 'react-i18next';
import { withRouter } from 'react-router-dom';

interface DropDownProps {
    redirect(): void;
    delete(): void;
    i18n: any;
    t(key, opts?): any;
}

function DropDownTable(props: DropDownProps) {
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const { t } = props;
    return (
        <div>
            <Icon icon={IconTypes.more_dots} onClick={handleClick} />
            <Menu
                id="simple-menu"
                anchorEl={anchorEl}
                keepMounted
                open={Boolean(anchorEl)}
                onClose={handleClose}
            >
                <MenuItem onClick={props.redirect}>
                    {t('dashboard.edit')}
                </MenuItem>
                <MenuItem onClick={props.delete}>
                    {t('dashboard.delete')}
                </MenuItem>
            </Menu>
        </div>
    );
}

const wrapped = withRouter(DropDownTable);

export default withTranslation()(wrapped);

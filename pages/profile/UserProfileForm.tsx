import React from 'react';
import { action, observable } from 'mobx';
import { observer } from 'mobx-react';
import { withTranslation } from 'react-i18next';
import { withRouter } from 'react-router-dom';

import {
    Box,
    Card,
    DropDownOutlined,
    HBox,
    Icon,
    TextArea,
    TextField,
    VBox,
    _Button as Button,
} from '../../components/common';
import TagsInputField from '../../components/common/TagsInputField';
import { UpdateProfileForm } from '../../models/classes';
import { DropDownSelectItem } from '../../models/interfaces';
import { store } from '../../state/Store';
import { getInfluencerCategories } from '../../service/local/data/categories';
import { getCountries } from '../../service/local/data/countries';
import '../register/RegisterForm.css';

interface Props {
    menuItems: DropDownSelectItem[];
    history: any;
    match: any;
    location: any;
    staticContext: any;
    i18n: any;
    t(key, opts?): any;
}

@observer
class UserProfileForm extends React.Component<Props> {
    @observable channelErrorMessage;

    @observable updateProfileError;

    @observable about;

    @observable topics;

    @observable country;

    @observable city;

    @observable post_price;

    @observable story_price;

    @observable video_price;

    @observable user;

    @observable selectedCategories;

    @observable isUpdated;

    @observable fieldShouldBeModified;

    @observable name;

    @observable email;

    @observable phone_number;

    @observable mobile;

    @observable password;

    @observable errorMessage;

    constructor(props) {
        super(props);
        this.selectedCategories = [];
        this.isUpdated = false;
        this.fieldShouldBeModified = false;
        this.name = '';
        this.email = '';
        this.phone_number = '';
        this.mobile = '';
        this.password = '';
        this.errorMessage = '';
    }

    loadData = async () => {
        this.user = store.user.user;
        this.name = this.user?.name;
        this.email = this.user?.email;
        this.phone_number = this.user?.phone_number;
        if (store.userRole === 'influencer') {
            this.topics = this.user?.topics;
            this.about = this.user?.about;
            this.selectedCategories = this.user?.categories;
            this.country = this.user?.country;
            this.city = this.user?.city;
            this.post_price =
                this.user?.post_price !== 0 && this.user?.post_price;
            this.story_price =
                this.user?.story_price !== 0 && this.user?.story_price;
            this.video_price =
                this.user?.video_price !== 0 && this.user?.video_price;
        }
    };

    checkForTopicsFormat = () => {
        if (
            !!this.topics &&
            this.topics?.length === 1 &&
            (this.topics[0].includes(',') || this.topics[0].includes(';'))
        ) {
            this.fieldShouldBeModified = true;
        }
    };

    componentDidMount() {
        this.loadData();
        this.checkForTopicsFormat();
    }

    @action
    submitLogout = async () => {
        store.isFetching = true;
        await store.authStore.logOutUser();
        store.isFetching = false;
        this.errorMessage = store.errorMessage;
        this.props.history.replace('/login');
    };

    @action
    submitChangePassword = async () => {
        this.props.history.replace('/change_password');
    };

    @action
    submitCreateOrganization = async () => {
        this.props.history.replace('/auth/create_account/organization');
    };

    @action
    submitUpdateProfile = async () => {
        if (!this.errorMessage) {
            const form = new UpdateProfileForm();
            form.name = this.name;
            form.email = this.email;
            form.phone_number = this.phone_number;
            if (store.userRole === 'influencer') {
                form.about = this.about;
                form.topics = this.topics;
                form.categories = [...this.selectedCategories];
                form.country = this.country;
                form.city = this.city;
                form.post_price = this.post_price ? this.post_price : 0;
                form.story_price = this.story_price ? this.story_price : 0;
                form.video_price = this.video_price ? this.video_price : 0;
            }
            try {
                await store.user.updateUser(form);
                window.location.reload();
            } catch (error) {
                this.updateProfileError = error;
            }
        }
    };

    addCategory = (categoryValue) => {
        if (!this.selectedCategories.includes(categoryValue)) {
            this.selectedCategories.push(categoryValue);
        }
    };

    removeCategory = (category) => {
        const { t } = this.props;
        if (this.selectedCategories.length > 1) {
            this.selectedCategories = this.selectedCategories.filter(
                (cat) => cat !== category
            );
        } else {
            this.errorMessage = `${t('update_acc.least_one_category')}`;
            setTimeout(() => {
                this.errorMessage = '';
            }, 4000);
        }
    };

    // todo  add also Profile image upload for organizations

    render() {
        const { t } = this.props;
        return (
            <Card borderbox className="user-profile_form">
                <HBox fullwidth borderbox align="between" valign="center">
                    <span className="title gradient bold">
                        {t('update_acc.user_account')}
                    </span>
                    {store.userIsAdmin && (
                        <span
                            className="gradient"
                            style={{ cursor: 'pointer' }}
                            onClick={this.submitCreateOrganization}
                        >
                            {t('update_acc.create_organization')}
                        </span>
                    )}
                    <span
                        className="gradient"
                        style={{ cursor: 'pointer' }}
                        onClick={this.submitChangePassword}
                    >
                        {t('update_acc.change_password')}
                    </span>
                </HBox>
                <Box
                    className="horizontal"
                    fullwidth
                    align="between"
                    style={{ marginTop: '3.7%' }}
                >
                    <TextField
                        fullwidth
                        label={t('update_acc.name')}
                        value={this.name}
                        placeholder={t('update_acc.name_placeholder')}
                        onChange={(event) => {
                            this.name = event.target.value;
                            this.isUpdated = true;
                        }}
                    />

                    <TextField
                        containerStyle={{ marginTop: '3.7%' }}
                        fullwidth
                        label={t('update_acc.email')}
                        value={this.email}
                        placeholder={t('update_acc.email_placeholder')}
                        onChange={(event) => {
                            this.email = event.target.value;
                            this.isUpdated = true;
                        }}
                    />

                    <TextField
                        containerStyle={{ marginTop: '3.7%' }}
                        fullwidth
                        label={t('update_acc.phone_number')}
                        placeholder={t('update_acc.phone_placeholder')}
                        value={this.phone_number}
                        onChange={(event) => {
                            this.phone_number = event.target.value;
                            this.isUpdated = true;
                        }}
                    />

                    {store.userRole === 'influencer' ? (
                        <div>
                            <TextArea
                                containerStyle={{ marginTop: '3.7%' }}
                                className={`${
                                    !this.about && !!this.errorMessage
                                        ? 'errorField'
                                        : ''
                                }`}
                                label={t('update_acc.bio')}
                                placeholder={t('update_acc.bio_placeholder')}
                                value={this.about}
                                maxLength={500}
                                onChange={(event) =>
                                    (this.about = event.target.value)
                                }
                            />
                            <HBox
                                borderbox
                                fullwidth
                                style={{ marginTop: '3.7%' }}
                                valign="center"
                                align="between"
                            >
                                <TagsInputField
                                    className={`${
                                        this.fieldShouldBeModified
                                            ? 'errorField'
                                            : ''
                                    }`}
                                    style={
                                        this.fieldShouldBeModified
                                            ? { width: '97%' }
                                            : {}
                                    }
                                    label={t('update_acc.topics')}
                                    selectedTags={(tags) =>
                                        (this.topics = tags)
                                    }
                                    availableTags={this.topics}
                                />
                                {/* <Icon icon={IconTypes.close} size={12} /> */}
                                {this.fieldShouldBeModified && (
                                    <HBox className="tooltip" valign="center">
                                        <span
                                            className="gradient"
                                            style={{
                                                fontFamily:
                                                    'IBM Plex Mono, monospace',
                                                cursor: 'pointer',
                                            }}
                                        >
                                            i
                                        </span>
                                        <p className="text tooltipText">
                                            {t('update_acc.tooltip_text')}
                                        </p>
                                    </HBox>
                                )}
                            </HBox>
                            <VBox
                                className="categories__container"
                                fullwidth
                                style={{ marginTop: '3.7%' }}
                            >
                                <span
                                    className="label"
                                    style={{ marginBottom: 0 }}
                                >
                                    {t('update_acc.categories')}{' '}
                                </span>
                                <div
                                    className="categories-grid__container"
                                    style={{ marginTop: '.8%' }}
                                >
                                    {this.selectedCategories?.map(
                                        (category, index) => (
                                            <CategoryField
                                                key={index}
                                                category={category}
                                                onClose={() =>
                                                    this.removeCategory(
                                                        category
                                                    )
                                                }
                                                editable={
                                                    this.selectedCategories
                                                        ?.length > 1
                                                }
                                            />
                                        )
                                    )}
                                    {this.selectedCategories?.length < 5 && (
                                        <DropDownOutlined
                                            style={{ width: '100%' }}
                                            labelId="category"
                                            menuItems={getInfluencerCategories()}
                                            value={`${t(
                                                'update_acc.categories'
                                            )}`}
                                            placeholder={t(
                                                'update_acc.categories'
                                            )}
                                            onChange={(event) =>
                                                this.addCategory(
                                                    event.target.value
                                                )
                                            }
                                        />
                                    )}
                                </div>
                            </VBox>

                            <DropDownOutlined
                                style={{
                                    marginTop: '3.7%',
                                    marginRight: '5px',
                                }}
                                className={`${
                                    !this.country && !!this.errorMessage
                                        ? 'errorField'
                                        : ''
                                }`}
                                label={t('update_acc.country.label')}
                                labelId="country"
                                menuItems={getCountries()}
                                value={this.country}
                                onChange={(event) =>
                                    (this.country = event.target.value)
                                }
                            />

                            <TextField
                                containerStyle={{
                                    marginTop: '3.7%',
                                    marginLeft: '15px',
                                }}
                                className={`${
                                    !this.city && !!this.errorMessage
                                        ? 'errorField'
                                        : ''
                                }`}
                                label={t('update_acc.city')}
                                placeholder={t('update_acc.placeholderCity')}
                                value={this.city}
                                onChange={(event) =>
                                    (this.city = event.target.value)
                                }
                            />

                            <TextField
                                containerStyle={{ marginTop: '3.7%' }}
                                fullwidth
                                type="number"
                                // className={`${!this.post_price && !!this.errorMessage ? 'errorField' : ''}`}
                                label={t(
                                    'update_acc.average_price_for_one_post'
                                )}
                                placeholder="100"
                                value={this.post_price}
                                onChange={(event) =>
                                    (this.post_price = event.target.value)
                                }
                            />

                            <TextField
                                containerStyle={{ marginTop: '3.7%' }}
                                fullwidth
                                type="number"
                                // className={`${!this.story_price && !!this.errorMessage ? 'errorField' : ''}`}
                                label={t(
                                    'update_acc.average_price_for_one_story'
                                )}
                                placeholder="50"
                                value={this.story_price}
                                onChange={(event) =>
                                    (this.story_price = event.target.value)
                                }
                            />

                            <TextField
                                containerStyle={{ marginTop: '3.7%' }}
                                fullwidth
                                type="number"
                                // className={`${!this.video_price && !!this.errorMessage ? 'errorField' : ''}`}
                                label={t(
                                    'update_acc.average_price_for_one_video'
                                )}
                                placeholder="150"
                                value={this.video_price}
                                onChange={(event) =>
                                    (this.video_price = event.target.value)
                                }
                            />
                        </div>
                    ) : null}
                </Box>
                <HBox
                    className="horizontal"
                    fullwidth
                    valign="baseline"
                    style={{ marginTop: '3.7%' }}
                >
                    <Button
                        marginRight="1.5%"
                        type="outlined"
                        text={t('update_acc.update_profile')}
                        onClick={() => this.submitUpdateProfile()}
                    />
                    <Button
                        type="outlined"
                        text={t('update_acc.log_out')}
                        onClick={() => this.submitLogout()}
                    />
                </HBox>
            </Card>
        );
    }
}

interface CategoryFieldProps {
    category: string;
    width?: string | number;
    containerStyle?: any;
    editable?: boolean;
    onClose(): void;
}
function CategoryField(props: CategoryFieldProps) {
    const initialStyle = {
        height: 'fit-content',
        width: props.width ?? '100%',
        padding: 10,
        border: '1px solid #ced4da',
        borderRadius: 4,
        display: 'flex',
        boxSizing: 'border-box',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '3.7%',
    };

    return (
        <div
            className="category-field__container"
            style={{ ...initialStyle, ...props.containerStyle }}
        >
            <span className="text">{props.category}</span>
            {props.editable && (
                <Icon
                    icon="close"
                    size={10}
                    color="rgb(60, 63, 6, .8)"
                    style={{ cursor: 'pointer' }}
                    onClick={() => props.onClose()}
                />
            )}
        </div>
    );
}

const wrapped = withRouter(UserProfileForm);
export default withTranslation()(wrapped);

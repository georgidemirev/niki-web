import {
    Box,
    Card,
    DropDownOutlined,
    TextArea,
    TextField,
    VBox,
    _Button as Button,
    _Checkbox as Checkbox,
} from 'components/common';
import TagsInputField from 'components/common/TagsInputField';
import { action, observable } from 'mobx';
import { observer } from 'mobx-react';
import { RegistrationForm } from 'models/classes';
import { DropDownSelectItem, SocialChannel } from 'models/interfaces';
import React from 'react';
import { withTranslation } from 'react-i18next';
import { withRouter } from 'react-router-dom';
import { getInfluencerCategories } from 'service/local/data/categories';
import { getCountries } from 'service/local/data/countries';
import { store } from 'state/Store';
import { getChannels } from '../../service/local/data/channels';
import './RegisterForm.css';

interface Props {
    history: any;
    match: any;
    location: any;
    staticContext: any;
    i18n: any;
    t(key, opts?): any;
}

@observer
class RegisterForm extends React.Component<Props> {
    // http(s)://example.com, http(s)://something.example.com. http(s)://www.example.com
    regEx = /http(s)*:\/\/(\w.)*(\w+).\w+\//g;

    channels: SocialChannel[];

    genderValues;

    @observable errorMessage;

    @observable channelErrorMessage;

    @observable categoriesErrorMessage;

    @observable categoriesMaxMessage;

    @observable registrationError;

    @observable name;

    @observable email;

    @observable phone_number;

    @observable about;

    @observable post_price;

    @observable story_price;

    @observable video_price;

    @observable topics;

    @observable selectedChannels;

    @observable selectedCategories;

    @observable country;

    @observable city;

    @observable selectedCategory;

    @observable gender;

    @observable password;

    @observable agreedToTerms;

    constructor(props) {
        super(props);
        this.channels = getChannels();
        this.topics = [] as string[];
        this.selectedChannels = [] as any[];
        this.selectedCategories = [] as any[5];
        this.agreedToTerms = false;
        this.genderValues = [
            { value: 'female', text: 'Female' },
            { value: 'male', text: 'Male' },
            { value: 'other', text: 'Other' },
        ] as DropDownSelectItem[];
    }

    fieldCheck = async () => {
        const { t } = this.props;
        if (this.selectedChannels.length === 0) {
            this.channelErrorMessage = `${t(
                'registration.msg_social_channel'
            )}`;
        }

        if (this.selectedCategories.length === 0) {
            this.categoriesErrorMessage = `${t('registration.msg_category')}`;
        }

        if (
            !this.agreedToTerms ||
            !this.name ||
            !this.email ||
            !this.password ||
            !this.country ||
            !this.city ||
            this.selectedCategories.length === 0 ||
            this.selectedChannels.length === 0 ||
            !this.allSelectedChannelsAreFilled()
        ) {
            this.errorMessage = `${t('registration.msg_required_fields')}`;
        } else {
            this.errorMessage = null;
        }
    };

    allSelectedChannelsAreFilled() {
        this.selectedChannels.forEach((channel) => {
            if (channel.link.match(this.regEx) === channel.link) {
                return false;
            }
        });
        return true;
    }

    get registerForm() {
        const form = new RegistrationForm();
        form.name = this.name;
        form.email = this.email;
        form.phone_number = this.phone_number;
        form.about = this.about;
        form.topics = this.topics; // this.topics.map(topic => topic.text)
        form.categories = this.selectedCategories.map((cat) => cat.value);
        form.channels = this.selectedChannels.map((channel) => ({
            source: channel.source,
            link: channel.link,
        }));
        form.country = this.country;
        form.city = this.city;
        form.password = this.password;
        form.gender = this.gender;
        form.post_price = this.post_price ? this.post_price : 0;
        form.story_price = this.story_price ? this.story_price : 0;
        form.video_price = this.video_price ? this.video_price : 0;
        return form;
    }

    submit = async () => {
        await this.fieldCheck();
        if (!this.errorMessage) {
            try {
                await store.authStore.registerUser(this.registerForm);
                store.isFetching = false;
                store.userIsLoggedIn = true;
                this.props.history.replace('/influencer_connect');
            } catch (error) {
                store.isFetching = false;
                this.registrationError = error;
            }
        }
    };

    channelIsSelected = (channel) => {
        return this.selectedChannels.some(
            ({ source }) => source === channel.source
        );
    };

    toggleChannel = (channel) => {
        if (!this.channelIsSelected(channel)) {
            this.selectedChannels.push(channel);
        } else {
            this.selectedChannels = this.selectedChannels.filter(
                (ch) => ch.source !== channel.source
            );
        }
    };

    toggleCategory = (category) => {
        const { t } = this.props;
        if (!this.categoryIsAdded(category.value)) {
            if (this.selectedCategories.length < 5) {
                this.selectedCategories.push(category);
            } else
                this.categoriesMaxMessage = `${t(
                    'registration.msg_5_categories'
                )}`;
        } else {
            this.selectedCategories = this.selectedCategories.filter(
                (cat) => cat.value !== category.value
            );
        }

        setTimeout(() => {
            this.categoriesMaxMessage = '';
        }, 5000);
    };

    categoryIsAdded = (categoryValue) => {
        return this.selectedCategories.some(
            ({ value }) => value === categoryValue
        );
    };

    @action
    setChannelLink = (channel, linkValue) => {
        this.selectedChannels.forEach((ch) => {
            if (ch.source === channel.source) {
                ch.link = linkValue;
            }
        });
    };

    @action
    onPressLogin = () => {
        this.props.history.replace('/login');
    };

    render() {
        const { t } = this.props;

        return (
            <div className="App-Content_wrapper card-centered gradient-container">
                <Card borderbox className="register-form__card">
                    <span className="title bold gradient">
                        {t('registration.registration')}
                    </span>
                    {!!this.registrationError && (
                        <span
                            className="text"
                            style={{ color: '#ED0238', marginTop: '2vh' }}
                        >
                            {this.registrationError}
                        </span>
                    )}
                    <Box className="horizontal" fullwidth align="between">
                        <TextField
                            classNameContainer="input-field_container marginTop"
                            className={`${
                                !this.name && !!this.errorMessage
                                    ? 'errorField'
                                    : ''
                            }`}
                            label={t('registration.name')}
                            placeholder={t('registration.placeholder_name')}
                            value={this.name}
                            onChange={(event) =>
                                (this.name = event.target.value)
                            }
                        />

                        <TextField
                            classNameContainer="input-field_container marginTop"
                            className={`${
                                !this.email && !!this.errorMessage
                                    ? 'errorField'
                                    : ''
                            }`}
                            label={t('registration.email')}
                            placeholder="myemail@example.com"
                            value={this.email}
                            onChange={(event) =>
                                (this.email = event.target.value.trim())
                            }
                        />

                        <TextField
                            containerStyle={{ marginTop: '3.7%' }}
                            label={t('registration.phone_number')}
                            placeholder={t('registration.placeholder_number')}
                            value={this.phone_number}
                            onChange={(event) =>
                                (this.phone_number = event.target.value)
                            }
                        />

                        <TextArea
                            containerStyle={{ marginTop: '3.7%' }}
                            className={`${
                                !this.about && !!this.errorMessage
                                    ? 'errorField'
                                    : ''
                            }`}
                            label={t('registration.bio')}
                            placeholder={t('registration.placeholder_bio')}
                            value={this.about}
                            maxLength={300}
                            onChange={(event) =>
                                (this.about = event.target.value)
                            }
                        />

                        <TagsInputField
                            label={t('registration.topics')}
                            placeholder={t('registration.placeholder_topics')}
                            style={{ marginTop: '3.7%' }}
                            selectedTags={(tags) => (this.topics = tags)}
                        />
                        <VBox
                            fullwidth
                            className="categories__container"
                            style={{ marginTop: '3.7%' }}
                        >
                            <span
                                className="label small"
                                style={{ marginBottom: 0 }}
                            >
                                {t('registration.categories')}
                            </span>
                            {!!this.categoriesMaxMessage && (
                                <span
                                    className="text"
                                    style={{ color: '#8D06FF' }}
                                >
                                    {this.categoriesMaxMessage}
                                </span>
                            )}
                            {!!this.categoriesErrorMessage &&
                                this.selectedCategories.length === 0 && (
                                    <span
                                        className="text"
                                        style={{ color: '#8D06FF' }}
                                    >
                                        {this.categoriesErrorMessage}
                                    </span>
                                )}
                            <div className="categories-grid__container">
                                {getInfluencerCategories().map((category) => (
                                    <Checkbox
                                        className={`${
                                            this.selectedCategories.length <
                                                1 && !!this.errorMessage
                                                ? 'errorCheckbox'
                                                : ''
                                        }`}
                                        checked={this.categoryIsAdded(
                                            category.value
                                        )}
                                        label={
                                            <span className="text">
                                                {category.text}
                                            </span>
                                        }
                                        onChange={(event) =>
                                            this.toggleCategory(category)
                                        }
                                    />
                                ))}
                            </div>
                        </VBox>
                        <VBox
                            fullwidth
                            className="channels__container"
                            style={{ marginTop: '3.7%' }}
                        >
                            <span
                                className="label small"
                                style={{ marginBottom: 0 }}
                            >
                                {t('registration.channels')}
                            </span>
                            {!!this.channelErrorMessage &&
                                this.selectedChannels.length === 0 && (
                                    <span
                                        className="text"
                                        style={{ color: '#8D06FF' }}
                                    >
                                        {this.channelErrorMessage}
                                    </span>
                                )}
                            <div className="channels-grid__container">
                                {this.channels.map((channel) => (
                                    <Checkbox
                                        className={`${
                                            this.selectedChannels.length < 1 &&
                                            !!this.errorMessage
                                                ? 'errorCheckbox'
                                                : ''
                                        }`}
                                        checked={this.channelIsSelected(
                                            channel
                                        )}
                                        label={
                                            <span className="text">
                                                {channel.name}
                                            </span>
                                        }
                                        onChange={(event) =>
                                            this.toggleChannel(channel)
                                        }
                                    />
                                ))}
                            </div>
                        </VBox>
                        {this.selectedChannels.length > 0 && (
                            <div className="channel__input-fields__container">
                                {this.selectedChannels.map((channel) => (
                                    <TextField
                                        ref={channel.source}
                                        classNameContainer="input-field_container"
                                        className={`${
                                            this.channelIsSelected(channel) &&
                                            !!channel.link?.match(this.regEx) &&
                                            channel.link?.match(
                                                this.regEx
                                            )[0] === channel.link &&
                                            !!this.errorMessage
                                                ? 'errorField'
                                                : ''
                                        }`}
                                        label={channel.name}
                                        placeholder="Post link to social channel"
                                        value={channel.link}
                                        onChange={(event) =>
                                            this.setChannelLink(
                                                channel,
                                                event.target.value
                                            )
                                        }
                                    />
                                ))}
                            </div>
                        )}
                        <div className="input-fields__container">
                            <TextField
                                containerStyle={{ marginTop: '3.7%' }}
                                className={`${
                                    !this.city && !!this.errorMessage
                                        ? 'errorField'
                                        : ''
                                }`}
                                label={t('registration.city')}
                                placeholder={t(
                                    'registration.placeholder_location'
                                )}
                                value={this.city}
                                onChange={(event) =>
                                    (this.city = event.target.value)
                                }
                            />
                            <DropDownOutlined
                                style={{ marginTop: '3.7%' }}
                                className={`${
                                    !this.country && !!this.errorMessage
                                        ? 'errorField'
                                        : ''
                                }`}
                                label={t('registration.country.label')}
                                labelId="country"
                                menuItems={getCountries()}
                                value={this.country}
                                onChange={(event) =>
                                    (this.country = event.target.value)
                                }
                            />
                            <TextField
                                containerStyle={{ marginTop: '3.7%' }}
                                type="number"
                                label={t(
                                    'registration.average_price_for_one_post'
                                )}
                                placeholder="100"
                                value={this.post_price}
                                onChange={(event) =>
                                    (this.post_price = event.target.value)
                                }
                            />
                            <TextField
                                containerStyle={{ marginTop: '3.7%' }}
                                type="number"
                                label={t(
                                    'registration.average_price_for_one_story'
                                )}
                                placeholder="50"
                                value={this.story_price}
                                onChange={(event) =>
                                    (this.story_price = event.target.value)
                                }
                            />
                            <TextField
                                containerStyle={{ marginTop: '3.7%' }}
                                type="number"
                                label={t(
                                    'registration.average_price_for_one_video'
                                )}
                                placeholder="150"
                                value={this.video_price}
                                onChange={(event) =>
                                    (this.video_price = event.target.value)
                                }
                            />
                            <DropDownOutlined
                                style={{ marginTop: '3.7%' }}
                                className={`${
                                    !this.gender && !!this.errorMessage
                                        ? 'errorField'
                                        : ''
                                }`}
                                label={t('registration.gender.gender')}
                                labelId="gender"
                                menuItems={this.genderValues.map((gender) => ({
                                    ...gender,
                                    text: t(
                                        `registration.gender.${gender.value}`
                                    ),
                                }))}
                                value={this.gender}
                                onChange={(event) =>
                                    (this.gender = event.target.value)
                                }
                            />
                            <TextField
                                containerStyle={{ marginTop: '3.7%' }}
                                className={`${
                                    !this.password && !!this.errorMessage
                                        ? 'errorField'
                                        : ''
                                }`}
                                label={t('registration.password')}
                                value={this.password}
                                onChange={(event) =>
                                    (this.password = event.target.value)
                                }
                                type="password"
                            />
                        </div>
                    </Box>
                    <Box
                        className="checkbox"
                        valign="center"
                        style={{ marginTop: '2vh' }}
                    >
                        <Checkbox
                            className={`${
                                !this.agreedToTerms && !!this.errorMessage
                                    ? 'errorCheckbox'
                                    : ''
                            }`}
                            label=""
                            checked={this.agreedToTerms}
                            onChange={(event) =>
                                (this.agreedToTerms = !this.agreedToTerms)
                            }
                        />
                        <span className="text">
                            {t('registration.terms_policy_accept')}{' '}
                            <a target="_blank" href="/terms_of_use">
                                {' '}
                                {t('registration.terms_of_use')}{' '}
                            </a>{' '}
                            {t('registration.and')}{' '}
                            <a target="_blank" href="/privacy_policy">
                                {' '}
                                {t('registration.privacy_policy')}.
                            </a>
                        </span>
                    </Box>

                    {!!this.registrationError && (
                        <span
                            className="text"
                            style={{ color: '#ED0238', marginTop: '2vh' }}
                        >
                            {this.registrationError}
                        </span>
                    )}

                    <Box
                        className="horizontal button"
                        fullwidth
                        align="between"
                        valign="center"
                        style={{ marginTop: '2vh' }}
                    >
                        <Button
                            marginRight="1.5%"
                            text={t('registration.register')}
                            onClick={() => this.submit()}
                        />
                        {t('registration.or')}
                        <Button
                            marginLeft="1.5%"
                            type="outlined"
                            text={t('registration.login_from_here')}
                            onClick={() => this.onPressLogin()}
                        />
                    </Box>
                </Card>
            </div>
        );
    }
}

const wrapped = withRouter(RegisterForm);

export default withTranslation()(wrapped);

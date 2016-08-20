/**
 * Created by jack on 16-8-16.
 */

import {createAction} from '../../common/actionHelper';
import {LOAD_SOCIAL_LINK} from './mutation_types';
import SocialLinkSetting from './setting';

const loadSocialLink = ({commit}) => commit(createAction(LOAD_SOCIAL_LINK, SocialLinkSetting));

export default {loadSocialLink};

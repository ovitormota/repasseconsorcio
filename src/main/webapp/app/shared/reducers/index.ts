import { loadingBarReducer as loadingBar } from 'react-redux-loading-bar';

import locale from './locale';
import authentication from './authentication';
import applicationProfile from './application-profile';

import administration from 'app/modules/administration/administration.reducer';
import userManagement from 'app/modules/administration/user-management/user-management.reducer';
import register from 'app/modules/account/register/register.reducer';
import activate from 'app/modules/account/activate/activate.reducer';
import password from 'app/modules/account/password/password.reducer';
import settings from 'app/modules/account/settings/settings.reducer';
import passwordReset from 'app/modules/account/password-reset/password-reset.reducer';
// prettier-ignore
import consortiumAdministrator from 'app/entities/consortium-administrator/consortium-administrator.reducer';
// prettier-ignore
import bid from 'app/entities/bid/bid.reducer';
// prettier-ignore
import consortium from 'app/entities/consortium/consortium.reducer';
/* jhipster-needle-add-reducer-import - JHipster will add reducer here */
import proposalsForApproval from 'app/entities/proposals-for-approval/proposals-for-approval.reducer';

const rootReducer = {
    authentication,
    locale,
    applicationProfile,
    administration,
    userManagement,
    register,
    activate,
    passwordReset,
    password,
    settings,
    consortiumAdministrator,
    bid,
    consortium,
    proposalsForApproval,
    /* jhipster-needle-add-reducer-combine - JHipster will add reducer here */
    loadingBar,
};

export default rootReducer;

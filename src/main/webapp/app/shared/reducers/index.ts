import { loadingBarReducer as loadingBar } from 'react-redux-loading-bar'

import locale from './locale'
import authentication from './authentication'
import applicationProfile from './application-profile'

import administration from 'app/modules/administration/administration.reducer'
import userManagement from 'app/modules/administration/user-management/user-management.reducer'
import register from 'app/modules/account/register/register.reducer'
import activate from 'app/modules/account/activate/activate.reducer'
import password from 'app/modules/account/password/password.reducer'
import settings from 'app/modules/account/settings/settings.reducer'
import passwordReset from 'app/modules/account/password-reset/password-reset.reducer'
import consortiumAdministrator from 'app/entities/consortium-administrator/consortium-administrator.reducer'
import bid from 'app/entities/bid/bid.reducer'
import bidByConsortium from 'app/entities/bid/bid-by-consortium.reducer'
import consortium from 'app/entities/consortium/consortium.reducer'
import proposalsForApproval from 'app/entities/proposals-for-approval/proposals-for-approval.reducer'
import myProposals from 'app/modules/proposals/my-proposal.reducer'
import notificationToken from 'app/entities/notification-token/notification-token.reducer'
import consortiumInstallments from 'app/entities/consortium-installments/consortium-installments.reducer'

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
  bidByConsortium,
  consortium,
  proposalsForApproval,
  myProposals,
  notificationToken,
  consortiumInstallments,
  /* jhipster-needle-add-reducer-combine - JHipster will add reducer here */
  loadingBar,
}

export default rootReducer

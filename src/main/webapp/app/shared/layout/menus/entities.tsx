import React from 'react';
import MenuItem from 'app/shared/layout/menus/menu-item';
import { Translate, translate } from 'react-jhipster';
import { NavDropdown } from './menu-components';

export const EntitiesMenu = props => (
  <NavDropdown
    icon="th-list"
    name={translate('global.menu.entities.main')}
    id="entity-menu"
    data-cy="entity"
    style={{ maxHeight: '80vh', overflow: 'auto' }}
  >
    <>{/* to avoid warnings when empty */}</>
    <MenuItem icon="asterisk" to="/consortium-administrator">
      <Translate contentKey="global.menu.entities.consortiumAdministrator" />
    </MenuItem>
    <MenuItem icon="asterisk" to="/bid">
      <Translate contentKey="global.menu.entities.bid" />
    </MenuItem>
    <MenuItem icon="asterisk" to="/consortium">
      <Translate contentKey="global.menu.entities.consortium" />
    </MenuItem>
    {/* jhipster-needle-add-entity-to-menu - JHipster will add entities to the menu here */}
  </NavDropdown>
);

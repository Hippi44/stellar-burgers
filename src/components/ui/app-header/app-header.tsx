import React, { FC } from 'react';
import styles from './app-header.module.css';
import { TAppHeaderUIProps } from './type';
import clsx from 'clsx';
import { NavLink } from 'react-router-dom';
import {
  BurgerIcon,
  ListIcon,
  Logo,
  ProfileIcon
} from '@zlden/react-developer-burger-ui-components';

export const AppHeaderUI: FC<TAppHeaderUIProps> = ({ userName }) => (
  <header className={styles.header}>
    <nav className={clsx(styles.menu, 'p-4')}>
      <div className={styles.menu_part_left}>
        <NavLink
          to='/'
          end
          className={({ isActive }) =>
            clsx(
              'text text_type_main-default',
              styles.headerNavPill,
              isActive && styles.headerNavPill_active
            )
          }
        >
          {({ isActive }) => (
            <>
              <BurgerIcon type={isActive ? 'primary' : 'secondary'} />
              <span>Конструктор</span>
            </>
          )}
        </NavLink>
        <NavLink
          to='/feed'
          className={({ isActive }) =>
            clsx(
              'text text_type_main-default',
              styles.headerNavPill,
              isActive && styles.headerNavPill_active
            )
          }
        >
          {({ isActive }) => (
            <>
              <ListIcon type={isActive ? 'primary' : 'secondary'} />
              <span>Лента заказов</span>
            </>
          )}
        </NavLink>
      </div>
      <div className={styles.logo}>
        <NavLink to='/' aria-label='На главную' className={styles.logoLink}>
          <Logo className='' />
        </NavLink>
      </div>
      <div className={styles.menu_part_right}>
        <NavLink
          to='/profile'
          className={({ isActive }) =>
            clsx(
              'text text_type_main-default',
              styles.headerNavPill,
              isActive && styles.headerNavPill_active
            )
          }
        >
          {({ isActive }) => (
            <>
              <ProfileIcon type={isActive ? 'primary' : 'secondary'} />
              <span className={styles.profileButtonText}>
                {userName || 'Личный кабинет'}
              </span>
            </>
          )}
        </NavLink>
      </div>
    </nav>
  </header>
);

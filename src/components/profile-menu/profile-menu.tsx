import { FC } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ProfileMenuUI } from '@ui';
import { useDispatch } from '../../services/store';
import { logoutUser } from '@slices/user-slice';
import { clearConstructor } from '@slices/constructor-slice';
import { closeOrderModal } from '@slices/order-slice';

export const ProfileMenu: FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const handleLogout = () => {
    dispatch(logoutUser()).then((action) => {
      if (logoutUser.fulfilled.match(action)) {
        dispatch(clearConstructor());
        dispatch(closeOrderModal());
        navigate('/login', { replace: true });
      }
    });
  };

  return <ProfileMenuUI handleLogout={handleLogout} pathname={pathname} />;
};

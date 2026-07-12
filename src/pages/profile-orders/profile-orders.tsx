import { ProfileOrdersUI } from '@ui-pages';
import { FC, useEffect } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import { fetchOrderHistory } from '@slices/order-history-slice';
import { selectOrderHistoryOrders } from '@selectors/order-history';

export const ProfileOrders: FC = () => {
  const dispatch = useDispatch();
  const orders = useSelector(selectOrderHistoryOrders);

  useEffect(() => {
    dispatch(fetchOrderHistory());
  }, [dispatch]);

  return <ProfileOrdersUI orders={orders} />;
};

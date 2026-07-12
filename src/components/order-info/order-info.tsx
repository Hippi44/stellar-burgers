import { FC, useEffect, useMemo } from 'react';
import { Preloader } from '../ui/preloader';
import { OrderInfoUI } from '../ui/order-info';
import { TIngredient } from '@utils-types';
import { useDispatch, useSelector } from '../../services/store';
import {
  selectOrderError,
  selectSelectedOrder,
  selectSelectedOrderLoading
} from '@selectors/order';
import {
  selectIngredients,
  selectIngredientsError,
  selectIngredientsLoading
} from '@selectors/ingredients';
import { useParams } from 'react-router-dom';
import { fetchOrderByNumber } from '@slices/order-slice';

export const OrderInfo: FC = () => {
  const dispatch = useDispatch();
  const { id } = useParams();
  const orderData = useSelector(selectSelectedOrder);
  const selectedOrderLoading = useSelector(selectSelectedOrderLoading);
  const orderError = useSelector(selectOrderError);
  const ingredients = useSelector(selectIngredients);
  const ingredientsLoading = useSelector(selectIngredientsLoading);
  const ingredientsError = useSelector(selectIngredientsError);

  useEffect(() => {
    if (id) {
      dispatch(fetchOrderByNumber(Number(id)));
    }
  }, [dispatch, id]);

  /* Готовим данные для отображения */
  const orderInfo = useMemo(() => {
    if (!orderData || !ingredients.length) return null;

    const date = new Date(orderData.createdAt);

    type TIngredientsWithCount = {
      [key: string]: TIngredient & { count: number };
    };

    const ingredientsInfo = orderData.ingredients.reduce(
      (acc: TIngredientsWithCount, item) => {
        if (!acc[item]) {
          const ingredient = ingredients.find((ing) => ing._id === item);
          if (ingredient) {
            acc[item] = {
              ...ingredient,
              count: 1
            };
          }
        } else {
          acc[item].count++;
        }

        return acc;
      },
      {}
    );

    const total = Object.values(ingredientsInfo).reduce(
      (acc, item) => acc + item.price * item.count,
      0
    );

    return {
      ...orderData,
      ingredientsInfo,
      date,
      total
    };
  }, [orderData, ingredients]);

  if (selectedOrderLoading) {
    return <Preloader />;
  }

  if (!orderData && orderError) {
    return <p className='text text_type_main-default p-10'>{orderError}</p>;
  }

  if (!orderData) {
    return <p className='text text_type_main-default p-10'>Заказ не найден.</p>;
  }

  if (ingredientsError) {
    return (
      <p className='text text_type_main-default p-10'>{ingredientsError}</p>
    );
  }

  if (!ingredients.length && ingredientsLoading) {
    return <Preloader />;
  }

  if (!orderInfo) {
    return (
      <p className='text text_type_main-default p-10'>
        Не удалось отобразить заказ.
      </p>
    );
  }

  return <OrderInfoUI orderInfo={orderInfo} />;
};

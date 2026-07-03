import { TConstructorIngredient, TIngredient } from '@utils-types';
import { TOrder } from '@utils-types';

export type BurgerConstructorUIProps = {
  constructorItems: {
    bun: TIngredient | null;
    ingredients: TConstructorIngredient[];
  };
  orderRequest: boolean;
  price: number;
  orderModalData: Pick<TOrder, 'number'> | null;
  onOrderClick: () => void;
  closeOrderModal: () => void;
};

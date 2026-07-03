import { RootState } from '../store';
import { TConstructorIngredient, TIngredient } from '@utils-types';

type TConstructorItems = {
  bun: TIngredient | null;
  ingredients: TConstructorIngredient[];
};

const emptyConstructorItems: TConstructorItems = {
  bun: null,
  ingredients: []
};

export const selectConstructorItems = (state: RootState): TConstructorItems =>
  state.burgerConstructor ?? emptyConstructorItems;

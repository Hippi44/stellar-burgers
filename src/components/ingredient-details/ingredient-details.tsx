import { FC } from 'react';
import { Preloader } from '../ui/preloader';
import { IngredientDetailsUI } from '../ui/ingredient-details';
import { useSelector } from '../../services/store';
import {
  selectIngredients,
  selectIngredientsError,
  selectIngredientsLoading
} from '@selectors/ingredients';
import { useParams } from 'react-router-dom';

export const IngredientDetails: FC = () => {
  const { id } = useParams();
  const ingredients = useSelector(selectIngredients);
  const ingredientsLoading = useSelector(selectIngredientsLoading);
  const ingredientsError = useSelector(selectIngredientsError);

  const ingredientData = ingredients.find(
    (ingredient) => ingredient._id === id
  );

  if (!ingredientData) {
    if (ingredientsError) {
      return (
        <p className='text text_type_main-default p-10'>{ingredientsError}</p>
      );
    }
    if (ingredientsLoading || ingredients.length === 0) {
      return <Preloader />;
    }
    return (
      <p className='text text_type_main-default p-10'>Ингредиент не найден.</p>
    );
  }

  return <IngredientDetailsUI ingredientData={ingredientData} />;
};

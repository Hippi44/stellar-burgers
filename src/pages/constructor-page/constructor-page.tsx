import { FC } from 'react';
import { useSelector } from '../../services/store';
import { selectIngredientsLoading } from '@selectors/ingredients';
import { ConstructorPageUI } from '@ui-pages';

export const ConstructorPage: FC = () => {
  const isIngredientsLoading = useSelector(selectIngredientsLoading);
  return <ConstructorPageUI isIngredientsLoading={isIngredientsLoading} />;
};

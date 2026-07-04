import { ingredientsReducer, fetchIngredients, initialState } from '../ingredients-slice';
import { TIngredient } from '@utils-types';

const createIngredient = (
  overrides: Partial<TIngredient> = {}
): TIngredient => ({
  _id: 'test-id',
  name: 'Test Ingredient',
  type: 'main',
  proteins: 10,
  fat: 5,
  carbohydrates: 20,
  calories: 100,
  price: 50,
  image: 'test.png',
  image_large: 'test-large.png',
  image_mobile: 'test-mobile.png',
  ...overrides
});

describe('ingredients slice', () => {
  it('should return initial state for unknown action', () => {
    const state = ingredientsReducer(undefined, { type: 'UNKNOWN' });
    expect(state).toEqual(initialState);
  });

  describe('fetchIngredients', () => {
    it('should set isLoading to true on pending', () => {
      const state = ingredientsReducer(initialState, {
        type: fetchIngredients.pending.type
      });
      expect(state.isLoading).toBe(true);
      expect(state.error).toBeNull();
    });

    it('should set items on fulfilled', () => {
      const ingredients = [
        createIngredient({ _id: '1', name: 'Ingredient 1' }),
        createIngredient({ _id: '2', name: 'Ingredient 2' })
      ];
      const state = ingredientsReducer(initialState, {
        type: fetchIngredients.fulfilled.type,
        payload: ingredients
      });
      expect(state.isLoading).toBe(false);
      expect(state.items).toEqual(ingredients);
    });

    it('should set error on rejected with string payload', () => {
      const state = ingredientsReducer(initialState, {
        type: fetchIngredients.rejected.type,
        payload: 'Failed to load ingredients'
      });
      expect(state.isLoading).toBe(false);
      expect(state.error).toBe('Failed to load ingredients');
    });

    it('should set error on rejected without payload', () => {
      const state = ingredientsReducer(initialState, {
        type: fetchIngredients.rejected.type,
        error: { message: 'Network error' }
      });
      expect(state.isLoading).toBe(false);
      expect(state.error).toBe('Network error');
    });
  });
});

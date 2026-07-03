import {
  constructorReducer,
  addIngredient,
  removeIngredient,
  moveIngredientUp,
  moveIngredientDown,
  clearConstructor
} from '../constructor-slice';
import { TConstructorIngredient, TIngredient } from '@utils-types';

const createIngredient = (
  overrides: Partial<TConstructorIngredient> = {}
): TConstructorIngredient => ({
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
  id: 'uuid-1',
  ...overrides
});

const createBun = (overrides: Partial<TIngredient> = {}): TIngredient => ({
  _id: 'bun-id',
  name: 'Test Bun',
  type: 'bun',
  proteins: 10,
  fat: 5,
  carbohydrates: 20,
  calories: 100,
  price: 50,
  image: 'bun.png',
  image_large: 'bun-large.png',
  image_mobile: 'bun-mobile.png',
  ...overrides
});

describe('constructor slice', () => {
  const initialState = {
    bun: null,
    ingredients: []
  };

  it('should return initial state for unknown action', () => {
    const state = constructorReducer(undefined, { type: 'UNKNOWN' });
    expect(state).toEqual(initialState);
  });

  describe('addIngredient', () => {
    it('should add ingredient to constructor', () => {
      const ingredient = createIngredient();
      const state = constructorReducer(initialState, addIngredient(ingredient));
      expect(state.ingredients).toHaveLength(1);
      expect(state.ingredients[0]).toEqual(ingredient);
    });

    it('should replace bun when adding bun type', () => {
      const bun = createBun();
      const state = constructorReducer(
        initialState,
        addIngredient(bun as TConstructorIngredient)
      );
      expect(state.bun).toEqual(bun);
      expect(state.ingredients).toHaveLength(0);
    });

    it('should replace existing bun with new bun', () => {
      const firstBun = createBun({ _id: 'bun-1', name: 'First Bun' });
      const secondBun = createBun({ _id: 'bun-2', name: 'Second Bun' });
      let state = constructorReducer(
        initialState,
        addIngredient(firstBun as TConstructorIngredient)
      );
      state = constructorReducer(
        state,
        addIngredient(secondBun as TConstructorIngredient)
      );
      expect(state.bun?._id).toBe('bun-2');
      expect(state.bun?.name).toBe('Second Bun');
    });
  });

  describe('removeIngredient', () => {
    it('should remove ingredient by id', () => {
      const ingredient1 = createIngredient({ id: 'uuid-1' });
      const ingredient2 = createIngredient({ id: 'uuid-2' });
      const stateWithIngredients = {
        bun: null,
        ingredients: [ingredient1, ingredient2]
      };
      const state = constructorReducer(
        stateWithIngredients,
        removeIngredient('uuid-1')
      );
      expect(state.ingredients).toHaveLength(1);
      expect(state.ingredients[0].id).toBe('uuid-2');
    });
  });

  describe('moveIngredientUp', () => {
    it('should swap ingredient with previous one', () => {
      const ingredient1 = createIngredient({ id: 'uuid-1', name: 'First' });
      const ingredient2 = createIngredient({ id: 'uuid-2', name: 'Second' });
      const stateWithIngredients = {
        bun: null,
        ingredients: [ingredient1, ingredient2]
      };
      const state = constructorReducer(
        stateWithIngredients,
        moveIngredientUp(1)
      );
      expect(state.ingredients[0].id).toBe('uuid-2');
      expect(state.ingredients[1].id).toBe('uuid-1');
    });

    it('should not move first ingredient up', () => {
      const ingredient = createIngredient({ id: 'uuid-1' });
      const stateWithIngredients = {
        bun: null,
        ingredients: [ingredient]
      };
      const state = constructorReducer(
        stateWithIngredients,
        moveIngredientUp(0)
      );
      expect(state.ingredients[0].id).toBe('uuid-1');
    });
  });

  describe('moveIngredientDown', () => {
    it('should swap ingredient with next one', () => {
      const ingredient1 = createIngredient({ id: 'uuid-1', name: 'First' });
      const ingredient2 = createIngredient({ id: 'uuid-2', name: 'Second' });
      const stateWithIngredients = {
        bun: null,
        ingredients: [ingredient1, ingredient2]
      };
      const state = constructorReducer(
        stateWithIngredients,
        moveIngredientDown(0)
      );
      expect(state.ingredients[0].id).toBe('uuid-2');
      expect(state.ingredients[1].id).toBe('uuid-1');
    });

    it('should not move last ingredient down', () => {
      const ingredient = createIngredient({ id: 'uuid-1' });
      const stateWithIngredients = {
        bun: null,
        ingredients: [ingredient]
      };
      const state = constructorReducer(
        stateWithIngredients,
        moveIngredientDown(0)
      );
      expect(state.ingredients[0].id).toBe('uuid-1');
    });
  });

  describe('clearConstructor', () => {
    it('should reset constructor to initial state', () => {
      const bun = createBun();
      const ingredient = createIngredient();
      const stateWithItems = {
        bun,
        ingredients: [ingredient]
      };
      const state = constructorReducer(stateWithItems, clearConstructor());
      expect(state.bun).toBeNull();
      expect(state.ingredients).toHaveLength(0);
    });
  });
});

import React, { FC } from 'react';
import {
  Button,
  ConstructorElement,
  CurrencyIcon,
  MoveButton
} from '@zlden/react-developer-burger-ui-components';
import styles from './burger-constructor.module.css';
import { BurgerConstructorUIProps } from './type';
import { TConstructorIngredient } from '@utils-types';
import { BurgerConstructorElement, Modal } from '@components';
import { Preloader, OrderDetailsUI } from '@ui';

export const BurgerConstructorUI: FC<BurgerConstructorUIProps> = ({
  constructorItems,
  orderRequest,
  price,
  orderModalData,
  onOrderClick,
  closeOrderModal
}) => (
  <section className={styles.burger_constructor}>
    {constructorItems.bun ? (
      <div className={`${styles.bunRow} mb-4`}>
        <div className={styles.dragIconHidden} aria-hidden>
          <MoveButton
            handleMoveUp={() => {}}
            handleMoveDown={() => {}}
            isUpDisabled
            isDownDisabled
          />
        </div>
        <div className={`${styles.bunElementWrap} ml-2`}>
          <ConstructorElement
            type='top'
            isLocked
            text={`${constructorItems.bun.name} (верх)`}
            price={constructorItems.bun.price}
            thumbnail={constructorItems.bun.image}
          />
        </div>
      </div>
    ) : (
      <div className={`${styles.bunRow} mb-4`}>
        <div className={styles.dragIconHidden} aria-hidden>
          <MoveButton
            handleMoveUp={() => {}}
            handleMoveDown={() => {}}
            isUpDisabled
            isDownDisabled
          />
        </div>
        <div className={`${styles.bunElementWrap} ml-2`}>
          <div
            className={`${styles.noBuns} ${styles.noBunsTop} text text_type_main-default`}
          >
            Выберите булки
          </div>
        </div>
      </div>
    )}
    {constructorItems.ingredients.length > 0 ? (
      <ul className={styles.elements}>
        {constructorItems.ingredients.map(
          (item: TConstructorIngredient, index: number) => (
            <BurgerConstructorElement
              ingredient={item}
              index={index}
              totalItems={constructorItems.ingredients.length}
              key={item.id}
            />
          )
        )}
      </ul>
    ) : (
      <div className={styles.elementsEmpty}>
        <div className={styles.bunRow}>
          <div className={styles.dragIconHidden} aria-hidden>
            <MoveButton
              handleMoveUp={() => {}}
              handleMoveDown={() => {}}
              isUpDisabled
              isDownDisabled
            />
          </div>
          <div className={`${styles.bunElementWrap} ml-2`}>
            <div
              className={`${styles.noBuns} ${styles.noBunsMiddle} text text_type_main-default`}
            >
              Выберите начинку
            </div>
          </div>
        </div>
      </div>
    )}
    {constructorItems.bun ? (
      <div className={`${styles.bunRow} mt-4`}>
        <div className={styles.dragIconHidden} aria-hidden>
          <MoveButton
            handleMoveUp={() => {}}
            handleMoveDown={() => {}}
            isUpDisabled
            isDownDisabled
          />
        </div>
        <div className={`${styles.bunElementWrap} ml-2`}>
          <ConstructorElement
            type='bottom'
            isLocked
            text={`${constructorItems.bun.name} (низ)`}
            price={constructorItems.bun.price}
            thumbnail={constructorItems.bun.image}
          />
        </div>
      </div>
    ) : (
      <div className={`${styles.bunRow} mt-4`}>
        <div className={styles.dragIconHidden} aria-hidden>
          <MoveButton
            handleMoveUp={() => {}}
            handleMoveDown={() => {}}
            isUpDisabled
            isDownDisabled
          />
        </div>
        <div className={`${styles.bunElementWrap} ml-2`}>
          <div
            className={`${styles.noBuns} ${styles.noBunsBottom} text text_type_main-default`}
          >
            Выберите булки
          </div>
        </div>
      </div>
    )}
    <div className={`${styles.total} mt-10`}>
      <div className={styles.cost}>
        <p className={`text ${styles.text} mr-2`}>{price}</p>
        <CurrencyIcon type='primary' />
      </div>
      <Button
        htmlType='button'
        type='primary'
        size='large'
        extraClass={styles.orderButton}
        children='Оформить заказ'
        onClick={onOrderClick}
      />
    </div>

    {orderRequest && (
      <Modal onClose={closeOrderModal} title={'Оформляем заказ...'}>
        <Preloader />
      </Modal>
    )}

    {orderModalData && (
      <Modal
        onClose={closeOrderModal}
        title={orderRequest ? 'Оформляем заказ...' : ''}
      >
        <OrderDetailsUI orderNumber={orderModalData.number} />
      </Modal>
    )}
  </section>
);

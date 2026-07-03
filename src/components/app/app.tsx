import { FC, useEffect } from 'react';
import {
  BrowserRouter,
  Route,
  Routes,
  useLocation,
  useNavigate
} from 'react-router-dom';
import { useDispatch } from '../../services/store';
import { fetchUser, setAuthChecked } from '@slices/user-slice';
import { fetchIngredients } from '@slices/ingredients-slice';
import { getCookie } from '../../utils/cookie';
import { useSelector } from '../../services/store';
import { selectIsAuthChecked } from '@selectors/user';

import {
  ConstructorPage,
  Feed,
  ForgotPassword,
  Login,
  NotFound404,
  Profile,
  ProfileOrders,
  Register,
  ResetPassword
} from '@pages';
import '../../index.css';
import styles from './app.module.css';

import {
  AppHeader,
  IngredientDetails,
  Modal,
  OrderInfo,
  ProtectedRoute
} from '@components';

const AppRoutes = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isAuthChecked = useSelector(selectIsAuthChecked);
  const background = location.state?.background;
  const closeModal = () => navigate(-1);

  useEffect(() => {
    const accessToken = getCookie('accessToken');
    const refreshToken = localStorage.getItem('refreshToken');

    if (!accessToken || !refreshToken) {
      if (!isAuthChecked) {
        dispatch(setAuthChecked());
      }
      return;
    }

    dispatch(fetchUser());
  }, [dispatch, isAuthChecked]);

  useEffect(() => {
    dispatch(fetchIngredients());
  }, [dispatch]);

  return (
    <div className={styles.app}>
      <AppHeader />
      <Routes location={background || location}>
        <Route path='/' element={<ConstructorPage />} />
        <Route path='/feed' element={<Feed />} />
        <Route
          path='/login'
          element={<ProtectedRoute onlyUnAuth component={<Login />} />}
        />
        <Route
          path='/register'
          element={<ProtectedRoute onlyUnAuth component={<Register />} />}
        />
        <Route
          path='/forgot-password'
          element={<ProtectedRoute onlyUnAuth component={<ForgotPassword />} />}
        />
        <Route
          path='/reset-password'
          element={<ProtectedRoute onlyUnAuth component={<ResetPassword />} />}
        />
        <Route
          path='/profile'
          element={<ProtectedRoute component={<Profile />} />}
        />
        <Route
          path='/profile/orders'
          element={<ProtectedRoute component={<ProfileOrders />} />}
        />
        <Route
          path='/ingredients/:id'
          element={
            <section className={styles.detailPageWrap}>
              <h1
                className={`${styles.detailHeader} text text_type_main-large pb-3`}
              >
                Детали ингредиента
              </h1>
              <IngredientDetails />
            </section>
          }
        />
        <Route
          path='/feed/:id'
          element={
            <section className={styles.detailPageWrap}>
              <OrderInfo />
            </section>
          }
        />
        <Route
          path='/profile/orders/:id'
          element={
            <ProtectedRoute
              component={
                <section className={styles.detailPageWrap}>
                  <OrderInfo />
                </section>
              }
            />
          }
        />
        <Route path='*' element={<NotFound404 />} />
      </Routes>

      {background && (
        <Routes>
          <Route
            path='/feed/:id'
            element={
              <Modal title='Детали заказа' onClose={closeModal}>
                <OrderInfo />
              </Modal>
            }
          />
          <Route
            path='/ingredients/:id'
            element={
              <Modal title='Детали ингредиента' onClose={closeModal}>
                <IngredientDetails />
              </Modal>
            }
          />
          <Route
            path='/profile/orders/:id'
            element={
              <ProtectedRoute
                component={
                  <Modal title='Детали заказа' onClose={closeModal}>
                    <OrderInfo />
                  </Modal>
                }
              />
            }
          />
        </Routes>
      )}
    </div>
  );
};

const App = () => (
  <BrowserRouter>
    <AppRoutes />
  </BrowserRouter>
);

export default App;

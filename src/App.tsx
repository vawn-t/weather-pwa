import { Route, Routes } from 'react-router';
import { HomeScreen, MyLocationsScreen } from './screens';
import { SwipeTransition } from '@layouts';
import { APP_ROUTES } from '@constants';
import { Bounce, ToastContainer } from 'react-toastify';

function App() {
  return (
    <SwipeTransition>
      <Routes>
        <Route path={APP_ROUTES.HOME} element={<HomeScreen />} />
        <Route path={APP_ROUTES.MY_LOCATIONS} element={<MyLocationsScreen />} />
      </Routes>
      <ToastContainer
        position="bottom-center"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        transition={Bounce}
      />
    </SwipeTransition>
  );
}

export default App;

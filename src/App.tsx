import { Route, Routes } from 'react-router';
import { HomeScreen, MyLocationsScreen } from './screens';
import { SwipeTransition } from '@layouts';
import { APP_ROUTES } from '@constants';

function App() {
  return (
    <SwipeTransition>
      <Routes>
        <Route path={APP_ROUTES.HOME} element={<HomeScreen />} />
        <Route path={APP_ROUTES.MY_LOCATIONS} element={<MyLocationsScreen />} />
      </Routes>
    </SwipeTransition>
  );
}

export default App;

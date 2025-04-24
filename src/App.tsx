import { Route, Routes } from 'react-router';
import { HomeScreen, MyLocationsScreen } from './screens';
import { SwipeTransition } from '@layouts';
import { NetworkStatus } from '@components';

function App() {
  return (
    <>
      <SwipeTransition>
        <Routes>
          <Route path="/" element={<HomeScreen />} />
          <Route path="/my-locations" element={<MyLocationsScreen />} />
        </Routes>
      </SwipeTransition>
      <NetworkStatus />
    </>
  );
}

export default App;

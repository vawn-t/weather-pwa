import { Route, Routes } from 'react-router';
import { HomeScreen, MyLocationsScreen } from './screens';
import { SwipeTransition } from '@layouts';

function App() {
  return (
    <SwipeTransition>
      <Routes>
        <Route path="/" element={<HomeScreen />} />
        <Route path="/my-locations" element={<MyLocationsScreen />} />
      </Routes>
    </SwipeTransition>
  );
}

export default App;

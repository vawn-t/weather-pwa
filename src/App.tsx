import { Route, Routes } from 'react-router';
import { HomeScreen, MyLocationsScreen } from './screens';
import { useLocation } from '@hooks';
import { useEffect } from 'react';

function App() {
  const { requestPermission } = useLocation();

  useEffect(() => {
    requestPermission();
  }, []);

  return (
    <Routes>
      <Route path="/" element={<HomeScreen />} />
      <Route path="/my-locations" element={<MyLocationsScreen />} />
    </Routes>
  );
}

export default App;

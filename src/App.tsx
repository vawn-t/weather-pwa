import { Route, Routes } from 'react-router';
import { HomeScreen, MyLocationsScreen } from './screens';

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomeScreen />} />
      <Route path="/my-locations" element={<MyLocationsScreen />} />
    </Routes>
  );
}

export default App;

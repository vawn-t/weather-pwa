import { Route, Routes } from 'react-router';
import { Home, MyLocations, Search } from './pages';

function App() {
	return (
		<Routes>
			<Route path='/' element={<Home />} />
			<Route path='/my-locations' element={<MyLocations />} />
			<Route path='/search' element={<Search />} />
		</Routes>
	);
}

export default App;

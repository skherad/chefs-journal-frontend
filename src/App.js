import { BrowserRouter, Routes, Route } from "react-router-dom";
//pages
import Profile from './pages/Profile/Profile';
import SingleRecipe from './pages/SingleRecipe/SingleRecipe';
import NewRecipe from './pages/NewRecipe/NewRecipe';
import Explore from './pages/Explore/Explore';
import UserProfile from './pages/UserProfile/UserProfile';
import Home from "./pages/Home/Home";
//components
import Header from './components/Header/Header';
import Footer from "./components/footer/Footer";

import './App.scss';

function App() {
  return (
    <BrowserRouter>
        <Header />
        <Routes>
          <Route path={"/"} element={<Home />}></Route>
          <Route path={"/profile/"} element={<Profile />} />
          <Route path={"/singleRecipe/:userId/:recipeId"} element={<SingleRecipe />} />
          <Route path={"/newRecipe/:userId"} element={<NewRecipe />} />
          <Route path={"/explore/:userId"} element={<Explore />} />
          <Route path={"/userProfile/:userId/:profileId"} element={<UserProfile />} />
        </Routes>
        <Footer />
    </BrowserRouter>

  );
}

export default App;

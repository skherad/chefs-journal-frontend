import { BrowserRouter, Routes, Route } from "react-router-dom";
//pages
import Profile from './pages/Profile/Profile';
import SingleRecipe from './pages/SingleRecipe/SingleRecipe';
import NewRecipe from './pages/NewRecipe/NewRecipe';
import Explore from './pages/Explore/Explore';
import UserProfile from './pages/UserProfile/UserProfile';
import Home from "./pages/Home/Home";
import EditRecipe from "./pages/EditRecipe/EditRecipe";
//components
import Header from './components/Header/Header';
import Footer from "./components/footer/Footer";
import GuestProfile from "./pages/GuestProfile/GuestProfile";

import './App.scss';

function App() {
  return (
    <BrowserRouter>
        <Header />
        <Routes>
          <Route path={"/"} element={<Home />}></Route>
          <Route path={"/profile/"} element={<Profile />} />
          <Route path={"/profile/8"} element={<GuestProfile />} />
          <Route path={"/singleRecipe/:userId/:recipeId"} element={<SingleRecipe />} />
          <Route path={"/editRecipe/:userId/:recipeId"} element={<EditRecipe />} />
          <Route path={"/newRecipe/:userId"} element={<NewRecipe />} />
          <Route path={"/explore/:userId"} element={<Explore />} />
          <Route path={"/userProfile/:userId/:profileId"} element={<UserProfile />} />
        </Routes>
        <Footer />
    </BrowserRouter>

  );
}

export default App;

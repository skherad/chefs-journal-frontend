import LoginButton from '../../components/LoginButton/LoginButton';
import ChefIcon from '../../assets/images/chef.png';

import './Home.scss';
import { Link, Navigate } from 'react-router-dom';

const Home = () => {
  // const navigate = useNavigate();

  // const guestUser = () => {
  //     navigate()
  // }
  return (
    <section className='home'>
      <h1 className='home__header'>Chefs Journal</h1>
      <img src={ChefIcon} className="home__icon"></img>
      <LoginButton className="home__login"/>
      <Link className='home__button links' to="profile/8">Test User</Link>
    </section>
  )
}

export default Home
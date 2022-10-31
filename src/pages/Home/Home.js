import LoginButton from '../../components/LoginButton/LoginButton';
import ChefIcon from '../../assets/images/chef.png';

import './Home.scss';

const Home = () => {
  return (
    <section className='home'>
      <h1 className='home__header'>Chefs Journal</h1>
      <img src={ChefIcon} className="home__icon"></img>
      <LoginButton className="home__login"/>
    </section>
  )
}

export default Home
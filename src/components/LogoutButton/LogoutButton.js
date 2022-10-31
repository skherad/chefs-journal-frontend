const SERVER_URL = process.env.REACT_APP_SERVER_URL;

const LogoutButton = () => {
  return (
    // The link will take user to `http://localhost:5050/auth/logout` which will delete the user server session and redirect user back to client-side app with the cookie invalidated
    <a className="profile__logout-button links" href={`${SERVER_URL}/auth/logout`}>
      <span className="profile__logout-button__text">LOGOUT</span>
    </a>
  );
};

export default LogoutButton;
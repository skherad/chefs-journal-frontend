import GoogleButton from 'react-google-button';
const SERVER_URL = process.env.REACT_APP_SERVER_URL;

const LoginButton = () => {

  return (
    // The link will take user to `http://localhost:5050/auth/google` which starts the authentication process with google, just like we were testing on the server side
    // After successful authentication user will be redirected back to client-side app with the cookie set
    <a className="links" href={`${SERVER_URL}/auth/google`}>
      <GoogleButton type="light"/>
    </a>
  );
};

export default LoginButton;
import { useState, useEffect } from "react";
import { thunkLogin } from "../../redux/session";
import { useDispatch, useSelector } from "react-redux";
import { useModal } from "../../context/Modal";
import { useNavigate } from "react-router-dom";
import "./LoginForm.css";

function LoginFormModal() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { closeModal } = useModal();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});

  const currentUser = useSelector(state => state.session.user);

  useEffect(() => {
    if (currentUser) {
      closeModal();
      navigate(`/profile/${currentUser.id}`);
    }
  }, [currentUser, navigate, closeModal]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    const serverResponse = await dispatch(
      thunkLogin({
        email,
        password,
      })
    );

    if (serverResponse && serverResponse.errors) {
      setErrors(serverResponse.errors);
    }
  };

  const handleDemoLogin = async () => {
    setErrors({});

    await dispatch(thunkLogin({
      email: "demo@aa.io",
      password: "password"
    })
    );

    if (demoResponse && demoResponse.errors) {
      setErrors(demoResponse.errors);
    }
  };

  return (
    <div className="login-container">
      <img src='../diamond-star.png'></img>
      <h1>Log In</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Email {errors.email && <p>{errors.email}</p>}
          <input
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </label>
        <label>
          Password {errors.password && <p>{errors.password}</p>}
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>
        <div className="button-container">
          <button type="submit" className="login-button">Log In</button>
          <div className="divider">
            <span></span> or <span></span>
          </div>
          <button className='demo-button' onClick={handleDemoLogin}>Log in as Demo user</button>
        </div>
      </form>
    </div>
  );
}

export default LoginFormModal;

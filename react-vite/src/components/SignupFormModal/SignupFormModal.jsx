import { useState } from "react";
import { useDispatch } from "react-redux";
import { thunkSignup } from "../../redux/session";
import { useNavigate } from 'react-router-dom';
import { useModal } from "../../context/Modal";
import "./SignupForm.css";

function SignupFormModal() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { closeModal } = useModal();

  const [email, setEmail] = useState("");
  const [first_name, setFirstName] = useState("");
  const [password, setPassword] = useState("");
  const [confirm_password, setConfirmPassword] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [gender, setGender] = useState("");
  const [age, setAge] = useState("");
  const [playstyle, setPlaystyle] = useState("");
  const [region, setRegion] = useState("");
  const [hasMic, setHasMic] = useState("");
  const [platforms, setPlatforms] = useState("");
  const [errors, setErrors] = useState({});
  const [currentPage, setCurrentPage] = useState(1);

  const validatePageOne = () => {
    const newErrors = {};

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email) {
      newErrors.email = "We need an email to contact you!";
    } else if (!emailPattern.test(email)) {
      newErrors.email = "Please enter a valid email address.";
    }

    if (!password) {
      newErrors.password = "A password is needed to secure your account!";
    } else if (password.length < 8) {
      newErrors.password = "Must be at least 8 characters long.";
    }

    if (password !== confirm_password) {
      newErrors.confirm_password = "Uh oh, passwords do not match!";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validatePageTwo = () => {
    const newErrors = {};

    if (!first_name) {
      newErrors.first_name = "Your first name is needed for others to identify you."
    }

    if (!age) {
      newErrors.age = "Your age is needed to help you find better duos!"
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  const handleNext = () => {
    if (currentPage === 1) {
      if (validatePageOne()) {
        setCurrentPage(currentPage + 1);
      }
    } else if (currentPage === 2) {
      if (validatePageTwo()) {
        setCurrentPage(currentPage + 1);
      }
    } else {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevious = () => setCurrentPage(currentPage - 1);

  const handleFileChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!imageFile) {
      alert("Please add a profile picture!");
      return;
    }

    try {
      let imageUrl = null;

      if (imageFile) {
        // Upload the image to S3
        const formData = new FormData();
        formData.append('image', imageFile);

        const uploadResponse = await fetch('/api/users/upload_profile_picture', {
          method: 'POST',
          body: formData,
        });

        if (!uploadResponse.ok) {
          throw new Error('Image upload failed');
        }

        const uploadData = await uploadResponse.json();
        imageUrl = uploadData.url; // Assuming your server responds with `url`
      }

      // Submit user data including the image URL
      const serverResponse = await dispatch(
        thunkSignup({
          email,
          password,
          confirm_password,
          first_name,
          gender,
          age,
          playstyle,
          region,
          hasMic,
          platforms,
          image_url: imageUrl
        })
      );

      if (serverResponse) {
        setErrors(serverResponse);
      } else {
        closeModal();
        navigate('/add-games');
      }
    } catch (error) {
      console.error('Error:', error);
      alert("Error occurred during signup");
    }

    // const serverResponse = await dispatch(
    //   thunkSignup({
    //     email,
    //     password,
    //     confirm_password,
    //     first_name,
    //     gender,
    //     age,
    //     playstyle,
    //     region,
    //     hasMic,
    //     platforms,
    //     image_url
    //   })
    // );

    // if (serverResponse) {
    //   setErrors(serverResponse);
    // } else {
    //   closeModal();
    //   navigate('/add-games');
    // }
  };

  return (
    <div className="sign-up-container">
      <img src='../public/diamond-star.png'></img>
      {errors.server && <p>{errors.server}</p>}
      <form onSubmit={handleSubmit}>
        {currentPage === 1 && (
          <>
            <h1>Find your duo!</h1>
            <h4>Let's start by adding your email and password.</h4>
            <div className="input-container">
              <label>
                Email* {errors.email && <p>{errors.email}</p>}
                <input
                  type="text"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </label>
              <label>
                Password* {errors.password && <p>{errors.password}</p>}
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </label>
              <label>
                Confirm password* {errors.confirm_password && <p>{errors.confirm_password}</p>}
                <input
                  type="password"
                  value={confirm_password}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </label>
            </div>
            <div className="one-button-container">
              <button type="button" className="next-button" onClick={handleNext}><i className="fa-solid fa-arrow-right-long"></i></button>
            </div>
          </>
        )}

        {currentPage === 2 && (
          <>
            <h4 className="not-one">We want to know a little bit more about you!</h4>
            <div className="input-container">
              <label>
                First name* {errors.first_name && <p>{errors.first_name}</p>}
                <input
                  type="text"
                  value={first_name}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                />
              </label>
              <label>
                Gender
                <select value={gender} onChange={(e) => setGender(e.target.value)}>
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Non-binary">Non-binary</option>
                </select>
              </label>
              <label>
                Age*  {errors.age && <p>{errors.age}</p>}
                <input
                  type="number"
                  value={age}
                  onChange={(e) => setAge(Number(e.target.value))}
                  min="18"
                  max="99"
                  required
                />
              </label>
              <div className="two-button-container">
                <button type="button" className="previous-button" onClick={handlePrevious}><i className="fa-solid fa-arrow-left-long"></i></button>
                <button type="button" className="next-button" onClick={handleNext}><i className="fa-solid fa-arrow-right-long"></i></button>
              </div>
            </div>
          </>
        )}

        {currentPage === 3 && (
          <>
            <h4 className="not-one">What the gyat</h4>
            <div className="input-container">
              <label>
                Playstyle
                <select value={playstyle} onChange={(e) => setPlaystyle(e.target.value)}>
                  <option value="">Select Playstyle</option>
                  <option value="Casual">Casual</option>
                  <option value="Competitive">Competitive</option>
                  <option value="Social">Social</option>
                  <option value="Explorative">Explorative</option>
                </select>
              </label>
              <label>
                Region
                <select value={region} onChange={(e) => setRegion(e.target.value)}>
                  <option value="">Select Region</option>
                  <option value="Northeast">Northeast</option>
                  <option value="Southwest">Southwest</option>
                  <option value="West">West</option>
                  <option value="Southeast">Southeast</option>
                  <option value="Midwest">Midwest</option>
                </select>
              </label>
              <label>
                Do you use a mic?
                <select value={hasMic} onChange={(e) => setHasMic(e.target.value === "true")}>
                  <option value="">Select</option>
                  <option value={true}>Yes</option>
                  <option value={false}>No</option>
                </select>
              </label>
              <label>
                Platforms {errors.platforms && <p>{errors.platforms}</p>}
                <input
                  type="text"
                  value={platforms}
                  onChange={(e) => setPlatforms(e.target.value)}
                  required
                />
              </label>
              <div className="two-button-container">
                <button type="button" className="previous-button" onClick={handlePrevious}><i className="fa-solid fa-arrow-left-long"></i></button>
                <button type="button" className="next-button" onClick={handleNext}><i className="fa-solid fa-arrow-right-long"></i></button>
              </div>
            </div>
          </>
        )}

        {currentPage === 4 && (
          <>
            <h4 className="not-one">Lastly, let's add that beautiful picture of you!</h4>
            <div className="input-container">
              <label>
                Profile Picture
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                />
                {/* {imageSrc && <img src={imageSrc} alt="Profile Preview" style={{ maxWidth: '200px', marginTop: '10px' }} />} */}
              </label>
              <div className="two-button-container">
                <button type="button" className="previous-button" onClick={handlePrevious}><i className="fa-solid fa-arrow-left-long"></i></button>
                <button type="submit">Sign Up</button>
              </div>
            </div>
          </>
        )}
      </form>
    </div>
  );
}

export default SignupFormModal;

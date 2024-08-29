import { useState } from "react";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import { thunkSignup } from "../../redux/session";
import { useNavigate } from 'react-router-dom';
import "./SignupForm.css";

function SignupFormModal() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { closeModal } = useModal();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm_password, setConfirmPassword] = useState("");
  const [first_name, setFirstName] = useState("");
  const [gender, setGender] = useState("");
  const [age, setAge] = useState("");
  const [playstyle, setPlaystyle] = useState("");
  const [region, setRegion] = useState("");
  const [hasMic, setHasMic] = useState("");
  const [platforms, setPlatforms] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [errors, setErrors] = useState({});

  const [currentPage, setCurrentPage] = useState(1);

  const handleNext = () => setCurrentPage(currentPage + 1);
  const handlePrevious = () => setCurrentPage(currentPage - 1);

  // const uploadImage = async (file) => {
  //   const formData = new FormData();
  //   formData.append("file", file);

  //   const response = await fetch("/aws-helper-route/upload", {
  //     method: "POST",
  //     body: formData,
  //   });

  //   if (response.ok) {
  //     const data = await response.json();
  //     return data.url;
  //   } else {
  //     const errorData = await response.json();
  //     throw new Error(errorData.errors);
  //   }
  // };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirm_password) {
      return setErrors({
        confirm_password: "Confirm Password field must be the same as the Password field",
      });
    }

    if (!first_name) {
      return setErrors({ first_name: "First Name is required" });
    }

    let uploadedImageUrl = imageUrl;
    if (imageFile) {
      try {
        uploadedImageUrl = await uploadImage(imageFile);
        setImageUrl(uploadedImageUrl);
      } catch (err) {
        return setErrors({ imageUrl: err.message });
      }
    }

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
        imageUrl: uploadedImageUrl,
      })
    );

    if (serverResponse) {
      setErrors(serverResponse);
    } else {
      navigate('/add-games');
    }
  };

  return (
    <>
      <h1>Sign Up</h1>
      {errors.server && <p>{errors.server}</p>}
      <form onSubmit={handleSubmit}>
        {currentPage === 1 && (
          <>
            <label>
              Email
              <input
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </label>
            {errors.email && <p>{errors.email}</p>}
            <label>
              Password
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </label>
            {errors.password && <p>{errors.password}</p>}
            <label>
              Confirm Password
              <input
                type="password"
                value={confirm_password}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </label>
            {errors.confirm_password && <p>{errors.confirm_password}</p>}
            <button type="button" onClick={handleNext}>Next</button>
          </>
        )}

        {currentPage === 2 && (
          <>
            <label>
              First Name
              <input
                type="text"
                value={first_name}
                onChange={(e) => setFirstName(e.target.value)}
                required
              />
            </label>
            {errors.first_name && <p>{errors.first_name}</p>}
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
              Age
              <input
                type="number"
                value={age}
                onChange={(e) => setAge(Number(e.target.value))}
                min="18"
                max="99"
                required
              />
            </label>
            {errors.age && <p>{errors.age}</p>}
            <button type="button" onClick={handlePrevious}>Previous</button>
            <button type="button" onClick={handleNext}>Next</button>
          </>
        )}

        {currentPage === 3 && (
          <>
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
              Platforms
              <input
                type="text"
                value={platforms}
                onChange={(e) => setPlatforms(e.target.value)}
                required
              />
            </label>
            {errors.platforms && <p>{errors.platforms}</p>}
            <button type="button" onClick={handlePrevious}>Previous</button>
            <button type="button" onClick={handleNext}>Next</button>
          </>
        )}

        {currentPage === 4 && (
          <>
            {/* <label>
              Profile Image
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setImageFile(e.target.files[0])}
              />
            </label>
            {errors.imageUrl && <p>{errors.imageUrl}</p>} */}
            <button type="button" onClick={handlePrevious}>Previous</button>
            <button type="submit">Sign Up</button>
          </>
        )}
      </form>
    </>
  );
}

export default SignupFormModal;

// import { useState } from "react";
// import { useDispatch } from "react-redux";
// import { useModal } from "../../context/Modal";
// import { thunkSignup } from "../../redux/session";
// import "./SignupForm.css";

// // Utility function to get a presigned URL
// const getPresignedUrl = async (fileName, fileType) => {
//   const response = await fetch(`/api/generate-presigned-url?file_name=${fileName}&file_type=${fileType}`);
//   if (!response.ok) {
//     throw new Error('Failed to get presigned URL');
//   }
//   const data = await response.json();
//   return data.url;
// };

// // Utility function to upload the image using the presigned URL
// const uploadImage = async (file) => {
//   const fileName = file.name;
//   const fileType = file.type;

//   try {
//     const presignedUrl = await getPresignedUrl(fileName, fileType);
//     const response = await fetch(presignedUrl, {
//       method: "PUT",
//       body: file,
//       headers: {
//         "Content-Type": fileType
//       }
//     });

//     if (!response.ok) {
//       throw new Error('Failed to upload image');
//     }

//     // The URL is the same as the presigned URL but with the file name appended
//     return presignedUrl.split('?')[0];
//   } catch (error) {
//     throw new Error(error.message);
//   }
// };

// function SignupFormModal() {
//   const dispatch = useDispatch();
//   const { closeModal } = useModal();

//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [confirmPassword, setConfirmPassword] = useState("");
//   const [firstName, setFirstName] = useState("");
//   const [gender, setGender] = useState("");
//   const [age, setAge] = useState("");
//   const [playstyle, setPlaystyle] = useState("");
//   const [region, setRegion] = useState("");
//   const [hasMic, setHasMic] = useState("");
//   const [platforms, setPlatforms] = useState("");
//   const [imageUrl, setImageUrl] = useState("");
//   const [imageFile, setImageFile] = useState(null);
//   const [errors, setErrors] = useState({});
//   const [currentPage, setCurrentPage] = useState(1);

//   const handleNext = () => setCurrentPage(currentPage + 1);
//   const handlePrevious = () => setCurrentPage(currentPage - 1);

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (password !== confirmPassword) {
//       return setErrors({
//         confirmPassword: "Confirm Password field must be the same as the Password field",
//       });
//     }

//     let uploadedImageUrl = imageUrl;
//     if (imageFile) {
//       try {
//         uploadedImageUrl = await uploadImage(imageFile);
//         setImageUrl(uploadedImageUrl);
//       } catch (err) {
//         return setErrors({ imageUrl: err.message });
//       }
//     }

//     const serverResponse = await dispatch(
//       thunkSignup({
//         email,
//         password,
//         first_name: firstName,
//         gender,
//         age,
//         playstyle,
//         region,
//         hasMic,
//         platforms,
//         imageUrl: uploadedImageUrl,
//       })
//     );

//     if (serverResponse) {
//       setErrors(serverResponse);
//     } else {
//       closeModal();
//     }
//   };

//   return (
//     <>
//       <h1>Sign Up</h1>
//       {errors.server && <p>{errors.server}</p>}
//       <form onSubmit={handleSubmit}>
//         {currentPage === 1 && (
//           <>
//             <label>
//               Email
//               <input
//                 type="text"
//                 value={email}
//                 onChange={(e) => setEmail(e.target.value)}
//                 required
//               />
//             </label>
//             {errors.email && <p>{errors.email}</p>}
//             <label>
//               Password
//               <input
//                 type="password"
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//                 required
//               />
//             </label>
//             {errors.password && <p>{errors.password}</p>}
//             <label>
//               Confirm Password
//               <input
//                 type="password"
//                 value={confirmPassword}
//                 onChange={(e) => setConfirmPassword(e.target.value)}
//                 required
//               />
//             </label>
//             {errors.confirmPassword && <p>{errors.confirmPassword}</p>}
//             <button type="button" onClick={handleNext}>Next</button>
//           </>
//         )}

//         {currentPage === 2 && (
//           <>
//             <label>
//               First Name
//               <input
//                 type="text"
//                 value={firstName}
//                 onChange={(e) => setFirstName(e.target.value)}
//                 required
//               />
//             </label>
//             {errors.firstName && <p>{errors.firstName}</p>}
//             <label>
//               Gender
//               <select value={gender} onChange={(e) => setGender(e.target.value)}>
//                 <option value="">Select Gender</option>
//                 <option value="Male">Male</option>
//                 <option value="Female">Female</option>
//                 <option value="Non-binary">Non-binary</option>
//               </select>
//             </label>
//             <label>
//               Age
//               <input
//                 type="number"
//                 value={age}
//                 onChange={(e) => setAge(Number(e.target.value))}
//                 min="18"
//                 max="99"
//                 required
//               />
//             </label>
//             {errors.age && <p>{errors.age}</p>}
//             <button type="button" onClick={handlePrevious}>Previous</button>
//             <button type="button" onClick={handleNext}>Next</button>
//           </>
//         )}

//         {currentPage === 3 && (
//           <>
//             <label>
//               Playstyle
//               <select value={playstyle} onChange={(e) => setPlaystyle(e.target.value)}>
//                 <option value="">Select Playstyle</option>
//                 <option value="Casual">Casual</option>
//                 <option value="Competitive">Competitive</option>
//                 <option value="Social">Social</option>
//                 <option value="Explorative">Explorative</option>
//               </select>
//             </label>
//             <label>
//               Region
//               <select value={region} onChange={(e) => setRegion(e.target.value)}>
//                 <option value="">Select Region</option>
//                 <option value="Northeast">Northeast</option>
//                 <option value="Southwest">Southwest</option>
//                 <option value="West">West</option>
//                 <option value="Southeast">Southeast</option>
//                 <option value="Midwest">Midwest</option>
//               </select>
//             </label>
//             <label>
//               Do you use a mic?
//               <select value={hasMic} onChange={(e) => setHasMic(e.target.value === "true")}>
//                 <option value="">Select</option>
//                 <option value={true}>Yes</option>
//                 <option value={false}>No</option>
//               </select>
//             </label>
//             <label>
//               Platforms
//               <input
//                 type="text"
//                 value={platforms}
//                 onChange={(e) => setPlatforms(e.target.value)}
//                 required
//               />
//             </label>
//             {errors.platforms && <p>{errors.platforms}</p>}
//             <button type="button" onClick={handlePrevious}>Previous</button>
//             <button type="button" onClick={handleNext}>Next</button>
//           </>
//         )}

//         {currentPage === 4 && (
//           <>


//             {/* <label>
//               Profile Image
//               <input
//                 type="file"
//                 accept="image/*"
//                 onChange={(e) => setImageFile(e.target.files[0])}
//               />
//             </label>
//             {errors.imageUrl && <p>{errors.imageUrl}</p>} */}



//             <button type="button" onClick={handlePrevious}>Previous</button>
//             <button type="submit">Sign Up</button>
//           </>
//         )}
//       </form>
//     </>
//   );
// }

// export default SignupFormModal;

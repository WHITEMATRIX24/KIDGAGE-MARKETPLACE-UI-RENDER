import React, { useState, useEffect } from "react";
import Button from "./Button";
import "./SignUpForm.css";
import axios from "axios";
import ReCAPTCHA from "react-google-recaptcha"; // Import ReCAPTCHA component

const BusinessSignUp = () => {
  const initialFormState = {
    username: "",
    email: "",
    phoneNumber: "",
    fullName: "",
    designation: "",
    crFile: [],
    description: "",
    location: "",
    website: "",
    instaId: "",
    licenseNo: "",
    address: "",
    agreeTerms: false,
  };

  const [formData, setFormData] = useState(initialFormState);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [charCount, setCharCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false); // Manage loading state
  const charLimit = 500;
  // const [captchaValue, setCaptchaValue] = useState(null); // State to hold the captcha value

  // const handleCaptchaChange = (value) => {
  //   setCaptchaValue(value); // Store the captcha value
  // };
  const cities = [
    "Doha",
    "Al Wakrah",
    "Al Khor",
    "Al Rayyan",
    "Al Shamal",
    "Al Shahaniya",
    "Al Daayen",
    "Umm Salal",
    "Dukhan",
    "Mesaieed",
  ];

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;

    if (name === "description") {
      setCharCount(value.length);
    }

    if (files) {
      setFormData((prevState) => ({
        ...prevState,
        [name]: files[0],
      }));
    } else {
      setFormData((prevState) => ({
        ...prevState,
        [name]: type === "checkbox" ? checked : value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    console.log("button clicked!");
    // if (!captchaValue) {
    //   setError('Please complete the CAPTCHA verification.');
    //   return;
    // }
    setError("");

    const data = new FormData();
    Object.keys(formData).forEach((key) => {
      if (Array.isArray(formData[key])) {
        formData[key].forEach((file) => {
          data.append(key, file);
        });
      } else {
        data.append(key, formData[key]);
      }
    });

    try {
      const response = await axios.post(
        "https://www.kidgage.com/api/users/signup",
        data
      );
      setSuccess("Successfully sumitted for verification!");
      setFormData({ ...initialFormState }); // Reset form fields
    } catch (error) {
      setError(
        error.response
          ? error.response.data.message
          : "An error occurred. Please try again later."
      );
      setSuccess("");
    } finally {
      setIsLoading(false); // Stop loader
    }
  };
  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => {
        setSuccess(""); // Clear the success message after 3 seconds
      }, 3000);

      return () => clearTimeout(timer); // Cleanup the timer on component unmount or re-render
    }
  }, [success]);
  const [fileError, setFileError] = useState("");
  const handleFileChange = (e) => {
    const { name, files } = e.target;

    // Handle file upload and check file size
    if (files) {
      const file = files[0];
      if (file && file.size > 1024 * 1024) {
        // 1MB in bytes
        setFileError(`The file size of ${file.name} exceeds 1MB.`);
        setFormData((prevState) => ({
          ...prevState,
          [name]: null, // Clear file if it exceeds limit
        }));
      } else {
        setFileError(""); // Clear error if file size is valid
        setFormData((prevState) => ({
          ...prevState,
          [name]: file, // Directly set the file object
        }));
      }
    }
  };
  // const handleFileChange = (e) => {
  //   const file = e.target.files[0]; // Get the first file
  //   if (file) {
  //     setFormData((prevState) => ({
  //       ...prevState,
  //       crFile: file, // Set the file to formData
  //     }));
  //   }
  // };

  return (
    <div className="s-form-body">
      <form className="signup-form-bs" onSubmit={handleSubmit}>
        <h2>JOIN OUR PROVIDER LIST, IT'S FREE</h2>
        <p
          style={{
            fontSize: "smaller",
            marginBottom: "20px",
            marginLeft: "10px",
          }}
        >
          Please note that currently we are onboarding companies registered in
          Qatar
        </p>
        <label className="sign-in-label">
          Academy Name (As per Company Registration)
        </label>
        <div className="side-by-side">
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            placeholder="Academy Name"
            required
          />
        </div>

        <label className="sign-in-label">Academy Bio</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Ex. You may include a brief introduction containing activities, classes you provide, age category etc.."
          rows="4"
          cols="50"
          style={{ marginBottom: "0px" }}
          maxLength={charLimit}
          required
        />
        <p
          style={{
            fontSize: "smaller",
            marginBottom: "20px",
            marginLeft: "10px",
            color: "darkblue",
          }}
        >
          {charCount}/{charLimit} characters
        </p>
        <div className="side-by-side">
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="E-mail ID"
            required
          />
          <div
            className="phone-number-container"
            style={{ position: "relative", width: "100%" }}
          >
            <span
              className="country-code"
              style={{
                position: "absolute",
                left: "10px",
                top: "16px",
                transform: "translateY(-50%)",
                fontSize: "small",
                color: "#555",
              }}
            >
              +974
            </span>
            <input
              type="tel"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              placeholder="Phone number"
              required
              style={{ paddingLeft: "50px" }}
            />
          </div>
        </div>

        <div className="main-user-info">
          <div className="side-by-side1">
            <label className="sign-in-label">Website (Optional)</label>
            <input
              type="url"
              name="website"
              value={formData.website}
              onChange={handleChange}
              placeholder="Enter website link"
            />
          </div>
          <div className="side-by-side1">
            <label className="sign-in-label">Instagram ID (Optional)</label>
            <input
              type="text"
              name="instaId"
              value={formData.instaId}
              onChange={handleChange}
              placeholder="Enter Instagram ID"
            />
          </div>

          <div className="side-by-side1">
            <label className="sign-in-label">Location</label>
            <select
              name="location"
              value={formData.location}
              onChange={handleChange}
              required
            >
              <option value="" disabled>
                Select your city
              </option>
              {cities.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>
          </div>

          <div className="side-by-side1">
            <label className="sign-in-label" htmlFor="adress">
              Address
            </label>
            <input
              type="text"
              name="address"
              placeholder="Academy Address"
              onChange={handleChange}
              required
            />
          </div>
          <div className="side-by-side1">
            <label className="sign-in-label" htmlFor="crNumber">
              CR Number
            </label>
            <input
              type="text"
              name="licenseNo"
              placeholder="CR Number"
              onChange={handleChange}
              required
            />
          </div>
          <div className="side-by-side1">
            <label className="sign-in-label" htmlFor="crFile">
              CR Doc[file size upto 1MB in pdf format]
              {fileError && <p className="error-message">{fileError}</p>}
            </label>
            <input
              type="file"
              name="crFile"
              onChange={handleFileChange}
              accept=".pdf"
              required
            />
          </div>
          <div className="side-by-side1">
            <label className="sign-in-label">Full Name</label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              placeholder="Full name"
              required
            />
          </div>

          <div className="side-by-side1">
            <label className="sign-in-label">Designation</label>
            <input
              type="text"
              name="designation"
              value={formData.designation}
              onChange={handleChange}
              placeholder="Designation"
              required
            />
          </div>
        </div>

        <div className="terms-container" style={{ marginTop: "10px" }}>
          <input
            type="checkbox"
            name="agreeTerms"
            checked={formData.agreeTerms}
            onChange={handleChange}
            required
          />
          <label htmlFor="agreeTerms">
            I agree that all provided information is correct for administrators'
            verification.
          </label>
        </div>
        {/* <ReCAPTCHA
          sitekey="YOUR_RECAPTCHA_SITE_KEY" // Replace with your site key
          onChange={handleCaptchaChange}
          style={{ margin: '20px 0' }} // Optional styling
        /> */}
        {error && <p className="error-message">{error}</p>}
        {success && <p className="success-message">{success}</p>}
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            width: "100%",
            justifyContent: "flex-end",
          }}
        >
          <button type="submit">Submit for Verification</button>
        </div>
      </form>
      {isLoading && (
        <div className="su-overlay">
          <div className="su-loader"></div>
        </div>
      )}
    </div>
  );
};

export default BusinessSignUp;

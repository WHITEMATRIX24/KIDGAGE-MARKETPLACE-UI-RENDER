import React, { useState } from "react";
import { motion } from "framer-motion";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate } from "react-router-dom";
import logooo from "../components/assets/images/KIDGAGElogo.png";
import bannerimggg from "../components/assets/images/kid.jpg";
import "./FirstLogin.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperPlane } from "@fortawesome/free-regular-svg-icons";
import { faInstagram, faLinkedin } from "@fortawesome/free-brands-svg-icons";
import { faChevronRight } from "@fortawesome/free-solid-svg-icons";

export default function FirstLogin() {
  const [formData, setFormData] = useState({
    name: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  // const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [emailLoading, setEmailLoading] = useState(false);
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [subMenuShow, setSubMenuShow] = useState(false);
  const [isThankyouPopup, setIsThankyouPopup] = useState(false);
  const [inputAge, setInputAge] = useState([]);
  const [noOfChild, setNoOfChild] = useState();
  const [kigageGoalsArray, setKigageGoalsArray] = useState([]);
  const [formDataValues, setFormDataValues] = useState({
    parentName: "",
    kidsAge: [],
    location: "",
    email: "",
  });
  const [tellUsValue, setTellUsValue] = useState("");

  const Sffstyle = {
    padding: "5px 10px",
    borderRadius: "20px",
    border: "1px solid #ACC29E",
    backgroundColor: kigageGoalsArray.includes("Screen-Free Fun")
      ? "#ACC29E"
      : "transparent",
  };
  const Lastyle = {
    padding: "5px 10px",
    borderRadius: "20px",
    border: "1px solid #ACC29E",
    backgroundColor: kigageGoalsArray.includes("Local Activities")
      ? "#ACC29E"
      : "transparent",
  };
  const Sastyle = {
    padding: "5px 10px",
    borderRadius: "20px",
    border: "1px solid #ACC29E",
    backgroundColor: kigageGoalsArray.includes("Stay Active")
      ? "#ACC29E"
      : "transparent",
  };
  const Lrastyle = {
    padding: "5px 10px",
    borderRadius: "20px",
    border: "1px solid #ACC29E",
    backgroundColor: kigageGoalsArray.includes("Learning Rewards")
      ? "#ACC29E"
      : "transparent",
  };
  const Gtstyle = {
    padding: "5px 10px",
    borderRadius: "20px",
    border: "1px solid #ACC29E",
    backgroundColor: kigageGoalsArray.includes("Growth Tracker")
      ? "#ACC29E"
      : "transparent",
  };
  const Ptstyle = {
    padding: "5px 10px",
    borderRadius: "20px",
    border: "1px solid #ACC29E",
    backgroundColor: kigageGoalsArray.includes("Parenting Tips")
      ? "#ACC29E"
      : "transparent",
  };

  const handlePopup = () => {
    setIsPopupVisible(true);
  };

  const showSubMenu = () => {
    setSubMenuShow(!subMenuShow);
  };

  // Function to hide the popup
  const closePopup = () => {
    setIsPopupVisible(false);
    setInputAge([]);
  };

  const handleThankyouPopup = () => {
    const { email, kidsAge, location, parentName } = formDataValues;
    console.log(
      email,
      kidsAge,
      location,
      parentName,
      noOfChild,
      kigageGoalsArray
    );

    if (
      !email ||
      // kidsAge.length != noOfChild ||
      !location ||
      !parentName ||
      !noOfChild ||
      kigageGoalsArray.length < 1
    ) {
      return alert("please fill all the fields");
    }
    sendEmail();
  };
  const closeThankyouPop = () => {
    setIsThankyouPopup(false);
  };
  const addAge = () => {
    //console.log(noOfChild);

    for (let i = 0; i < Number(noOfChild); i++) {
      setInputAge([...inputAge, i]);
    }
  };

  const addInputAge = (e, index) => {
    const newInputAge = [...inputAge];
    newInputAge[index] = e.target.value;
    setInputAge(newInputAge);
  };
  const sendEmail = async () => {
    setMessage("");
    setError("");

    setEmailLoading(true);

    if (tellUsValue) {
      kigageGoalsArray.push(tellUsValue);
    }

    const dataToSend = {
      ...formDataValues,
      noOfChild,
      kigageGoalsArray,
    };

    try {
      const response = await fetch(
        "https://www.kidgage.com/api/users/send-email",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(dataToSend),
        }
      );

      const responseToKidgage = await fetch(
        "https://www.kidgage.com/api/users/send-email-to",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(dataToSend),
        }
      );

      if (response.status === 200 && responseToKidgage.status === 200) {
        setIsThankyouPopup(true);
        setIsPopupVisible(false);
      }

      if (response.ok) {
        setMessage("Email sent successfully!");
      } else {
        const data = await response.json();
        setError(data.error || "Failed to send email");
      }
    } catch (error) {
      setError("An error occurred. Please try again.");
      console.error(error);
    } finally {
      setEmailLoading(false);
    }
  };

  const dummyCredentials = {
    name: "Kidgage@2024",
    password: "Kidgage@24user",
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (
      formData.name === dummyCredentials.name &&
      formData.password === dummyCredentials.password
    ) {
      setLoading(false);
      navigate("/home");
    } else {
      setError("Invalid username or password");
      setLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 1,
      },
    },
  };

  const imageVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 1,
      },
    },
  };

  console.log(kigageGoalsArray);

  return (
    <motion.div
      className="container-fluid px-5 px-md-6 mt-3 mt-md-5"
      style={{
        minHeight: "100vh",
        fontFamily: "'Gilroy', sans-serif",
        maxWidth: "1400px",
        margin: "0 auto",
      }}
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <style>
        {`
          @import url('https://fonts.cdnfonts.com/css/gilroy-bold');
        `}
      </style>
      <motion.div className="row" variants={containerVariants}>
        <div className="col-12 col-lg-10 mx-auto px-0 d-flex flex-column">
          <motion.div
            className="ms-0 d-flex align-items-center justify-content-between"
            variants={imageVariants}
          >
            <div style={{ width: "auto" }} className="ms-0 ms-md-1 mb-0 mt-3">
              <img
                src={logooo}
                alt="Kidgage Logo"
                className="kidlogo img-fluid rounded"
              />
            </div>
            <div className="firstPageLogoContainer d-flex gap-3">
              <a
                href="http://Instagram.com/mykidgage"
                className="text-decoration-none d-block text-dark"
              >
                <FontAwesomeIcon icon={faInstagram} size="2xl" />
              </a>
              <a
                href="https://www.linkedin.com/company/kidgage"
                className="text-decoration-none d-block text-dark"
              >
                <FontAwesomeIcon icon={faLinkedin} size="2xl" />
              </a>
            </div>
          </motion.div>
          <br />
          <motion.div
            className="row align-items-center"
            // style={{ minHeight: "75vh" }}
            variants={containerVariants}
          >
            <motion.div
              className="col-12 col-lg-6 d-flex justify-content-start align-items-center mb-4 mb-lg-0"
              variants={imageVariants}
            >
              <div
                className="position-relative landingpageBannerContainer"
                // style={{
                //  width: "100%",
                //  maxWidth: "500px",
                // paddingBottom: "66.67%",
                //}}
              >
                <img
                  src={bannerimggg}
                  alt="Kid with tablet"
                  className="rounded object-fit-contain w-100 h-100"
                />
              </div>
            </motion.div>
            <motion.div
              className="col-12 col-lg-6 ps-3 ps-lg-5"
              variants={itemVariants}
            >
              <motion.h1
                className="mb-4 mt-5 fw-bolder imageSideHeader"
                style={{
                  color: "#000",
                  fontFamily: "gilroy-bold",
                }}
                variants={itemVariants}
              >
                Kids Stuck to Screens?
                <br />
                Don't worry, We've <br /> got an App for that
              </motion.h1>
              <motion.p
                className="mb-5"
                style={{
                  // fontSize: "clamp(0.9rem, 3vw, 1.1rem)",
                  fontFamily: "gilroy-regular",
                }}
                variants={itemVariants}
              >
                A smarter way to nurture your child's growth <br /> and
                well-being. Join us in this journey of play, <br /> progress,
                and purpose.
              </motion.p>
              <motion.div className="mb-md-5" variants={itemVariants}>
                <motion.h5
                  className="mb-2 mt-2 fw-semibold"
                  style={{
                    fontSize: "1.5rem",
                    color: "#000",
                    fontFamily: "gilroy-bold",
                  }}
                  variants={itemVariants}
                >
                  Get Early Access
                </motion.h5>
                <motion.p
                  className="mb-3"
                  style={{ fontFamily: "gilroy-regular" }}
                  variants={itemVariants}
                >
                  Be the first to know when we launch! Join <br /> our exclusive
                  waitlist to stay updated on <br /> Kidgage and secure early
                  access.
                </motion.p>
                <div
                  className="d-flex flex-column flex-sm-row align-items-stretch align-items-sm-center"
                  style={{ width: "fit-content" }}
                >
                  <button
                    className="d-flex align-items-center ps-3 py-1"
                    style={{
                      borderRadius: "20px",
                      border: "3px solid #ACC29E",
                      backgroundColor: "transparent",
                    }}
                    onClick={handlePopup}
                  >
                    <span
                      style={{ color: "#ACC29E", fontFamily: "gilroy-bold" }}
                    >
                      APPLY NOW
                    </span>
                    <span
                      className="p-1 d-flex align-items-center justify-content-center ms-3"
                      style={{
                        width: "22px",
                        height: "22px",
                        backgroundColor: "#ACC29E",
                        borderRadius: "50%",
                      }}
                    >
                      <FontAwesomeIcon
                        icon={faChevronRight}
                        style={{ color: "#ffffff" }}
                      />
                    </span>
                  </button>
                </div>
              </motion.div>
            </motion.div>
          </motion.div>
          <motion.div
            className="row mt-4 mx-0 gy-4 mb-5"
            variants={containerVariants}
          >
            <motion.div
              className="col-12 col-sm-6 col-lg-3 ps-0 ps-lg-0 pe-5"
              variants={itemVariants}
            >
              <h5 className="fw-bold" style={{ fontFamily: "gilroy-bold" }}>
                For Parents
              </h5>
              <p style={{ fontFamily: "gilroy-regular" }}>
                Discover creative ways to support your child's growth with a
                platform where fun meets development – all in one place!
              </p>
            </motion.div>
            <motion.div
              className="col-12 col-sm-6 col-lg-3 ps-0 ps-lg-0"
              style={{ paddingRight: "4rem" }}
              variants={itemVariants}
            >
              <h5 className="fw-bold" style={{ fontFamily: "gilroy-bold" }}>
                For Providers
              </h5>
              <p style={{ fontFamily: "gilroy-regular" }}>
                Partner with us to connect with families who value growth and
                health. Together, let's inspire progress and create brighter
                futures for the next generation!
              </p>
            </motion.div>
            <motion.div
              className="col-12 col-sm-6 col-lg-2 ps-0 ps-lg-0 pe-3"
              variants={itemVariants}
            >
              <h5 className="fw-bold" style={{ fontFamily: "gilroy-bold" }}>
                Already Invited?
              </h5>
              <p style={{ fontFamily: "gilroy-regular" }}>
                Enter your email and password to help us test the platform in
                closed beta.
              </p>
            </motion.div>
            <motion.div
              className="col-12 col-sm-6 col-lg-4 ps-0 ps-lg-0"
              variants={itemVariants}
            >
              {error && (
                <div className="alert alert-danger mt-3" role="alert">
                  {error}
                </div>
              )}
              <input
                name="name"
                type="text"
                className="form-control mb-2 firstPageLoginUserName"
                placeholder="Username"
                onChange={handleChange}
                value={formData.name}
              />
              <input
                name="password"
                type="password"
                className="form-control mb-2 firstPageLoginPassword"
                placeholder="Password"
                onChange={handleChange}
                value={formData.password}
              />
              <button
                className="btn p-2 text-white firstPageLoginButton"
                style={{ backgroundColor: "#ACC29E" }}
                onClick={handleSubmit}
                disabled={loading}
              >
                {loading ? "Logging in..." : "Login"}
              </button>
              {/* <h5 className="fw-bold" style={{ fontFamily: "gilroy-bold" }}>
                Follow us
              </h5>
              <p style={{ fontFamily: "gilroy-regular" }}>
                <a
                  href="http://Instagram.com/mykidgage"
                  className="text-decoration-none d-block text-dark"
                >
                  Instagram
                </a>

                <a
                  href="https://www.linkedin.com/company/kidgage"
                  className="text-decoration-none d-block text-dark"
                >
                  LinkedIn
                </a>

              </p> */}
            </motion.div>
          </motion.div>
        </div>
      </motion.div>
      {/* Conditional rendering of the popup */}
      {isPopupVisible && (
        <div className="firstLoginPagefirstPopupContainer">
          <div className="d-flex align-items-center justify-content-center flex-column firstLoginPageFpopupWrapper">
            <div className="w-100 mt-1 mb-2 d-flex ">
              <h2
                className="text-center w-100"
                style={{ fontFamily: "gilroy-bold" }}
              >
                Join Waiting List
              </h2>
              <div
                className="ms-auto d-flex align-items-center justify-content-center "
                onClick={closePopup}
                style={{
                  height: "40px",
                  width: "45px",
                  borderRadius: "50%",
                  border: "1px solid black",
                  cursor: "pointer",
                }}
              >
                <h3 className="text-dark">X</h3>
              </div>
            </div>
            <div className="w-75 mt-3">
              <div className="mb-3">
                <input
                  name="parentName"
                  type="text"
                  className="form-control  mb-2 "
                  placeholder="Parent Name"
                  style={{
                    borderRadius: "20px",
                    border: "1px solid #ACC29E",
                  }}
                  onChange={(e) =>
                    setFormDataValues({
                      ...formDataValues,
                      parentName: e.target.value,
                    })
                  }
                />
              </div>
              <div className="d-flex mb-3">
                <input
                  name="NumberOfKids"
                  type="text"
                  className="form-control  mb-2 "
                  onChange={(e) => setNoOfChild(e.target.value)}
                  placeholder="Number of Kids"
                  style={{
                    borderRadius: "20px",
                    border: "1px solid #ACC29E",
                  }}
                />
                <div></div>
              </div>
              <div>
                <button
                  className="btn w-100 mb-3"
                  onClick={addAge}
                  style={{
                    borderRadius: "20px",
                    border: "1px solid #ACC29E",
                    backgroundColor: "#ACC29E",
                    color: "white",
                  }}
                  disabled={noOfChild <= inputAge.length}
                >
                  Add Age
                </button>
              </div>
              <div className="mb-3">
                {inputAge.map((item, index) => (
                  <input
                    id={`input-${index}`}
                    name="Age"
                    type="text"
                    className="form-control mb-2 "
                    placeholder={`Age of child ${index + 1}`}
                    style={{
                      borderRadius: "20px",
                      border: "1px solid #ACC29E",
                    }}
                    onChange={(e) =>
                      setFormDataValues({
                        ...formDataValues,
                        kidsAge: [...formDataValues.kidsAge, e.target.value],
                      })
                    }
                  />
                ))}
              </div>

              <div className="mb-3">
                <input
                  name="parentName"
                  type="text"
                  className="form-control mb-2 "
                  placeholder="Location"
                  style={{
                    borderRadius: "20px",
                    border: "1px solid #ACC29E",
                  }}
                  onChange={(e) =>
                    setFormDataValues({
                      ...formDataValues,
                      location: e.target.value,
                    })
                  }
                />
              </div>
              <div className="mb-2">
                <button
                  className="form-control d-flex w-100 text-start"
                  onClick={showSubMenu}
                  style={{
                    borderRadius: "20px",
                    border: "1px solid #ACC29E",
                  }}
                >
                  <span>Your Kidgage Goals</span>{" "}
                  <span className="text-end ms-auto">
                    <i className="fa-solid fa-angle-down"></i>
                  </span>
                </button>
              </div>
              {subMenuShow && (
                <div className="px-3">
                  <div className="row mt-3">
                    <div className="col-md-6 firstLoginGoalCloumn">
                      <button
                        className="d-flex w-100 text-start"
                        style={Sffstyle}
                        value="Screen-Free Fun"
                        onClick={(e) =>
                          setKigageGoalsArray([
                            ...kigageGoalsArray,
                            e.currentTarget.value,
                          ])
                        }
                      >
                        <span>Screen-Free Fun</span>
                      </button>
                    </div>
                    <div className="col-md-6">
                      <button
                        className="d-flex w-100 text-start"
                        style={Lastyle}
                        value="Local Activities"
                        onClick={(e) =>
                          setKigageGoalsArray([
                            ...kigageGoalsArray,
                            e.currentTarget.value,
                          ])
                        }
                      >
                        <span>Local Activities</span>
                      </button>
                    </div>
                  </div>
                  <div className="row mt-3">
                    <div className="col-md-6 firstLoginGoalCloumn">
                      <button
                        className="d-flex w-100 text-start"
                        style={Sastyle}
                        value="Stay Active"
                        onClick={(e) =>
                          setKigageGoalsArray([
                            ...kigageGoalsArray,
                            e.currentTarget.value,
                          ])
                        }
                      >
                        <span>Stay Active</span>
                      </button>
                    </div>
                    <div className="col-md-6">
                      <button
                        className="d-flex w-100 text-start"
                        style={Lrastyle}
                        value="Learning Rewards"
                        onClick={(e) =>
                          setKigageGoalsArray([
                            ...kigageGoalsArray,
                            e.currentTarget.value,
                          ])
                        }
                      >
                        <span>Learning Rewards</span>
                      </button>
                    </div>
                  </div>
                  <div className="row mt-3">
                    <div className="col-md-6 firstLoginGoalCloumn">
                      <button
                        className="text-dark  d-flex w-100 text-start"
                        style={Gtstyle}
                        value="Growth Tracker"
                        onClick={(e) =>
                          setKigageGoalsArray([
                            ...kigageGoalsArray,
                            e.currentTarget.value,
                          ])
                        }
                      >
                        <span>Growth Tracker</span>
                      </button>
                    </div>
                    <div className="col-md-6">
                      <button
                        className="d-flex w-100 text-start"
                        style={Ptstyle}
                        value="Parenting Tips"
                        onClick={(e) =>
                          setKigageGoalsArray([
                            ...kigageGoalsArray,
                            e.currentTarget.value,
                          ])
                        }
                      >
                        <span>Parenting Tips</span>
                      </button>
                    </div>
                  </div>
                  <div className="row d-flex align-items-center mt-3 mb-3">
                    <div className="col-md-6">
                      <label className="d-flex w-100 text-start paddingbottomClass">
                        <span>Other magic you'd like us to work?</span>
                      </label>
                    </div>
                    <div className="col-md-6">
                      <input
                        type="text"
                        className="btn btn-outline-dark  d-flex w-100 text-start"
                        placeholder="Tell Us..."
                        style={{
                          borderRadius: "20px",
                          border: "1px solid #ACC29E",
                        }}
                        onChange={(e) => setTellUsValue(e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              )}
              <div className="mt-3 mb-3">
                <input
                  name="parentName"
                  type="email"
                  className="form-control  "
                  placeholder="Email"
                  style={{
                    borderRadius: "20px",
                    border: "1px solid #ACC29E",
                  }}
                  onChange={(e) =>
                    setFormDataValues({
                      ...formDataValues,
                      email: e.target.value,
                    })
                  }
                />
              </div>
            </div>
            <button
              className="d-flex align-items-center ps-3 py-1"
              style={{
                borderRadius: "20px",
                border: "3px solid #ACC29E",
                backgroundColor: "transparent",
              }}
              onClick={handleThankyouPopup}
            >
              <span style={{ color: "#000000" }}>APPLY NOW</span>
              <span
                className="p-1 d-flex align-items-center justify-content-center ms-3"
                style={{
                  width: "22px",
                  height: "22px",
                  backgroundColor: "#ACC29E",
                  borderRadius: "50%",
                }}
              >
                <FontAwesomeIcon
                  icon={faChevronRight}
                  style={{ color: "#ffffff" }}
                />
              </span>
            </button>
          </div>
        </div>
      )}

      {/* Conditional rendering of the Thankyou Message popup */}
      {isThankyouPopup && (
        <div
          // style={{
          //   position: "fixed",
          //   top: "0",
          //   left: "0",
          //   width: "100%",
          //   height: "100%",
          //   backgroundColor: "transparent",
          //   display: "flex",
          //   flexDirection: "column",
          //   justifyContent: "center",
          //   alignItems: "center",
          //   zIndex: "1000",
          //   fontFamily: "Gilroy",
          // }}
          className="firstLoginPagefirstPopupContainer"
        >
          <div
            className="d-flex align-items-center justify-content-center flex-column firstLoginPageFpopupWrapper"
            // style={{
            //   backgroundColor: "white",
            //   width: "29%",
            //   padding: "15px",
            //   borderRadius: "20px",
            //   textAlign: "center",
            //   boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)",
            // }}
          >
            <div
              className="w-100 p-5 mt-3 d-flex flex-column"
              style={{ fontFamily: "gilroy-medium" }}
            >
              <h2
                className="text-success"
                style={{ fontFamily: "gilroy-medium" }}
              >
                Thank you!
              </h2>
              <br />
              <h3 style={{ fontFamily: "gilroy-medium" }}>
                You're officially on the Kidgage early access list!
              </h3>
              <h3 className="mt-3" style={{ fontFamily: "gilroy-medium" }}>
                Stay Tuned-exciting updates are coming your way soon.
              </h3>
              <p className="mt-5" style={{ fontFamily: "gilroy-medium" }}>
                Check your inbox for confirmation
              </p>
            </div>
            <div
              className="  mb-3 d-flex align-items-center justify-content-center "
              onClick={closeThankyouPop}
              style={{
                height: "50px",
                width: "50px",
                borderRadius: "50%",
                border: "1px solid black",
                cursor: "pointer",
              }}
            >
              <h3 className="text-dark">X</h3>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
}

import { Link } from "react-router-dom";
import { useState } from "react";
import Navbar1 from "../../components/Navbar1.js";
import './auth.css';

function SignUp() {
  const [username, setUsername] = useState();
  const [techStack, setTechStack] = useState();
  const [language, setLanguage] = useState();
  const [codeforces, setCodeforces] = useState();
  const [codechef, setCodechef] = useState();
  const [leetcode, setLeetcode] = useState();
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [confirmPassword, setConfirmPassword] = useState();
  const [errorCase, setErrorCase] = useState();

  const handleSignUp = async (credentials) => {
    if (credentials.password !== credentials.confirmPassword) {
      setErrorCase("Password not matching with Confirm Password");
      return;
    }
    try {
      const response = await fetch('http://localhost:3001/SignUp', {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
      });
      const data = await response.json();
      if (data.error) {
        throw new Error(data.message);
      }
      setErrorCase("Account Created Successfully! GO Log In");
    } catch (error) {
      console.log(error);
      alert(
        `Error in Signing Up User from our side. Please Try Later!! Sorry for Inconviniece\n${error.message}`
      );
    }
  };

  return (
    <>
        <Navbar1 />
      <div className="body-wrapper">
        <div className="signup-form-wrapper">
          <form
            action="/SignUp"
            method="post"
            onSubmit={(e) => {
              e.preventDefault();
              handleSignUp({
                username,
                email,
                techStack,
                language,
                codeforces,
                codechef,
                leetcode,
                password,
                confirmPassword,
              });
            }}
          >
            <h2>SignUp</h2>

            <input
              type="text"
              name="username"
              placeholder="Enter a Username"
              onChange={(e) => setUsername(e.target.value)}
              required
            />
            <input
              type="text"
              name="email"
              placeholder="Enter your email"
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              type="text"
              name="techStack"
              placeholder="Enter your TeckStack"
              onChange={(e) => setTechStack(e.target.value)}
              
            />
            <input
              type="text"
              name="language"
              placeholder="Enter your Preferred Language"
              onChange={(e) => setLanguage(e.target.value)}
            />
            <input
              type="text"
              name="codeforces"
              placeholder="Enter your Rating in Codeforces"
              onChange={(e) => setCodeforces(e.target.value)}
            />
            <input
              type="text"
              name="codechef"
              placeholder="Enter your Rating in CodeChef"
              onChange={(e) => setCodechef(e.target.value)}
            />
            <input
              type="text"
              name="leetcode"
              placeholder="Enter your Rating in LeetCode"
              onChange={(e) => setLeetcode(e.target.value)}
            />
            <input
              type="password"
              name="password"
              placeholder="Enter your password"
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <input
              type="password"
              name="conf_password"
              placeholder="Confirm your password"
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            <input className="login-submit" type="submit" value="SignUP" />
          </form>
          <div className="error-wrapper">{errorCase}</div>
          <div className="login-extras-wrapper">
            <p>
              <Link to="/ForgotPassword"></Link>
            </p>
            <p>
              <Link to="/LogIn">Already have an Account?</Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
export default SignUp;

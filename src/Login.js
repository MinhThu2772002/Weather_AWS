import React, { useState } from "react";
import { Auth } from "aws-amplify";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const user = await Auth.signIn(email, password);
      console.log("Logged in user:", user);
      // Redirect to the search history page or any other authenticated page
    } catch (error) {
      console.log("Error signing in:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="field">
        <label className="label"> Email </label>{" "}
        <div className="control">
          <input
            className="input"
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={handleEmailChange}
          />{" "}
        </div>{" "}
      </div>{" "}
      <div className="field">
        <label className="label"> Password </label>{" "}
        <div className="control">
          <input
            className="input"
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={handlePasswordChange}
          />{" "}
        </div>{" "}
      </div>{" "}
      <div className="field">
        <div className="control">
          <button className="button is-primary" type="submit">
            Login{" "}
          </button>{" "}
        </div>{" "}
      </div>{" "}
    </form>
  );
}

export default Login;

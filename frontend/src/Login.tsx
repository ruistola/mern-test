import { useAppContext } from "./AppContext";
import { useFormFields } from "./FormFields";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const { setAuthToken } = useAppContext();
  const [ fields, handleFieldChange ] = useFormFields({
    email: "",
    password: "",
  });

  const nav = useNavigate();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event?.preventDefault();

    try {
      // TODO: Refactor this block out into a parameterized post(url,data) function
      const data = {
        email: fields.email,
        password: fields.password,
      };

      const config = {
        headers: {
          "Access-Control-Allow-Origin" : "*",
          "Content-Type": "application/json",
          withCredentials: false,
        },
      };

      const res = await axios.post("http://127.0.0.1:3001/login", data, config);
      
      setAuthToken(res.data.token);
      nav("/");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <div>Login</div>
      <form onSubmit={handleSubmit}>
        <label htmlFor="email">Email: </label>
        <input type="email" id="email" name="email" onChange={handleFieldChange}/>
        <label htmlFor="password">Password: </label>
        <input type="password" id="password" name="password" onChange={handleFieldChange}/>
        <button type="submit">Log in</button>
      </form>
    </div>
  );
}

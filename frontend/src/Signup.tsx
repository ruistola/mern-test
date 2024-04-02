import { useAppContext } from "./AppContext";
import { useFormFields } from "./FormFields";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Signup() {
  const { setAuthToken } = useAppContext();
  const [ fields, handleFieldChange ] = useFormFields({
    email: "",
    password: "",
  });

  const nav = useNavigate();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event?.preventDefault();
    try {
      const res = await axios.post("http://127.0.0.1:3001/signup", { email: fields.email, password: fields.password });
      setAuthToken(res.data.token);
      nav("/");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <div>Sign up</div>
      <form onSubmit={handleSubmit}>
        <label htmlFor="email">Email: </label>
        <input type="email" id="email" name="email" onChange={handleFieldChange}/>
        <label htmlFor="password">Password: </label>
        <input type="password" id="password" name="password" onChange={handleFieldChange}/>
        <button type="submit">Sign up</button>
      </form>
    </div>
  );
}

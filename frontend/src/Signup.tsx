import { useAppContext } from "./AppContext";

export default function Signup() {
  const { setIsAuthenticated } = useAppContext();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event?.preventDefault();

    // await for backend to confirm credentials
    setIsAuthenticated(true);
  };

  return (
    <div>
      <div>Sign up</div>
      <form onSubmit={handleSubmit}>
        <label htmlFor="email">Email: </label>
        <input type="email" id="email" name="email"/>
        <label htmlFor="password">Password: </label>
        <input type="password" id="password" name="password"/>
        <button type="submit">Sign up</button>
      </form>
    </div>
  );
}

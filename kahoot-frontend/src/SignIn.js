import RoundedFormPage from "./RoundedFormPage";

function SignIn() {
  const SignInForm = (
    <form action="/" method="post">
      <div>
        <input type="text" placeholder="E-mail" />
      </div>
      <div className="mt-7">
        <input type="text" placeholder="Password" />
      </div>
      <div className="mt-7">
        <input type="submit" className="btn btn-black w-full" value="Enter" />
      </div>
    </form>
  );

  return <RoundedFormPage text={SignInForm} />;
}

export default SignIn;

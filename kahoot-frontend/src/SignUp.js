import RoundedFormPage from "./RoundedFormPage";

function SignUp() {
  const SignUpForm = (
    <form action="/" method="post">
      <div>
        <input type="text" placeholder="Name" />
      </div>
      <div className="mt-7">
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

  return <RoundedFormPage text={SignUpForm} />;
}

export default SignUp;

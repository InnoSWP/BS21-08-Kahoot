import RoundedFormPage from './RoundedFormPage'

function SignIn () {
  const SignInForm = (
    <form action="/api/v1/signin" method="post">
      <div>
        <input
          type="text"
          placeholder="E-mail"
          name="email"
          id="email"
          required
        />
      </div>
      <div className="mt-7">
        <input
          type="password"
          placeholder="Password"
          name="password"
          id="password"
          required
        />
      </div>
      <div className="mt-7">
        <input type="submit" className="btn btn-black w-full" value="Enter" />
      </div>
    </form>
  )

  return <RoundedFormPage text={SignInForm} />
}

export default SignIn

import RoundedFormPage from './RoundedFormPage'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Page from './Page'

function SignIn () {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('Sign in')
  const navigate = useNavigate()

  const handleSubmit = async (form) => {
    form.preventDefault()
    try {
      const res = await fetch('/api/v1/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email,
          password
        })
      })
      const resJson = await res.json()
      if (res.status === 200) {
        navigate('/', { replace: true })
        window.location.reload(false)
      } else {
        setMessage("Couldn't sign in")
        console.log(resJson)
      }
    } catch (err) {
      console.log(err)
    }
  }

  const SignInForm = (
    <form onClick={handleSubmit}>
      <div>
        <h1>{message}</h1>
      </div>
      <div className='mt-7'>
        <input
          type="text"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="E-mail"
          name="email"
          id="email"
          className="input-general"
          required
        />
      </div>
      <div className="mt-7">
        <input
          type="password"
          value={password}
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
          name="password"
          id="password"
          className="input-general"
          required
        />
      </div>
      <div className="mt-7">
        <input type="submit" className="btn btn-black w-full" value="Enter" />
      </div>
    </form>
  )

  return <Page><div className="grid place-items-center h-screen"><RoundedFormPage>{SignInForm}</RoundedFormPage></div></Page>
}

export default SignIn

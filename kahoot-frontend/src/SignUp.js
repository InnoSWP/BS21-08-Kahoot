import Page from './Page'
import RoundedFormPage from './RoundedFormPage'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

function SignUp () {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('Sign Up')
  const navigate = useNavigate()

  const handleSubmit = async (form) => {
    form.preventDefault()
    try {
      const res = await fetch('/api/v1/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name,
          email,
          password
        })
      })
      const resJson = await res.json()
      if (res.status === 200) {
        navigate('/', { replace: true })
        window.location.reload(false)
        setName('')
        setEmail('')
        setPassword('')
        setMessage('Signed up successfully!')
      } else {
        setMessage("Couldn't sign up")
        console.log(resJson)
      }
    } catch (err) {
      console.log(err)
    }
  }

  const SignUpForm = (
    <form onSubmit={handleSubmit}>
      <div>
        <h1>{message}</h1>
      </div>
      <div className="mt-7">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Name"
          name="name"
          id="name"
          className="input-general"
          required
        />
      </div>
      <div className="mt-7">
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
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
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

  return <Page><div className="grid place-items-center h-screen"><RoundedFormPage>{SignUpForm}</RoundedFormPage></div></Page>
}

export default SignUp

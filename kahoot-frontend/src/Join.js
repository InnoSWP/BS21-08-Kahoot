import Page from './Page'
import RoundedFormPage from './RoundedFormPage'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

function Join () {
  const [gameId, setGameId] = useState('')
  const navigate = useNavigate()

  const handleJoinGame = (form) => {
    form.preventDefault()
    fetch('/api/v1/joinGame', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ gameId })
    }).then((res) => {
      if (res.status !== 200) {
        console.log('Error: ' + res.status)
        return
      }

      res.json().then((data) => {
        console.log(data.status)
      })
    }).catch((err) => {
      console.log(err)
    })
    navigate('/play?gameId=' + gameId)
  }

  const JoinForm = (
    <form onSubmit={handleJoinGame}>
      <div>
        <input type="text" className='input-general' onChange={(e) => { setGameId(e.target.value) }} placeholder="Game Pin" />
      </div>
      <div className="mt-7">
        <input type="submit" value='Enter' className="block btn btn-black w-full"/>
      </div>
    </form>
  )

  return <Page><div className="grid place-items-center h-screen"><RoundedFormPage>{JoinForm}</RoundedFormPage></div></Page>
}

export default Join

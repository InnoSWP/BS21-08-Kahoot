import Page from './Page'
import Question from './Question'
import LeaderBoard from './LeaderBoard'
import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'

function Play () {
  const [gameState, setGameState] = useState({
    state: 'Game does not exist',
    stateId: 0,
    subState: 'Game does not exist'
  })

  const [question, setQuestion] = useState('')

  const handleSetQuestion = async () => {
    fetch('/api/v1/getQuestion', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ gameId: searchParams.get('gameId') })
    }).then((res) => {
      if (res.status !== 200) {
        console.log('Error: ' + res.status)
        return
      }

      res.json().then((data) => {
        console.log(data)
        if (gameState.subState === 'Answers') {
          data.question.answers = true
          fetch('/api/v1/getAnswers', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ gameId: searchParams.get('gameId') })
          }).then((res) => {
            if (res.status !== 200) {
              console.log('Error: ' + res.status)
              return
            }

            res.json().then((dataInner) => {
              console.log(dataInner)
              data.question.options = dataInner.options
              setQuestion(data.question)
            })
          })
        } else {
          data.question.answers = false
          setQuestion(data.question)
        }
      })
    }).catch((err) => {
      console.log(err)
    })
  }

  const [choice, setChoice] = useState(-1)

  const handleSetChoice = (optionId) => {
    if (choice === -1) {
      setChoice(optionId)
      fetch('/api/v1/submitChoice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ gameId: searchParams.get('gameId'), choice: optionId })
      }).then((res) => {
        if (res.status !== 200) {
          console.log('Error: ' + res.status)
        }
      }).catch((err) => {
        console.log(err)
      })
    }
  }

  const [players, setPlayers] = useState([])

  const handleSetPlayers = () => {
    fetch('/api/v1/players', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ gameId: searchParams.get('gameId') })
    }).then((res) => {
      if (res.status !== 200) {
        console.log('Error: ' + res.status)
        return
      }

      res.json().then((data) => {
        setPlayers(data.players)
      })
    }).catch((err) => {
      console.log(err)
    })
  }

  const [timeLeft, setTimeLeft] = useState(0)

  const handleSetTimeLeft = () => {
    fetch('/api/v1/getTimeLeft', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ gameId: searchParams.get('gameId') })
    }).then((res) => {
      if (res.status !== 200) {
        console.log('Error: ' + res.status)
        return
      }

      res.json().then((data) => {
        setTimeLeft(Math.ceil(data.timeLeft / 1000))
      })
    }).catch((err) => {
      console.log(err)
    })
  }

  const [score, setScore] = useState(0)

  const handleSetScore = () => {
    fetch('/api/v1/getScore', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ gameId: searchParams.get('gameId') })
    }).then((res) => {
      if (res.status !== 200) {
        console.log('Error: ' + res.status)
        return
      }

      res.json().then((data) => {
        setScore(data.score)
      })
    }).catch((err) => {
      console.log(err)
    })
  }

  const [searchParams] = useSearchParams()

  useEffect(() => {
    const interval = setInterval(
      () =>
        fetch('/api/v1/gameState', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ gameId: searchParams.get('gameId') })
        }).then((res) => {
          if (res.status !== 200) {
            console.log('Error: ' + res.status)
            setGameState({
              state: 'Game does not exist',
              stateId: 0,
              subState: 'Game does not exist'
            })
            return
          }

          res.json().then((data) => {
            let clearChoice = false
            if ((gameState.subState === 'Answers' || gameState.subState === 'Leaderboard' || gameState.subState === 'Waiting') && data.gameState.subState === 'Show') {
              clearChoice = true
            }
            setGameState(data.gameState)
            handleSetPlayers()
            handleSetScore()
            if (gameState.state === 'Question') {
              handleSetQuestion()
              handleSetTimeLeft()
            }
            if (clearChoice) {
              setChoice(-1)
            }
          })
        }).catch((err) => {
          console.log(err)
        }),
      300
    )

    return () => clearInterval(interval)
  }, [gameState])

  const renderSwitch = (gameState) => {
    console.log(gameState)
    if (gameState.state === 'Game does not exist') { return (<div className='text-center'><h1 className='text-white'>Game does not exist!</h1></div>) }

    const playerList = players.length ? players.map(({ id, name }) => (<span key={id} className="player-list-item">{name} </span>)) : 'No one has joined so far...'
    switch (gameState.state) {
      case 'Waiting':
        // TODO: create another component and pass players
        return (
          <>
            <div className="text-center text-white"><h1>Waiting for players to join...</h1></div>
            <div className="text-center text-white mt-10"><h1>Players:</h1></div>
            <div className="text-center text-white mt-5">{playerList}</div>
          </>
        )
      case 'Question':
        return <>{gameState.subState === 'Leaderboard' ? LeaderBoard({ players }) : question !== '' ? Question({ question, choice, handleSetChoice }) : ''}</>
      case 'Finished':
        return <>{LeaderBoard({ players })}</>
    }
  }

  return (
    <>
    <Page>
      {renderSwitch(gameState)}
    </Page>
    <footer className="mt-7 progressFooter sticky bottom-0 left-0 right-0">
      <div className="flex justify-around">
        <div>
          <h1 className="stroke text-white">Time left: {timeLeft}</h1>
        </div>
        <div>
          <h1 className="stroke text-white">Score: {score}</h1>
        </div>
      </div>
    </footer>
    </>
  )
}

export default Play

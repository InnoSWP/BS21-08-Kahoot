import PropTypes from 'prop-types'

function LeaderBoard (props) {
  const players = [...props.players]
  players.sort((a, b) => {
    if (a.score > b.score) { return -1 }
    if (a.score < b.score) { return 1 }
    return 0
  })

  console.log(props.players)

  return (
    <>
      <div className='text-white text-center'>
        <h1>LeaderBoard</h1>
      </div>
      <div className='leaderboard-players'>
        {!!players.length && players.map((player) => (
          <div key={`leaderboard-${player.id}`} className='flex flex-nowrap justify-between text-white text-center text-2xl'>
            <div>
              {player.name}
            </div>
            <div>
              {player.score}
            </div>
          </div>
        ))}
      </div>
    </>
  )
}
LeaderBoard.propTypes = {
  players: PropTypes.array.isRequired
}

export default LeaderBoard

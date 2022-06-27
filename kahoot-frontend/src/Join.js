import RoundedFormPage from './RoundedFormPage'

function Join () {
  const JoinForm = (
    <form action="/play" method="post">
      <div>
        <input type="text" placeholder="Game Pin" />
      </div>
      <div className="mt-7">
        <input type="submit" className="btn btn-black w-full" value="Enter" />
      </div>
    </form>
  )

  return <RoundedFormPage text={JoinForm} />
}

export default Join

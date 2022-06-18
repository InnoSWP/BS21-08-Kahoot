function RoundedFormPage({ text }) {
  return (
    <div className="wrapper">
      <div className="grid place-items-center h-screen">
        <div className="rounded-box-white">
          <div className="box-inner">{text}</div>
        </div>
      </div>
    </div>
  );
}

export default RoundedFormPage;

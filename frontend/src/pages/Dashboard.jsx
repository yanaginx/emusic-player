import { useNavigate } from "react-router-dom";

function Dashboard() {
  const navigate = useNavigate();
  const onFER = () => {
    navigate("/fer");
  };
  // const onLogin = () => {
  //   navigate("/api/auth/login");
  // };

  return (
    <>
      <section className="heading">
        <h1>Frontend to use API</h1>
        <p>Main menu</p>
      </section>
      <div className="content">
        {/* <a href={"/api/auth/login"}>
          <button className="btn">Login</button>
        </a> */}
        <button className="btn" onClick={onFER}>
          Emotion detect
        </button>
      </div>
    </>
  );
}

export default Dashboard;

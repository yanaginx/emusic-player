import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { getEmotions } from "../features/fer/ferSlice";
import Spinner from "../components/Spinner";

function Fer({ auth }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { emotions, isLoading, isError, message } = useSelector(
    (state) => state.fer
  );

  console.log("[DEBUG] auth can be seen from FER: ", auth);

  useEffect(() => {
    if (isError) {
      toast.error(message);
    }
    dispatch(getEmotions());

    return () => dispatch(reset());
  }, [message, isError, dispatch]);

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <>
      <section className="heading">
        <h1>Emotions</h1>
        <p>Your detected emotions info:</p>
      </section>
      <section className="content">
        <ul>
          {emotions.map((emotion) => (
            <li key={emotion.id}>
              {emotion.id} : {emotion.counts}
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}

export default Fer;

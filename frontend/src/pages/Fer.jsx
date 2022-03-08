import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { getEmotions } from "../features/fer/ferSlice";
import Spinner from "../components/Spinner";

function Fer() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { emotions, isLoading, isError, message } = useSelector(
    (state) => state.fer
  );

  useEffect(() => {
    if (isError) {
      console.log(message);
      toast.error(message);
    }
    dispatch(getEmotions());
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

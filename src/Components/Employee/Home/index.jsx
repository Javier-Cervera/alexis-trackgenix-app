import styles from 'Components/Home/home.module.css';
import { Link, useRouteMatch } from 'react-router-dom';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getEmployees } from 'redux/employees/thunks';
import { getProjects } from 'redux/projects/thunks';
import { getAllTimesheets } from 'redux/time-sheets/thunks';
import { Preloader } from 'Components/Shared';

function Home() {
  const dispatch = useDispatch();
  const isLoading = useSelector((state) => state.timesheets.loading);
  const { url } = useRouteMatch();

  useEffect(() => {
    dispatch(getEmployees());
    dispatch(getProjects());
    dispatch(getAllTimesheets());
  }, []);
  return isLoading ? (
    <Preloader>
      <p>Loading Employee</p>
    </Preloader>
  ) : (
    <section className={styles.container}>
      <h2>Employee Home</h2>
      <div className={styles.buttonsContainer}>
        <button className={styles.linkButton}>
          <Link to="/home" className={styles.link}>
            Home
          </Link>
        </button>
        <button className={styles.linkButton}>
          <Link to={`${url}/time-sheet`} className={styles.link}>
            Timesheet
          </Link>
        </button>
        <button className={styles.linkButton}>
          <Link to={`${url}/projects`} className={styles.link}>
            Projects
          </Link>
        </button>
        <button className={styles.linkButton}>
          <Link to={`${url}/profile`} className={styles.link}>
            Profile
          </Link>
        </button>
      </div>
    </section>
  );
}

export default Home;

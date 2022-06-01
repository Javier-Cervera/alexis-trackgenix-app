import { useState, useEffect } from 'react';
import styles from './addMember.module.css';

const AddMember = () => {
  let edit;
  const [routeid, setRouteID] = useState('');
  let [projectMembers, setProjectMembers] = useState([]);
  const [member, setMember] = useState('');
  const [role, setRole] = useState('');
  const [rate, setRate] = useState('');
  const [employees, setEmployees] = useState([]);
  const [isLoading, setLoading] = useState(true);

  useEffect(async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}api/employees`);
      const data = await response.json();
      setEmployees(data.data);
    } catch (error) {
      console.error(error);
      alert(error);
    }
    try {
      const params = new URLSearchParams(window.location.search);
      const projectID = params.get('id');
      setRouteID(projectID);
      const getProject = await fetch(`${process.env.REACT_APP_API_URL}api/projects/${projectID}`);
      const projectData = await getProject.json();
      setProjectMembers(projectData.data.members);
      setLoading(false);
    } catch (error) {
      console.error(error);
      alert(error);
    }
  }, []);

  const onChangeMember = (event) => {
    setMember(event.target.value);
  };
  const onChangeRole = (event) => {
    setRole(event.target.value);
  };

  const OnChangeRate = (event) => {
    setRate(event.target.value);
  };

  const asignMember = () => {
    projectMembers = projectMembers.filter((member) => member.employeeId !== null);
    for (let i = 0; i < projectMembers.length; i++) {
      if (projectMembers[i].employeeId._id) {
        projectMembers[i].employeeId = projectMembers[i].employeeId._id;
      }
      if (projectMembers[i].employeeId == member) {
        projectMembers[i].role = role;
        projectMembers[i].rate = rate;
        edit = true;
      }
    }
    if (!edit) {
      projectMembers.push({
        employeeId: member,
        role: role,
        rate: rate
      });
    }
    setProjectMembers(projectMembers);
    return projectMembers;
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    console.log(asignMember());
    const params = new URLSearchParams(window.location.search);
    const projectID = params.get('id');
    let url = `${process.env.REACT_APP_API_URL}api/projects/${projectID}`;
    const options = {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ members: asignMember() })
    };
    try {
      const response = await fetch(url, options);
      const data = await response.json();
      console.log(response.status, data.message);
      if (response.status !== 200 && response.status !== 201) {
        throw new Error(data.error);
      } else {
        alert(data.message);
      }
    } catch (error) {
      alert(error);
    }
  };

  return isLoading ? (
    <h1 className={styles.loading}>Loading form...</h1>
  ) : (
    <div className={styles.divcontainer}>
      <h2>Add or Edit a member</h2>
      <form onSubmit={onSubmit} className={styles.container}>
        <label>Employee</label>
        <select
          value={member}
          defaultValue=""
          onChange={onChangeMember}
          className={styles.inputs}
          required
        >
          <option disabled value="">
            Choose Member
          </option>
          {employees.map((employee) => {
            return (
              <option
                defaultValue={employee._id}
                value={employee._id}
                key={employee._id}
              >{`${employee.lastName}, ${employee.firstName}`}</option>
            );
          })}
          ;
        </select>
        <label>Role</label>
        <select
          required
          name="role"
          value={role}
          defaultValue=""
          onChange={onChangeRole}
          className={styles.inputs}
        >
          <option disabled value="">
            Choose Role
          </option>
          <option value={'TL'}>TL</option>
          <option value={'QA'}>QA</option>
          <option value={'DEV'}>DEV</option>
          <option value={'PM'}>PM</option>
        </select>
        <label>Rate</label>
        <input
          type="number"
          value={rate}
          required
          onChange={OnChangeRate}
          placeholder="Insert rate"
        />
        <button type="submit">Submit</button>
      </form>
      <a href={`/projects/form?id=${routeid}`}>Go back</a>
    </div>
  );
};

export default AddMember;

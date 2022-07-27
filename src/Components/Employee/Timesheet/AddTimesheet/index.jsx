import { React, useState } from 'react';
import styles from './form.module.css';
import { Select, ButtonText, ErrorSuccessModal } from 'Components/Shared';
import { useDispatch, useSelector } from 'react-redux';
import { createTimesheet } from 'redux/time-sheets/thunks';
import { updateEmployee } from 'redux/employees/thunks';
import * as Joi from 'joi';
import { useForm } from 'react-hook-form';
import { joiResolver } from '@hookform/resolvers/joi';

const timesheetValidation = Joi.object({
  project: Joi.string()
    .messages({
      'string.empty': 'Project is a required field'
    })
    .required(),
  task: Joi.string().allow(''),
  approved: Joi.boolean().required()
});

const FormAdd = ({ closeModalForm }) => {
  const dispatch = useDispatch();
  const [message, setMessage] = useState('');
  const [showMessageModal, setShowMessageModal] = useState(false);
  const projects = useSelector((state) => state.projects.list);
  const employeeId = useSelector((state) => state.auth.user?.data._id);
  const employee = useSelector((state) => state.employees.list).find(
    (employee) => employee._id === employeeId
  );
  const timesheets = useSelector((state) => state.timesheets.listTimesheet).filter(
    (listTimesheet) =>
      employee?.timeSheets.some((employeeTimesheet) => employeeTimesheet._id === listTimesheet._id)
  );
  const activeTimesheets = timesheets?.filter((ts) => ts.isDeleted !== true);
  let currentDate = new Date().toISOString().slice(0, 7);

  const onSubmit = (data) => {
    const projects = activeTimesheets.filter((pj) => pj.projectId._id === data.project);
    const filteredByDate = projects.filter((pj) => pj.createdAt.slice(0, 7) === currentDate);
    if (!(filteredByDate.length === 0)) {
      setMessage({
        message: 'Timesheet for the selected project already created for the current period',
        data: {},
        error: true
      });
      setShowMessageModal(true);
    } else {
      let dataToSave;
      dispatch(
        createTimesheet(
          data.project,
          (message) => (setMessage(message), (dataToSave = message.data))
        )
      ).then(() => {
        setShowMessageModal(true);
        let body = JSON.stringify({
          timeSheets: employee.timeSheets.map((timesheet) => timesheet._id).concat(dataToSave._id)
        });
        dispatch(updateEmployee(body, employeeId, setMessage)).then(() => {
          setShowMessageModal(true);
        });
      });
    }
  };

  const {
    handleSubmit,
    register,
    formState: { errors }
  } = useForm({
    mode: 'onBlur',
    resolver: joiResolver(timesheetValidation),
    defaultValues: {
      project: '',
      task: '',
      approved: false
    },
    shouldFocusError: false
  });

  return (
    <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
      <Select
        label="Projects"
        name="project"
        title="Choose project"
        data={projects.map((project) => ({
          _id: project._id,
          optionText: project.name
        }))}
        register={register}
        error={errors.project?.message}
      />
      <ButtonText clickAction={handleSubmit(onSubmit)} label="Create" />
      <ErrorSuccessModal
        show={showMessageModal}
        closeModal={() => {
          setShowMessageModal(false);
        }}
        closeModalForm={closeModalForm}
        successResponse={message}
      />
    </form>
  );
};

export default FormAdd;
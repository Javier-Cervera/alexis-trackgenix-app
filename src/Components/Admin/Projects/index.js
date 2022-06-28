import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getProjects, deleteProject } from 'redux/projects/thunks';
import {
  Preloader,
  Table,
  ModalForm,
  ButtonAdd,
  ConfirmModal,
  ErrorSuccessModal
} from 'Components/Shared';
import Form from './Form';
import AddMember from './Form/AddMember/AddMember';
import AddForm from './Addform/addForm';
import styles from './projects.module.css';

const Projects = () => {
  const dispatch = useDispatch();
  const projects = useSelector((state) => state.projects.list);
  const isLoading = useSelector((state) => state.projects.isLoading);

  let [value, setValue] = useState(false);
  const [showModalFormEdit, setShowModalFormEdit] = useState(false);
  const [idToEdit, setIdToEdit] = useState();
  const [showConfirmModal, setConfirmModal] = useState(false);
  const [showModalAdd, setModalAdd] = useState(false);
  const [showErrorSuccessModal, setErrorSuccessModal] = useState(false);
  const [projectId, setProjectId] = useState(0);
  const [message, setMessage] = useState('');

  let modalEdit;
  let modalDelete;
  let modalAdd;
  let modalErrorSuccess;

  useEffect(() => {
    dispatch(getProjects());
    setValue(false);
  }, []);

  const deleteItem = () => {
    dispatch(deleteProject(projectId, (message) => setMessage(message))).then(() => {
      closeConfirmModal();
      setErrorSuccessModal(true);
    });
  };

  const openModalFormEdit = (id) => {
    setIdToEdit(id);
    setShowModalFormEdit(true);
  };

  const closeModalFormEdit = () => {
    setShowModalFormEdit(false);
    setValue(false);
  };

  const openModalAdd = () => {
    setModalAdd(true);
  };

  const closeModalAdd = () => {
    setModalAdd(false);
  };

  const openConfirmModal = (_id) => {
    setConfirmModal(true);
    setProjectId(_id);
  };

  const closeConfirmModal = () => {
    setConfirmModal(false);
    setErrorSuccessModal(false);
    setModalAdd(false);
  };

  const closeErrorSuccessModal = () => {
    setErrorSuccessModal(false);
  };

  const functionValue = (value) => {
    setValue(value);
  };

  if (showConfirmModal) {
    modalDelete = (
      <ConfirmModal
        isOpen={showConfirmModal}
        handleClose={closeConfirmModal}
        confirmDelete={deleteItem}
        title="Delete Project"
        message="Are you sure you want to delete this project?"
      />
    );
  }

  if (showModalAdd) {
    modalAdd = (
      <ModalForm isOpen={showModalAdd} handleClose={closeModalAdd} title="Add Project">
        <AddForm closeModalForm={closeModalAdd} />
      </ModalForm>
    );
  }

  if (showModalFormEdit) {
    modalEdit = (
      <ModalForm
        isOpen={showModalFormEdit}
        handleClose={closeModalFormEdit}
        title={value ? 'Add/Edit team members' : 'Edit Project'}
      >
        {value ? (
          <AddMember functionValue={functionValue} projects={projects} itemId={idToEdit} />
        ) : (
          <Form
            closeModalForm={closeModalFormEdit}
            edit={true}
            project={projects.find((project) => project._id == idToEdit)}
            itemId={idToEdit}
            functionValue={functionValue}
          />
        )}
      </ModalForm>
    );
  }

  if (showErrorSuccessModal) {
    modalErrorSuccess = (
      <ErrorSuccessModal
        show={showErrorSuccessModal}
        closeModal={closeErrorSuccessModal}
        closeModalForm={closeConfirmModal}
        successResponse={message}
      ></ErrorSuccessModal>
    );
  }

  return isLoading && !showModalAdd && !showConfirmModal && !showModalFormEdit ? (
    <Preloader>
      <p>Loading Projects</p>
    </Preloader>
  ) : (
    <section className={styles.container}>
      <h2 className={styles.projects}> Projects </h2>
      {modalEdit}
      {modalDelete}
      {modalAdd}
      {modalErrorSuccess}
      {isLoading ? <Preloader /> : null}
      <Table
        data={projects}
        headers={['name', 'description', 'startDate', 'endDate', 'clientName', 'active', 'members']}
        titles={[
          'Name',
          'Description',
          'Start Date',
          'End Date',
          'Client Name',
          'Active',
          'Members'
        ]}
        delAction={openConfirmModal}
        editAction={openModalFormEdit}
      />
      <ButtonAdd clickAction={openModalAdd}></ButtonAdd>
    </section>
  );
};

export default Projects;

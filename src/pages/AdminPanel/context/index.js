import React, { createContext, useState } from 'react';
import PropTypes from 'prop-types';
import {
  fetchErrorCategory,
  addErrorCategory,
  updateErrorCategory,
  deleteErrorCategory,
} from 'store/reducers/adminPanel';
import { useDispatch, useSelector } from 'react-redux';
import Swal from 'sweetalert2';
import GlobalDialog from 'pages/ConceptOverview/components/GlobalDialog';
import Dialog from '../components/Dialog';
import { useHistory } from 'react-router-dom';

const AdminPanelContext = createContext();

export function AdminPanelProvider({ children }) {
  const dispatch = useDispatch();
  const history = useHistory();
  const { errorCategory, fetching } = useSelector((state) => state.adminPanel);

  const { data: userData } = useSelector((state) => state.user);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [dialogType, setDialogType] = useState('');
  const [value, setValue] = useState(null);
  const [error, setError] = useState(null);

  useState(() => {
    if (!userData?.admin_panel_access) history.replace('/');

    dispatch(fetchErrorCategory());
  }, []);

  const ToastSuccess = Swal.mixin({
    toast: true,
    icon: 'success',
    width: 500,
    position: 'top-right',
    showConfirmButton: false,
    timer: 1500,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.addEventListener('mouseenter', Swal.stopTimer);
      toast.addEventListener('mouseleave', Swal.resumeTimer);
    },
  });

  const ToastError = Swal.mixin({
    toast: true,
    icon: 'error',
    width: 370,
    position: 'top-right',
    showConfirmButton: false,
    timer: 2000,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.addEventListener('mouseenter', Swal.stopTimer);
      toast.addEventListener('mouseleave', Swal.resumeTimer);
    },
  });

  const handleDeleteErrorCategory = (name, id) => {
    Swal.fire({
      title: `Do you want to delete ${name}?`,
      icon: 'warning',
      allowOutsideClick: false,
      showDenyButton: true,
      confirmButtonText: 'Yes',
      denyButtonText: 'Cancel',
      backdrop: '#25175aa3',
    }).then(async (result) => {
      if (result.isConfirmed) {
        dispatch(
          deleteErrorCategory(
            id,
            (message) => {
              ToastSuccess.fire({
                title: message,
              });
            },
            (message) => {
              ToastError.fire({
                title: message,
              });
            }
          )
        );
      }
    });
  };

  const handleDialog = (_type, _value) => {
    setIsDialogOpen(!isDialogOpen);
    setDialogType(_type);
    setValue(_value);
    setError(null);
  };

  const handleUpdateErrorCategory = (name) => {
    let params = { parent_id: value?.parent_id ?? value?.id, name };
    switch (dialogType) {
      case 'add_category':
      case 'add_type':
        dispatch(
          addErrorCategory(
            params,
            (message) => {
              ToastSuccess.fire({
                title: message,
              });
              handleDialog('');
              setError(null);
            },
            (message) => {
              setError(message);
            }
          )
        );
        break;
      case 'edit_type':
        params = { id: value?.id, name };
        dispatch(
          updateErrorCategory(
            params,
            (message) => {
              ToastSuccess.fire({
                title: message,
              });
              handleDialog('');
              setError(null);
            },
            (message) => {
              setError(message);
            }
          )
        );
        break;
    }
  };

  return (
    <AdminPanelContext.Provider
      value={{
        errorCategory,
        fetching,
        handleDialog,
        handleDeleteErrorCategory,
      }}
    >
      {children}
      <GlobalDialog
        open={isDialogOpen}
        handleClose={() => handleDialog('')}
        content={
          <Dialog
            type={dialogType}
            onClose={() => handleDialog('')}
            handleSubmit={handleUpdateErrorCategory}
            value={value}
            error={error}
          />
        }
      />
    </AdminPanelContext.Provider>
  );
}

AdminPanelProvider.propTypes = {
  children: PropTypes.any,
};

export default AdminPanelContext;

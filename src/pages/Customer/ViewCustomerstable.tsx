import React, { useState, useEffect } from 'react';
import axios from 'axios';

axios.defaults.baseURL = 'http://54.252.241.140:8080';

const getHeaders = () => {
  const username = 'abinesh';
  const password = 'abi';
  const basicAuth = 'Basic ' + btoa(username + ':' + password);
  return {
    headers: {
      Authorization: basicAuth,
    },
  };
};

function ViewCustomers() {
  const [clients, setClients] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editedClient, setEditedClient] = useState(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [formData, setFormData] = useState({
    id: '',
    salutation: '',
    clientName: '',
    clientType: '',
    purpose: '',
    address: '',
    phone: '',
    emailAddress: '',
  });

  useEffect(() => {
    getClients();
  }, []);

  const getClients = () => {
    axios
      .get('/api/clients', getHeaders())
      .then((response) => {
        setClients(response.data);
      })
      .catch((error) => {
        console.error('Error fetching clients:', error);
      });
  };

  const deleteClient = (clientId) => {
    if (window.confirm('Are you sure you want to delete this client?')) {
      axios
        .delete(`/api/clients/${clientId}`, getHeaders())
        .then(() => {
          console.log('Client deleted');
          setToastMessage('Client Deleted successfully.');
          setShowToast(true);
          getClients();
        })
        .catch((error) => {
          console.error('Error deleting client:', error);
        });
    }
  };

  const editClient = (client) => {
    setEditedClient(client);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const saveEditedClient = (editedData) => {
    axios
      .put(`/api/clients/${editedData.id}`, editedData, getHeaders())
      .then((response) => {
        console.log('Edited client data:', editedData);
        setClients((prevClients) =>
          prevClients.map((client) => {
            if (client.id === editedData.id) {
              return editedData;
            }
            return client;
          }),
        );
        setShowModal(false);
        setToastMessage('Client Edited successfully.');
        setShowToast(true);
      })
      .catch((error) => {
        console.error('Error saving edited client:', error);
      });
  };

  useEffect(() => {
    let timer;
    if (showToast) {
      timer = setTimeout(() => {
        setShowToast(false);
        setToastMessage('');
      }, 3500);
    }
    return () => clearTimeout(timer);
  }, [showToast]);

  return (
    <div className="max-w-screen overflow-x-auto">
      <div className="max-w-screen mx-auto overflow-x-hidden p-4">
        <div className="overflow-y-auto overflow-x-auto max-h-screen rounded-xl">
          <table className="w-full rounded-lg text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400 bg-gray-900 dark:bg-gray-800">
            <thead className="text-sm text-blue-900 uppercase rounded-lg bg-blue-100 dark:bg-slate-900 dark:text-slate-300">
              <tr>
                <th scope="col" className="px-3 py-4">
                  Salutation
                </th>
                <th scope="col" className="px-4 py-4">
                  Client Name
                </th>
                <th scope="col" className="px-4 py-4">
                  Client Type
                </th>
                <th scope="col" className="px-4 py-4">
                  Purpose
                </th>
                <th scope="col" className="px-4 py-4">
                  Address
                </th>
                <th scope="col" className="px-4 py-4">
                  Phone
                </th>
                <th scope="col" className="px-4 py-4">
                  Email Address
                </th>
                <th scope="col" className="px-4 py-4">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {clients.map((client) => (
                <tr
                  key={client.id}
                  className="bg-white border-b border-zinc-200 dark:bg-slate-800 dark:border-slate-700"
                >
                  <td className="py-2 text-gray-900 whitespace-nowrap text-center dark:text-white">
                    {client.salutation}
                  </td>
                  <td className="px-4 py-2">{client.clientName}</td>
                  <td className="px-4 py-2">{client.clientType}</td>
                  <td className="px-4 py-2">{client.purpose}</td>
                  <td className="px-4 py-2">{client.address}</td>
                  <td className="px-4 py-2">{client.phone}</td>
                  <td className="px-4 py-2">{client.emailAddress}</td>
                  <td className="px-4 py-2">
                    <button
                      onClick={() => editClient(client)}
                      className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteClient(client.id)}
                      className="font-medium text-red-600 dark:text-red-500 hover:underline"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {showModal && (
          <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75">
            <div className="bg-slate-100 w-full max-w-md rounded-lg">
              <h2 className="text-3xl text-center my-2">Edit Client</h2>
              <EditClientModal
                client={editedClient}
                saveEditedClient={saveEditedClient}
                closeModal={closeModal}
                formData={formData}
                setFormData={setFormData}
              />
            </div>
          </div>
        )}
      </div>
      {showToast && (
        <div
          id="toast-success"
          className="absolute bottom-1 right-2 flex items-center w-full max-w-xs p-2 mb-4 text-gray-500 bg-gradient-to-br from-green-100 via-green-200 rounded-lg shadow"
          role="alert"
        >
          <div className="inline-flex items-center justify-center flex-shrink-0 w-8 h-8 text-green-700 bg-green-300 rounded-lg">
            <svg
              className="w-5 h-5"
              aria-hidden="true"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 0a10 10 0 1 0 0 20 10 10 0 0 0 0-20zM8 14a2 2 0 1 1 4 0H8zm1-6a1 1 0 0 1 2 0v4a1 1 0 1 1-2 0V8z"
              />
            </svg>
          </div>
          <p className="ml-2 text-slate-800 font-normal">{toastMessage}</p>
        </div>
      )}
    </div>
  );
}

function EditClientModal({
  client,
  saveEditedClient,
  closeModal,
  formData,
  setFormData,
}) {
  // State variables for edited client data
  const [editedSalutation, setEditedSalutation] = useState(
    client?.salutation || '',
  );
  const [editedClientName, setEditedClientName] = useState(
    client?.clientName || '',
  );
  const [editedClientType, setEditedClientType] = useState(
    client?.clientType || '',
  );
  const [editedPurpose, setEditedPurpose] = useState(client?.purpose || '');
  const [editedAddress, setEditedAddress] = useState(client?.address || '');
  const [editedPhone, setEditedPhone] = useState(client?.phone || '');
  const [editedEmailAddress, setEditedEmailAddress] = useState(
    client?.emailAddress || '',
  );

  // Function to handle saving the edited client data
  const handleSave = () => {
    if (
      editedSalutation &&
      editedClientName &&
      editedClientType &&
      editedPurpose &&
      editedAddress &&
      editedPhone &&
      editedEmailAddress
    ) {
      // Collect edited data
      const editedData = {
        id: client.id,
        salutation: editedSalutation,
        clientName: editedClientName,
        clientType: editedClientType,
        purpose: editedPurpose,
        address: editedAddress,
        phone: editedPhone,
        emailAddress: editedEmailAddress,
      };
      saveEditedClient(editedData);
    } else {
      // Display an alert if any field is empty
      alert('Please fill in all fields.');
    }
  };

  return (
    <div className="p-2 sm:p-12 bg-gray-100 rounded-lg">
      <div className="mb-2 sm:mb-4">
        <label
          htmlFor="salutation"
          className="block text-sm font-medium text-slate-800"
        >
          Salutation
        </label>
        <input
          type="text"
          id="salutation"
          value={editedSalutation}
          onChange={(e) => setEditedSalutation(e.target.value)}
          className="mt-1 py-2 px-3 sm:px-4 focus:ring-red-600 focus:border-red-600 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
        />
      </div>
      <div className="mb-2 sm:mb-4">
        <label
          htmlFor="clientName"
          className="block text-sm font-medium text-slate-800"
        >
          Client Name
        </label>
        <input
          type="text"
          id="clientName"
          value={editedClientName}
          onChange={(e) => setEditedClientName(e.target.value)}
          className="mt-1 py-2 px-3 sm:px-4 focus:ring-red-600 focus:border-red-600 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
        />
      </div>
      <div className="mb-2 sm:mb-4">
        <label
          htmlFor="clientType"
          className="block text-sm font-medium text-slate-800"
        >
          Client Type
        </label>
        <input
          type="text"
          id="clientType"
          value={editedClientType}
          onChange={(e) => setEditedClientType(e.target.value)}
          className="mt-1 py-2 px-3 sm:px-4 focus:ring-red-600 focus:border-red-600 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
        />
      </div>
      <div className="mb-2 sm:mb-4">
        <label
          htmlFor="purpose"
          className="block text-sm font-medium text-slate-800"
        >
          Purpose
        </label>
        <input
          type="text"
          id="purpose"
          value={editedPurpose}
          onChange={(e) => setEditedPurpose(e.target.value)}
          className="mt-1 py-2 px-3 sm:px-4 focus:ring-red-600 focus:border-red-600 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
        />
      </div>
      <div className="mb-2 sm:mb-4">
        <label
          htmlFor="address"
          className="block text-sm font-medium text-slate-800"
        >
          Address
        </label>
        <input
          type="text"
          id="address"
          value={editedAddress}
          onChange={(e) => setEditedAddress(e.target.value)}
          className="mt-1 py-2 px-3 sm:px-4 focus:ring-red-600 focus:border-red-600 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
        />
      </div>
      <div className="mb-2 sm:mb-4">
        <label
          htmlFor="phone"
          className="block text-sm font-medium text-slate-800"
        >
          Phone
        </label>
        <input
          type="text"
          id="phone"
          value={editedPhone}
          onChange={(e) => setEditedPhone(e.target.value)}
          className="mt-1 py-2 px-3 sm:px-4 focus:ring-red-600 focus:border-red-600 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
        />
      </div>
      <div className="mb-2 sm:mb-4">
        <label
          htmlFor="emailAddress"
          className="block text-sm font-medium text-slate-800"
        >
          Email Address
        </label>
        <input
          type="text"
          id="emailAddress"
          value={editedEmailAddress}
          onChange={(e) => setEditedEmailAddress(e.target.value)}
          className="mt-1 py-2 px-3 sm:px-4 focus:ring-red-600 focus:border-red-600 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
        />
      </div>
      <div className="flex justify-end">
        <button
          onClick={handleSave}
          className="mr-2 px-3 py-1 bg-blue-600 text-white rounded-2xl hover:bg-blue-700 sm:px-4"
        >
          Save
        </button>
        <button
          onClick={closeModal}
          className="px-3 py-1 bg-red-700 text-white rounded-2xl hover:bg-red-800 sm:px-4"
        >
          Close
        </button>
      </div>
    </div>
  );
}
export default ViewCustomers;

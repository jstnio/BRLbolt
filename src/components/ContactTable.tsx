import { useState } from 'react';
import { ContactPerson } from '../types/masterData';
import { Plus, Edit2, Trash2, Eye } from 'lucide-react';
import ContactModal from './ContactModal';

interface Props {
  title: string;
  contacts: ContactPerson[];
  onAdd: (contact: ContactPerson) => void;
  onUpdate: (index: number, contact: ContactPerson) => void;
  onDelete: (index: number) => void;
}

export default function ContactTable({ title, contacts = [], onAdd, onUpdate, onDelete }: Props) {
  const [showModal, setShowModal] = useState(false);
  const [selectedContact, setSelectedContact] = useState<{ index: number; contact: ContactPerson } | null>(null);
  const [viewMode, setViewMode] = useState(false);

  const handleAdd = () => {
    setSelectedContact(null);
    setViewMode(false);
    setShowModal(true);
  };

  const handleEdit = (index: number, contact: ContactPerson) => {
    setSelectedContact({ index, contact });
    setViewMode(false);
    setShowModal(true);
  };

  const handleView = (index: number, contact: ContactPerson) => {
    setSelectedContact({ index, contact });
    setViewMode(true);
    setShowModal(true);
  };

  const handleSave = (contact: ContactPerson) => {
    if (selectedContact === null) {
      onAdd(contact);
    } else {
      onUpdate(selectedContact.index, contact);
    }
    setShowModal(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium text-gray-900">{title}</h3>
        <button
          type="button"
          onClick={handleAdd}
          className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Contact
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Position
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Email
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Phone
              </th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {contacts.map((contact, index) => (
              <tr key={index}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {contact.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {contact.position}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {contact.email}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {contact.phone}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    type="button"
                    onClick={() => handleView(index, contact)}
                    className="text-blue-600 hover:text-blue-900 mx-1"
                  >
                    <Eye className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleEdit(index, contact)}
                    className="text-yellow-600 hover:text-yellow-900 mx-1"
                  >
                    <Edit2 className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => onDelete(index)}
                    className="text-red-600 hover:text-red-900 mx-1"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {contacts.length === 0 && (
          <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
            <p className="text-sm text-gray-500">No contacts added yet</p>
          </div>
        )}
      </div>

      {showModal && (
        <ContactModal
          contact={selectedContact?.contact}
          onSave={handleSave}
          onClose={() => setShowModal(false)}
          viewMode={viewMode}
        />
      )}
    </div>
  );
}
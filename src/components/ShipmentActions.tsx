import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Edit2, Trash2, Eye } from 'lucide-react';
import { Shipment } from '../types';
import OceanShipmentForm from './OceanShipmentForm';
import AirShipmentForm from './AirShipmentForm';
import DeleteShipmentModal from './DeleteShipmentModal';

interface Props {
  shipment: Shipment;
}

export default function ShipmentActions({ shipment }: Props) {
  const [showEditForm, setShowEditForm] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const navigate = useNavigate();

  const handleEdit = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setShowEditForm(true);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setShowDeleteModal(true);
  };

  const handleView = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    navigate(`/shipment/${shipment.id}`);
  };

  const handleClose = () => {
    setShowEditForm(false);
    setShowDeleteModal(false);
  };

  return (
    <>
      <div className="flex space-x-2">
        <button
          onClick={handleView}
          className="p-2 text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
          title="View Details"
        >
          <Eye className="h-4 w-4" />
        </button>
        <button
          onClick={handleEdit}
          className="p-2 text-yellow-600 hover:bg-yellow-50 rounded-full transition-colors"
          title="Edit Shipment"
        >
          <Edit2 className="h-4 w-4" />
        </button>
        <button
          onClick={handleDelete}
          className="p-2 text-red-600 hover:bg-red-50 rounded-full transition-colors"
          title="Delete Shipment"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>

      {showEditForm && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            {shipment.type === 'ocean' ? (
              <OceanShipmentForm
                shipment={shipment}
                onClose={handleClose}
              />
            ) : (
              <AirShipmentForm
                shipment={shipment}
                onClose={handleClose}
              />
            )}
          </div>
        </div>
      )}

      {showDeleteModal && (
        <DeleteShipmentModal
          shipmentId={shipment.id}
          onClose={handleClose}
        />
      )}
    </>
  );
}
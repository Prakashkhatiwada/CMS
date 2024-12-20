import React from 'react';
import { Contact } from '../types';
import { PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import { supabase } from '../lib/supabase';
import { toast } from 'react-hot-toast';

interface ContactListProps {
  contacts: Contact[];
  onEdit: (contact: Contact) => void;
  onDelete: (id: string) => void;
}

export function ContactList({ contacts, onEdit, onDelete }: ContactListProps) {
  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('contacts')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      onDelete(id);
      toast.success('Contact deleted successfully');
    } catch (error) {
      toast.error('Error deleting contact');
    }
  };

  return (
    <div className="mt-8">
      <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
        <table className="min-w-full divide-y divide-gray-300">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Name</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Email</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Phone</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {contacts.map((contact) => (
              <tr key={contact.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {contact.first_name} {contact.last_name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{contact.email}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{contact.phone}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  <button
                    onClick={() => onEdit(contact)}
                    className="text-blue-600 hover:text-blue-900 mr-4"
                  >
                    <PencilIcon className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => handleDelete(contact.id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    <TrashIcon className="h-5 w-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
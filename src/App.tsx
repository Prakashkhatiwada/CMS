import { useEffect, useState } from 'react';
import { Auth } from './components/Auth';
import { ContactForm } from './components/ContactForm';
import { ContactList } from './components/ContactList';
import { Contact, User } from './types';
import { supabase } from './lib/supabase';
import { Toaster } from 'react-hot-toast';

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [editingContact, setEditingContact] = useState<Contact | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (user) {
      fetchContacts();
    }
  }, [user]);

  const fetchContacts = async () => {
    if (!user) return;
    
    const { data, error } = await supabase
      .from('contacts')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching contacts:', error);
      return;
    }
    
    setContacts(data);
  };

  if (!user) {
    return (
      <>
        <Toaster position="top-right" />
        <Auth />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Toaster position="top-right" />
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="bg-white rounded-lg shadow px-5 py-6 sm:px-6">
            <div className="border-b border-gray-200 pb-5 flex justify-between items-center">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                {editingContact ? 'Edit Contact' : 'Add New Contact'}
              </h3>
              <button
                onClick={() => supabase.auth.signOut()}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700"
              >
                Sign Out
              </button>
            </div>
            
            <div className="mt-5">
              <ContactForm
                onSuccess={() => {
                  fetchContacts();
                  setEditingContact(null);
                }}
                initialData={editingContact ? {
                  first_name: editingContact.first_name,
                  last_name: editingContact.last_name,
                  email: editingContact.email,
                  phone: editingContact.phone
                } : undefined}
                isEditing={!!editingContact}
                contactId={editingContact?.id}
              />
            </div>

            <ContactList
              contacts={contacts}
              onEdit={setEditingContact}
              onDelete={() => fetchContacts()}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
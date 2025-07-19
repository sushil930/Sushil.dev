import React, { useState } from 'react';
import AddProjectForm from '../components/admin/add-project-form';
import ManageProjects from '../components/admin/manage-projects';

const AddProjectPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('manageProjects');
  return (
    <div className="min-h-screen bg-gray-950 py-12 px-4 sm:px-6 lg:px-8">
            <div className="flex justify-center mb-8 border-b-2 border-[var(--pixel-orange)]">
        <button onClick={() => setActiveTab('manageProjects')} className={`retro-button px-6 py-2 text-sm ${activeTab === 'manageProjects' ? 'bg-[var(--pixel-orange)] text-[var(--dark-navy)]' : 'text-[var(--pixel-orange)]'}`}>Manage Projects</button>
        <button onClick={() => setActiveTab('addProject')} className={`retro-button px-6 py-2 text-sm ${activeTab === 'addProject' ? 'bg-[var(--pixel-orange)] text-[var(--dark-navy)]' : 'text-[var(--pixel-orange)]'}`}>Add Project</button>
      </div>
      {activeTab === 'manageProjects' && <ManageProjects />}
      {activeTab === 'addProject' && <AddProjectForm />}
    </div>
  );
};

export default AddProjectPage;

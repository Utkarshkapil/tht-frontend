import React, { useState, useEffect } from 'react';
import { DndContext, closestCenter } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import { KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import DocumentGrid from './components/DocumentGrid';
import Overlay from './components/Overlay';
import './App.css';

const API_URL = 'http://localhost:8000';

function App() {
  const [documents, setDocuments] = useState([]);
  const [status, setStatus] = useState('');
  const [selectedDocument, setSelectedDocument] = useState(null);

  useEffect(() => {
    
    const fetchDocuments = async () => {
      try {
        const response = await fetch(`${API_URL}/documents`);
        if (!response.ok) {
          throw new Error('Failed to fetch documents');
        }
        const data = await response.json();
        setDocuments(data);
      } catch (error) {
        console.error('Error fetching documents:', error);
      }
    };

    fetchDocuments();
  }, []);

  useEffect(() => {
   
    const saveInterval = setInterval(saveDocuments, 5000);
    return () => clearInterval(saveInterval);
  }, [documents]);

  const saveDocuments = async () => {
    setStatus('Saving...');
    try {
      const response = await fetch(`${API_URL}/documents`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(documents),
      });
      if (!response.ok) {
        throw new Error('Failed to save documents');
      }
      setStatus(`Last saved: ${new Date().toLocaleTimeString()}`);
    } catch (error) {
      console.error('Error saving documents:', error);
      setStatus('Error saving documents');
    }
  };

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event) => {
    const { active, over } = event;
    
    if (active.id !== over.id) {
      const oldIndex = documents.findIndex(doc => doc.id === active.id);
      const newIndex = documents.findIndex(doc => doc.id === over.id);
      const updatedItems = arrayMove(documents, oldIndex, newIndex).map((item, index) => ({
        ...item,
        position: index,
      }));

      console.log('Updated documents:', updatedItems); 

      setDocuments(updatedItems);
    }
  };

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <div className="App">
        <h1>Document Manager</h1>
        <div className="status">{status}</div>
        <SortableContext items={documents.map(doc => doc.id)}>
          <DocumentGrid 
            documents={documents}
            onDocumentClick={setSelectedDocument}
          />
        </SortableContext>
        {selectedDocument && (
          <Overlay 
            document={selectedDocument} 
            onClose={() => setSelectedDocument(null)} 
          />
        )}
      </div>
    </DndContext>
  );
}

export default App;


import React , { useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';



const DocumentCard = ({ doc, onDocumentClick }) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: doc.id });
  const [isDragging, setIsDragging] = useState(false);

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const handleMouseDown = () => {
    setIsDragging(false); 
  };

  const handleMouseMove = () => {
    setIsDragging(true); 
  };

  const handleMouseUp = () => {
    if (!isDragging) {
      
      console.log("document click called", doc);
      onDocumentClick(doc);
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="card"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    >
      <h3>{doc.title}</h3>
      <img src={doc.imageurl} alt={doc.title} />
    </div>
  );
};


const DocumentGrid = ({ documents, onDocumentClick }) => {
  return (
    <div className="grid-container">
      <div className="grid">
        {documents.slice(0, 3).map((doc) => (
          <DocumentCard key={doc.id} doc={doc} onDocumentClick={onDocumentClick} />
        ))}
      </div>
      <div className="grid">
        {documents.slice(3).map((doc) => (
          <DocumentCard key={doc.id} doc={doc} onDocumentClick={onDocumentClick} />
        ))}
      </div>
    </div>
  );
};

export default DocumentGrid;

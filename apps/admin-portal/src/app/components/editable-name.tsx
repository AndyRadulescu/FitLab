import { Check, Pencil, X } from 'lucide-react';
import { useState, MouseEvent } from 'react';
import { updateUserName } from '../firestore/queries';
import { userStore } from '../store/user.store';

interface EditableNameProps {
  userId: string;
  initialName: string;
  className?: string;
  inputClassName?: string;
}

export const EditableName = ({ userId, initialName, className = '', inputClassName = '' }: EditableNameProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(initialName);
  const [isSaving, setIsSaving] = useState(false);
  const updateUserInList = userStore((state) => state.updateUserInList);

  const handleStartEdit = (e: MouseEvent) => {
    e.stopPropagation();
    setEditedName(initialName);
    setIsEditing(true);
  };

  const handleCancel = (e: MouseEvent) => {
    e.stopPropagation();
    setIsEditing(false);
  };

  const handleSave = async (e?: MouseEvent) => {
    e?.stopPropagation();
    if (!userId || !editedName.trim()) return;

    setIsSaving(true);
    try {
      await updateUserName(userId, editedName.trim());
      updateUserInList(userId, { displayName: editedName.trim() });
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update user name:', error);
      alert('Failed to update user name. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  if (isEditing) {
    return (
      <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
        <input
          type="text"
          value={editedName}
          onChange={(e) => setEditedName(e.target.value)}
          className={`bg-indigo-50 border-b-2 border-indigo-400 focus:outline-none px-1 rounded-t-sm text-gray-800 ${inputClassName}`}
          autoFocus
          disabled={isSaving}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleSave();
            if (e.key === 'Escape') setIsEditing(false);
          }}
        />
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="p-1 hover:bg-green-100 rounded text-green-600 transition-colors"
          title="Save"
        >
          <Check className="h-4 w-4" />
        </button>
        <button
          onClick={handleCancel}
          disabled={isSaving}
          className="p-1 hover:bg-red-100 rounded text-red-600 transition-colors"
          title="Cancel"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    );
  }

  return (
    <div className={`flex items-center gap-2 group ${className}`}>
      <span>{initialName}</span>
      <button
        onClick={handleStartEdit}
        className="p-1 group-hover:opacity-100 hover:bg-gray-100 rounded text-gray-400 hover:text-indigo-600 transition-all"
        title="Edit Name"
      >
        <Pencil className="h-4 w-4" />
      </button>
    </div>
  );
};

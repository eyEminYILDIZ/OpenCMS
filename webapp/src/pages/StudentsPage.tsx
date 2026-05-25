import { useState } from 'react';
import { PlusCircle, Pencil, Trash2 } from 'lucide-react';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Label from '../components/ui/Label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/Select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from '../components/ui/Dialog';

type Gender = 'male' | 'female' | 'other';

interface Student {
  id: number;
  name: string;
  age: number;
  gender: Gender;
}

interface StudentFormState {
  name: string;
  age: string;
  gender: Gender | '';
}

interface FormErrors {
  name?: string;
  age?: string;
  gender?: string;
}

const EMPTY_FORM: StudentFormState = { name: '', age: '', gender: '' };

const GENDER_LABELS: Record<Gender, string> = {
  male: 'Male',
  female: 'Female',
  other: 'Other',
};

let nextId = 1;

function validateForm(form: StudentFormState): FormErrors {
  const errors: FormErrors = {};
  if (!form.name.trim()) errors.name = 'Name is required.';
  const ageNum = Number(form.age);
  if (!form.age.trim()) {
    errors.age = 'Age is required.';
  } else if (!Number.isInteger(ageNum) || ageNum < 1 || ageNum > 150) {
    errors.age = 'Age must be a whole number between 1 and 150.';
  }
  if (!form.gender) errors.gender = 'Gender is required.';
  return errors;
}

const StudentsPage = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [addOpen, setAddOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Student | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Student | null>(null);
  const [form, setForm] = useState<StudentFormState>(EMPTY_FORM);
  const [errors, setErrors] = useState<FormErrors>({});

  const openAdd = () => {
    setForm(EMPTY_FORM);
    setErrors({});
    setAddOpen(true);
  };

  const openEdit = (student: Student) => {
    setForm({ name: student.name, age: String(student.age), gender: student.gender });
    setErrors({});
    setEditTarget(student);
  };

  const handleFieldChange = (field: keyof StudentFormState, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
    if (errors[field as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handleAdd = () => {
    const errs = validateForm(form);
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    const student: Student = {
      id: nextId++,
      name: form.name.trim(),
      age: Number(form.age),
      gender: form.gender as Gender,
    };
    setStudents(prev => [...prev, student]);
    setAddOpen(false);
  };

  const handleEdit = () => {
    if (!editTarget) return;
    const errs = validateForm(form);
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setStudents(prev =>
      prev.map(s =>
        s.id === editTarget.id
          ? { ...s, name: form.name.trim(), age: Number(form.age), gender: form.gender as Gender }
          : s,
      ),
    );
    setEditTarget(null);
  };

  const handleDelete = () => {
    if (!deleteTarget) return;
    setStudents(prev => prev.filter(s => s.id !== deleteTarget.id));
    setDeleteTarget(null);
  };

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Students</h1>
          <p className="page-subtitle">Manage student records</p>
        </div>
        <Button onClick={openAdd}>
          <PlusCircle size={16} />
          Add Student
        </Button>
      </div>

      <div className="card">
        <div className="table-wrapper">
          <table className="table">
            <thead className="table-header">
              <tr className="table-header-row">
                <th className="table-head">#</th>
                <th className="table-head">Name</th>
                <th className="table-head">Age</th>
                <th className="table-head">Gender</th>
                <th className="table-head" style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody className="table-body">
              {students.length === 0 ? (
                <tr>
                  <td colSpan={5} className="table-cell table-empty">
                    No students yet. Click &ldquo;Add Student&rdquo; to create one.
                  </td>
                </tr>
              ) : (
                students.map((student, index) => (
                  <tr key={student.id} className="table-row">
                    <td className="table-cell" style={{ color: 'var(--muted-foreground)' }}>
                      {index + 1}
                    </td>
                    <td className="table-cell" style={{ fontWeight: 500 }}>
                      {student.name}
                    </td>
                    <td className="table-cell">{student.age}</td>
                    <td className="table-cell">
                      <span className={`badge badge-${student.gender}`}>
                        {GENDER_LABELS[student.gender]}
                      </span>
                    </td>
                    <td className="table-cell">
                      <div className="actions-row" style={{ justifyContent: 'flex-end' }}>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openEdit(student)}
                          aria-label={`Edit ${student.name}`}
                        >
                          <Pencil size={14} />
                          Edit
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setDeleteTarget(student)}
                          aria-label={`Delete ${student.name}`}
                          style={{ color: 'var(--destructive)' }}
                        >
                          <Trash2 size={14} />
                          Delete
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Dialog */}
      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Student</DialogTitle>
            <DialogDescription>Fill in the details to add a new student record.</DialogDescription>
          </DialogHeader>
          <StudentForm form={form} errors={errors} onChange={handleFieldChange} />
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button onClick={handleAdd}>Add Student</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={editTarget !== null} onOpenChange={open => { if (!open) setEditTarget(null); }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Student</DialogTitle>
            <DialogDescription>Update the student&apos;s information below.</DialogDescription>
          </DialogHeader>
          <StudentForm form={form} errors={errors} onChange={handleFieldChange} />
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditTarget(null)}>Cancel</Button>
            <Button onClick={handleEdit}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteTarget !== null} onOpenChange={open => { if (!open) setDeleteTarget(null); }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Student</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete <strong>{deleteTarget?.name}</strong>? This action
              cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteTarget(null)}>Cancel</Button>
            <Button variant="destructive" onClick={handleDelete}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

interface StudentFormProps {
  form: StudentFormState;
  errors: FormErrors;
  onChange: (field: keyof StudentFormState, value: string) => void;
}

const StudentForm = ({ form, errors, onChange }: StudentFormProps) => (
  <>
    <div className="form-field">
      <Label htmlFor="student-name">Name</Label>
      <Input
        id="student-name"
        placeholder="e.g. Alice Johnson"
        value={form.name}
        onChange={e => onChange('name', e.target.value)}
      />
      {errors.name && <span className="field-error">{errors.name}</span>}
    </div>

    <div className="form-field">
      <Label htmlFor="student-age">Age</Label>
      <Input
        id="student-age"
        type="number"
        placeholder="e.g. 20"
        min={1}
        max={150}
        value={form.age}
        onChange={e => onChange('age', e.target.value)}
      />
      {errors.age && <span className="field-error">{errors.age}</span>}
    </div>

    <div className="form-field">
      <Label htmlFor="student-gender">Gender</Label>
      <Select value={form.gender} onValueChange={val => onChange('gender', val)}>
        <SelectTrigger id="student-gender">
          <SelectValue placeholder="Select gender" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="male">Male</SelectItem>
          <SelectItem value="female">Female</SelectItem>
          <SelectItem value="other">Other</SelectItem>
        </SelectContent>
      </Select>
      {errors.gender && <span className="field-error">{errors.gender}</span>}
    </div>
  </>
);

export default StudentsPage;

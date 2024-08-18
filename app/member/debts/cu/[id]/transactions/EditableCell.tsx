// src/components/EditableCell.tsx
import React, { useState } from 'react';
import { useFormik } from 'formik';
import { ValidationSchemaEditInline } from '../DataValidationSchema';


interface EditableCellProps {
    initialValue: any;
    id: string;
    field: string;
    onSave: (id: string, field: string, value: any) => Promise<void>;
    isEditable: boolean;
  }

const EditableCell: React.FC<EditableCellProps> = ({ initialValue, id, field, onSave, isEditable }) => {
  // Define a dynamic validation schema based on field type
  
  const [editing, setEditing] = useState(isEditable);
  const validationSchema:any =  ValidationSchemaEditInline
 

  const formik:any = useFormik({
    initialValues: { value: initialValue },
    validationSchema: validationSchema.shape({ value: validationSchema.fields[field] }),
    
    onSubmit: async (values) => {
        await onSave(id, field, values.value);
        setEditing(false);
    },
  });

  const handleBlur = async () => {
    if (formik.isSubmitting) return;
    await formik.submitForm();
    setEditing(false);
  };

  const renderInput = () => {
    switch (field) {
      case 'trans_date':
        return (
          <input
            type="date"
            name="trans_date"
            value={formik.values.value}
            onChange={formik.handleChange}
            onBlur={handleBlur}
            autoFocus
          />
        );
      case 'billing_month_year':
        return (
          <input
            type="text"
            name="value"
            value={formik.values.value}
            onChange={formik.handleChange}
            onBlur={handleBlur}
            autoFocus
          />
        );
      case 'type':
        return (
          <input
            type="text"
            name="value"
            value={formik.values.value}
            onChange={formik.handleChange}
            onBlur={handleBlur}
            autoFocus
          />
        );
      default:
        return (
          <input
            type="number"
            name="value"
            className="w-[50%] rounded border border-stroke bg-transparent outline-none focus:border-[#0a4a82] focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-[#0a4a82]"
            value={formik.values.value}
            onChange={formik.handleChange}
            onBlur={handleBlur}
            autoFocus
          />
        );
    }
  };

  return (
    <form onSubmit={formik.handleSubmit}>
      {editing || formik.errors.value ? (
        renderInput()
      ) : (
        <span onClick={() => setEditing(true)}>{formik.values.value}</span>
      )}
      {formik.errors.value && formik.touched.value && (
        <div style={{ color: 'red' }}>{formik.errors.value}</div>
      )}
    </form>
  );
};

export default EditableCell;

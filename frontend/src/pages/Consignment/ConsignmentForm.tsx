import React from 'react';
import { useForm } from 'react-hook-form';

interface IFormInput {
  accountId: string;
  description: string;
  preferContact: string;
  files: FileList;
}

const ConsignmentForm: React.FC = () => {
  const { register, handleSubmit, watch, formState: { errors } } = useForm<IFormInput>();
  const onSubmit = (data: IFormInput) => {
    // Handle form submission here
    console.log(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <label>
        Account ID:
        <input {...register("accountId", { required: true })} />
        {errors.accountId && <span>This field is required</span>}
      </label>
      <label>
        Description:
        <input {...register("description", { required: true })} />
        {errors.description && <span>This field is required</span>}
      </label>
      <label>
        Preferred Contact:
        <input {...register("preferContact", { required: true })} />
        {errors.preferContact && <span>This field is required</span>}
      </label>
      <label>
        Files:
        <input type="file" {...register("files", { required: true })} multiple />
        {errors.files && <span>This field is required</span>}
      </label>
      <input type="submit" />
    </form>
  );
};

export default ConsignmentForm;
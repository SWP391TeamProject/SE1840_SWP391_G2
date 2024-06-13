import { useFormContext } from "react-hook-form";

export default function FileInput({ name }: { name: string }) {
  const { register } = useFormContext();

  return (
    <div>
      <input type="file" multiple {...register(name)} />
    </div>
  );
}

import { useState, ChangeEvent, ChangeEventHandler } from "react";

interface FieldsType {
  [key: string | symbol]: string;
}

export function useFormFields(initialState: FieldsType): [FieldsType, ChangeEventHandler] {
  const [fields, setFields] = useState(initialState);

  const handleFieldChange = (event: ChangeEvent<HTMLInputElement>) => {
    setFields({ ...fields, [event.target.id]: event.target.value });
  };

  return [fields, handleFieldChange];
}

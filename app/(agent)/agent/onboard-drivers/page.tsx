"use client";

import { FormInput } from "@/components/FormInput";
import { Button } from "@/components/ui/button";
import { useAddVehicle } from "@/lib/hooks/agent.hook";
import React from "react";
import { useForm } from "react-hook-form";

type FormData = {
  plate_number: string;
  owner_name: string;
  phone_number: string;
};
const TaxpayerOnboardingPage = () => {
  const { mutateAsync: addVehicle } = useAddVehicle();
  const { handleSubmit, register, reset } = useForm<FormData>({});

  const onSubmit = async (data: FormData) => {
    try {
      await addVehicle(data);
      reset();
    } catch (error) {}
  };
  return (
    <div className="max-w-xl items-center justify-center">
      <form action="" onSubmit={handleSubmit(onSubmit)}>
        <FormInput
          register={register}
          name="plate_number"
          label="Plate Number"
          placeholder=""
          required
        />
        <FormInput
          register={register}
          name="owner_name"
          label="Owner Name"
          placeholder=""
          required
        />
        <FormInput
          register={register}
          name="phone_number"
          label="Phone Number"
          placeholder=""
          required
        />
        <Button type="submit">Add Vehicle</Button>
      </form>
    </div>
  );
};

export default TaxpayerOnboardingPage;

"use client";

import { FormInput } from "@/components/FormInput";
import { Button } from "@/components/ui/button";
import { useAddVehicle } from "@/lib/hooks/agent.hook";
import React from "react";
import { useForm } from "react-hook-form";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Plus } from "lucide-react";

type FormData = {
  plate_number: string;
  owner_name: string;
  phone_number: string;
};
const AgentAddVehicle = () => {
  const { mutateAsync: addVehicle, isPending } = useAddVehicle();
  const { handleSubmit, register, reset } = useForm<FormData>({});
  const [openModal, setOpenModal] = React.useState(false);

  const onSubmit = async (data: FormData) => {
    try {
      await addVehicle(data);
      reset();
      setOpenModal(false);
    } catch (error) {}
  };
  return (
    <div>
      <Dialog open={openModal} onOpenChange={setOpenModal}>
        <DialogTrigger asChild>
          <Button>
            <Plus />
          </Button>
        </DialogTrigger>

        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Vehicle</DialogTitle>
            <DialogDescription>
              Fill in the details below to add a new vehicle.
            </DialogDescription>
          </DialogHeader>
          <div className="w-full mx-auto items-center justify-center">
            <form
              action=""
              className="bg-card rounded-md p-4"
              onSubmit={handleSubmit(onSubmit)}
            >
              <FormInput
                register={register}
                name="plate_number"
                label="Plate Number"
                placeholder="Plate Number"
                required
              />
              <FormInput
                register={register}
                name="owner_name"
                label="Owner Name"
                placeholder="Enter Driver's Name"
                required
              />
              <FormInput
                register={register}
                name="phone_number"
                label="Phone Number"
                placeholder="Phone Number"
                required
              />
              <Button
                type="submit"
                disabled={isPending}
                className="w-full mt-4"
              >
                {isPending ? "Adding..." : "Add Vehicle"}
              </Button>
            </form>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AgentAddVehicle;

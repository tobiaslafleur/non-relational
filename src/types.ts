import { ObjectId } from "mongodb";

export type User = {
  _id: ObjectId;
  email: string;
  firstname: string;
  lastname: string;
  loyaltyProgram: {
    enrolled: boolean;
    points: number;
  };
  rentals: string[];
  role: Role;
  employeeInformation?: {
    position: string;
    location: string;
  };
  comments?: string[];
};

export type Rental = {
  _id: ObjectId;
  user: string;
  vehicle: string;
  condition?: {
    before: string;
    after: string;
  };
  miles?: {
    before: number;
    after: number;
  };
  payment: {
    method: PaymentMethod;
    amount: number;
    pointsGenerated: number;
  };
  location: {
    pickup: Location;
    dropoff: Location;
  };
  date: {
    pickup: Date;
    dropoff: Date;
  };
};

export type Location = {
  _id: ObjectId;
  name: string;
};

export type Vehicle = {
  _id: ObjectId;
  name: string;
  type: VehicleType;
  rentals: string[];
  location: string;
  status: VehicleStatus;
};

export type Comments = {
  _id: ObjectId;
  user: string;
  comments: string[];
};

export type Role = "CUSTOMER" | "EMPLOYEE" | "MANAGER";
export type VehicleType = "SEDAN" | "SUV" | "TRUCK";
export type VehicleStatus = "AVAILABLE" | "UNAVAILABLE";
export type PaymentMethod = "MONEY" | "POINTS";

import { ObjectId } from "mongodb";

export type User = {
  _id?: ObjectId;
  email: string;
  firstname: string;
  lastname: string;
  loyaltyProgram: {
    enrolled: boolean;
    points: number;
  };
  rentals?: ObjectId[];
  role: Role;
  employeeInformation?: {
    position?: string;
    location?: ObjectId;
  };
  comments?: {
    author: ObjectId;
    comment: string;
  }[];
};

export type Rental = {
  _id?: ObjectId;
  user: User;
  vehicle: Vehicle;
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
  _id?: ObjectId;
  name: string;
};

export type Vehicle = {
  _id?: ObjectId;
  name: string;
  type: VehicleType;
  rentals: ObjectId[];
  location: ObjectId;
  status: VehicleStatus;
};

export type Role = "CUSTOMER" | "EMPLOYEE" | "MANAGER";
export type VehicleType = "SEDAN" | "SUV" | "TRUCK";
export type VehicleStatus = "AVAILABLE" | "UNAVAILABLE";
export type PaymentMethod = "MONEY" | "POINTS";

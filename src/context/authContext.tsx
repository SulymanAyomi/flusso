"use client";
import { createContext, useContext, useEffect, useState } from "react";
import type { BookingData } from "@/features/flight/type";

interface BookingContextProps {
  email: string;
  setEmail: React.Dispatch<React.SetStateAction<string>>;
}

const AuthContext = createContext<BookingContextProps | null>(null);

export function BookingProvider({ children }: { children: React.ReactNode }) {
  const [bookingData, setBookingData] = useState<BookingData>({
    selectedPassengers: {
      adults: 1,
      children: 0,
    },
    steps: 0,
  });

  // Load persisted data (exclude payment)
  useEffect(() => {
    const saved = localStorage.getItem("bookingData");
    if (saved) {
      const parsed: BookingData = JSON.parse(saved);
      setBookingData(parsed);
    }
  }, []);

  // Persist updates (excluding payment)
  useEffect(() => {
    const { ...safeData } = bookingData;
    localStorage.setItem("bookingData", JSON.stringify(safeData));
  }, [bookingData]);

  const resetBooking = () => {
    setBookingData({
      selectedPassengers: {
        adults: 1,
        children: 0,
      },
      steps: 0,
    });
    localStorage.removeItem("bookingData");
  };

  return (
    <BookingContext.Provider
      value={{ bookingData, setBookingData, resetBooking }}
    >
      {children}
    </BookingContext.Provider>
  );
}

export function useBooking() {
  const ctx = useContext(BookingContext);
  if (!ctx) throw new Error("useBooking must be used inside BookingProvider");
  return ctx;
}

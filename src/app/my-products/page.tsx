"use client";

import React, { useEffect, useState } from "react";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Prisma } from "@prisma/client";
import Link from "next/link";

import UserReservationItem from "./components/userTripReservation";
import Button from "@/components/Button";

const MyProducts = () => {
  const [reservations, setReservations] = useState<
    Prisma.ProductReservationGetPayload<{
      include: { product: true };
    }>[]
  >([]);

  const { status, data } = useSession();

  const router = useRouter();

  const fetchReservations = async () => {
    const response = await fetch(
      `/api/user/${(data?.user as any)?.id}/reservations`
    );

    const json = await response.json();

    setReservations(json);
  };

  useEffect(() => {
    if (status === "unauthenticated") {
      return router.push("/");
    }

    fetchReservations();
  }, [status]);

  return (
    <div className="container mx-auto p-5">
      <h1 className="font-semibold text-primaryDarker text-xl lg:mb-5">
        Minhas Compras
      </h1>
      {reservations.length > 0 ? (
        <div className="flex flex-col lg:grid lg:grid-cols-3 lg:gap-14">
          {reservations?.map((reservation) => (
            <UserReservationItem
              fetcheReservation={fetchReservations}
              key={reservation.id}
              reservation={reservation}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col lg:max-w-[500px]">
          <p className="mt-2 font-medium text-primaryDarker">
            Você ainda não tem nenhuma compra!
          </p>

          <Link href="/">
            <Button className="w-full mt-2 lg:mt-5">Fazer compra</Button>
          </Link>
        </div>
      )}
    </div>
  );
};
export default MyProducts;

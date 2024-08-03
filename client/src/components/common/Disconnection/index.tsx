"use client";

import React from "react";
import io from "socket.io-client";
import { useEffect, useState } from "react";
import { Wifi } from "iconsax-react";
import style from "./disconnection.module.css";
import useDisconnectionStore from "@/store/useDisconnectionStore";

const socket = io("http://192.168.100.103:8001", {
  transports: ["websocket"],
});

const Disconnection = () => {
  const { socketDisconnected, setSocketDisconnected } = useDisconnectionStore(
    (state) => state
  );

  useEffect(() => {
    socket.on("connect", () => {
      setSocketDisconnected(false);
    });
    socket.on("disconnect", () => {
      setSocketDisconnected(true);
    });

    return () => {
      socket.on("connect", () => {
        setSocketDisconnected(false);
      });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      {socketDisconnected && (
        <div className={style.disconnectContainer}>
          <Wifi size="16" color="white" />
          <p className={style.text}>Please check your connection</p>
        </div>
      )}
    </>
  );
};

export default Disconnection;

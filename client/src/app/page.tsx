"use client";

import { useState } from "react";
import styles from "./page.module.css";
import io from "socket.io-client";
import Chat from "@/components/chat";
import useDisconnectionStore from "@/store/useDisconnectionStore";

const socket = io("http://192.168.100.103:8001", {
  transports: ["websocket"],
});

export default function Home() {
  const [username, setUsername] = useState("");
  const [room, setRoom] = useState("");
  const [showChat, setShowChat] = useState(false);

  const joinRoom = () => {
    if (username && room) {
      socket.emit("join_room", room);
      setShowChat(true);
    }
  };

  const { socketDisconnected } = useDisconnectionStore((state) => state);
  console.log(socketDisconnected);

  return (
    <>
      {!showChat ? (
        <main className={styles.main}>
          <h3>Join A Chat</h3>
          <input
            className={styles.inputs}
            type="text"
            placeholder="Your Name ..."
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            className={styles.inputs}
            type="text"
            placeholder="Room ..."
            onChange={(e) => setRoom(e.target.value)}
          />
          <button
            disabled={socketDisconnected}
            className={` ${
              socketDisconnected ? styles.disabledButton : styles.joinButton
            }`}
            onClick={joinRoom}
          >
            Join The Room
          </button>
        </main>
      ) : (
        <Chat room={room} socket={socket} username={username} />
      )}
    </>
  );
}

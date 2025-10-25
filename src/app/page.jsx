"use client";

import React from "react";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const router = useRouter();

  const handleAccess = () => {
    router.push("/login");
  };

  return (
    <div className="homeContainer">
      <div className="homeContent">
        <div className="logoContainer">
          <img src="/temp/logosemtransparente.png" alt="Logo CondoWay" />
        </div>
        <h1>
          Bem-vindo ao <span>CondoWay</span>
        </h1>
        <p>Gerencie, conecte e simplifique a vida em condomínio.</p>
        <button onClick={handleAccess}>Acessar o Sistema</button>
      </div>

      <style jsx>{`
        .homeContainer {
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 100vh;
          background: linear-gradient(135deg, #5ba8f0, #5bd1c5);
          color: white;
          font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
          text-align: center;
        }

        .homeContent {
          display: flex;
          flex-direction: column;
          align-items: center;
          background: rgba(255, 255, 255, 0.15);
          padding: 3rem;
          border-radius: 20px;
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
          max-width: 500px;
        }

        .logoContainer {
          width: 100px;
          height: 100px;
          border-radius: 50%;
          background: white;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 1.5rem;
        }

        .logoContainer img {
          width: 80%;
          height: 80%;
          object-fit: contain;
        }

        h1 {
          font-size: 2rem;
          font-weight: 700;
          margin-bottom: 0.5rem;
        }

        h1 span {
          color: #0b355d;
        }

        p {
          font-size: 1rem;
          opacity: 0.9;
          margin-bottom: 2rem;
        }

        button {
          padding: 0.9rem 2rem;
          background: white;
          color: #0072c6;
          font-size: 1rem;
          font-weight: 600;
          border: none;
          border-radius: 10px;
          cursor: pointer;
          transition: 0.3s;
        }

        button:hover {
          transform: translateY(-2px);
          background: #f1faff;
          box-shadow: 0 6px 15px rgba(74, 144, 226, 0.3);
        }
      `}</style>
    </div>
  );
}

import { useState } from "react";

const SendNotification = () => {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [alertMessage, setAlertMessage] = useState("");
  const idOrganisation = localStorage.getItem("idOrganisation");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const notificationData = {
      data: { title, body, idOrganisation },
    };

    try {
      const response = await fetch(
        "https://betkiff-back-test.vercel.app/notifications/sendToOrganisation",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(notificationData),
        }
      );

      const result = await response.text();
      setAlertMessage(result);
    } catch (error) {
      setAlertMessage("Erreur lors de l'envoi de la notification.");
    }
  };

  return (
    <div>
      <h2>Envoyer une Notification</h2>
      {alertMessage && <p>{alertMessage}</p>}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Titre"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <textarea
          placeholder="Message"
          value={body}
          onChange={(e) => setBody(e.target.value)}
          required
        />
        <button type="submit">Envoyer</button>
      </form>
    </div>
  );
};

export default SendNotification;
